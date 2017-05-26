// TODO legacy code, rewrite in react, get rid of globals

import { sanitizePostUrl } from "./urlutils.js";
import ReactDOM from 'react-dom';
import React from 'react';
require("./iframeresize"); // require iframe resizer middleware

var files = [];


window.posturl = sanitizePostUrl(url_params.posturl);

window.keyPress = () => {
  var comment = document.getElementById("comment").value;
  var title = document.getElementById("IDtweet_title").value;
  var wrg = parseInt(document.getElementById("inputAmount").value);
  var t_limit = $("#IDtweet_title").attr("maxlength");
  var t_delta = t_limit - title.length;
  $("span.twitter-limit").html(t_delta);
  var limit = $("#comment").attr("maxlength");
  var delta = limit - comment.length;
  $("label.comment-limit").html(delta);
  var b_limit = parseInt($("#wrgBalance").html());
  if (b_limit < wrg) {
    $(".donation-form").addClass("has-error");
    $(".help-block").show();
  } else {
    if ($(".donation-form").hasClass("has-error")) {
      $(".donation-form").removeClass("has-error");
      $(".help-block").hide();
    }
  }
  frameReady();
};

window.sendComment = () => {
  var amount = document.getElementById("inputAmount").value;
  if (amount < 0) {
    return alert("Wrong donate value");
  }
  sendTitterComment(amount);
};

function deactivateButton() {
  $("#sendButton").addClass("disabled");
  var buttonText = $("#sendButton").html();
  buttonText = buttonText.replace("Submit", "Sending...");
  $("#sendButton").html(buttonText);
  $("#sendButton img").show();
  $("#sendButton span").hide();
}

function activateButton() {
  $("#sendButton").removeClass("disabled");
  var buttonText = $("#sendButton").html();
  buttonText = buttonText.replace("Sending...", "Submit");
  $("#sendButton").html(buttonText);
  $("#sendButton img").hide();
  $("#sendButton span").show();
}

const genFormData = () => {
  var comment = document.getElementById("comment").value;
  var title = document.getElementById("IDtweet_title").value;
  var data = new FormData();
  var _data = {
    text: comment,
    title: title,
    comment: posturl
  };

  var len = files.length;
  if (len > 3) len = 3;

  for (var i = 0; i < len; i++) {
    data.append("images[]", files[i]);
  }

  $.each(_data, function(key, value) {
    data.append(key, value);
  });
  return data;
};

const raiseUnlockPopup = function(callback) {
  return window.open(callback, "name", "width=800,height=500");
};

window.addEventListener("message", msg => {
  // callback to listen data sent back from the popup
  console.log("GOT message", msg);
  try {
    let msgdata = JSON.parse(msg.data);
    if (msgdata.closePopup) {
      cancelUnlock();
    }
    if (msgdata.cancelPopup) {
      console.log("Canceling popup");
      activateButton();
      cancelUnlock();
    }

    if (msgdata.reload) {
      console.log("Reload required");
      window.location.reload();
    }

    if (msgdata.txId) {
      console.log("GOT TX id to watch!", msgdata.txId);
      resultMsg(
          "You've donated " +
          window.savedAmount +
          " THX. Thank you! It may take a few minutes before your comment is displayed."
      );
      resetFields();
      afterDonate(window.savedAmount);
      watchTX("...", msgdata.txId)
        .then(() => {

        })
        .catch(err => {
          console.log(err);
          resultMsg(
            "Failed to process trasaction, reason:" + err.responseText,true
          );
          $("#faucetLoader").hide();
          activateButton();
        });
    }
  } catch (e) {}
});

window.cancelUnlock = function() {
  $("#titter-id").show();
  $("#unlock").hide();

};

function resultMsg(text,error) {
  let cls = error ? "alert-danger" : 'alert-success';
  let $donatedStats = $("#donatedStats");
  $donatedStats.show();
  $donatedStats.attr("class", "alert "+cls);
  window.cburl = "";
  $("#donatedAmount").html(text);
  frameReady();
}
function resultHide() {
  let $donatedStats = $("#donatedStats");
  $donatedStats.hide();
  frameReady();
}

function resetFields () {
  document.getElementById("comment").value = "";
  document.getElementById("IDtweet_title").value = "";
  document.getElementById("inputAmount").value = 0;
  activateButton();
}

function afterDonate(amount) {
  activateButton();
  resetFields();
  console.log("successfully sent");
  $("#result").html("Successfully sent!").removeClass("redError");
  $(".comment-limit").html("Ok");


  if (amount == 0) {
    resultMsg("Message has been sent, it may take a few minutes before your comment is displayed.");
  }

  frameReady();
}

function sendTitterComment(amount) {

}

function updateBalance(balance, rtx) {
  $("#balancestuff").show();
  if (balance) {
    $("#wrgBalance").html("&nbsp" + balance);
  }
  $("#rtx").html("&nbsp" + rtx);
  frameReady();
}


function InitTitter() {
  loadDraft();

  function hideInput() {
    $("#inputAmount").prop("disabled", true);
    //  $("#IDtweet_title").prop('disabled', true);
  }

  if (!recipientWrioID || recipientWrioID === "undefined") {
    console.log(
      "Donation recipient not specified, hiding donate form, use get parameter &id=xxxxxxxxxx"
    );
    hideInput();
    $("#noAuthor").show();
  }

  if (!loggedUserID) {
    hideInput();
  }

  if (recipientWrioID === loggedUserID) {
    console.log("Cannot donate to yourself");
    hideInput();
  }

  if (posturl === "undefined") {
    hideInput();
    throw new Error(
      "Origin paramater not specified, use &origin=urlencode(hostname)"
    );
  }
  queryBalance();
}

var faucetInterval = false;
window.wrgFaucet = () =>
  (async () => {
    const disableButton = () => {
      $('#faucetButton').addClass('disabled');
    };
    const enableButton = () => {
      $('#faucetButton').removeClass('disabled');
      $("#faucetText").html("Get free Thanks coins");
    };
    const startProgress = (timeleft) =>{
      const setText = (minutes) => $("#faucetText").html(`Wait ${Math.round(minutes)} minutes`);
      setText(timeleft);
      let minutes = timeleft;
      faucetInterval = setInterval(() => {
        setText(minutes--);
        if (minutes < 0)  {
          clearInterval(faucetInterval);
          enableButton();
        }
      }, 60 * 1000);
    };
    try {
      disableButton();
      $('#faucetLoader').show();
      let data = await freeWrgRequest();
      $('#faucetLoader').hide();
      resultMsg("Success! You'll get 10THX in a minute");
      startProgress(60);
      await watchTX(data.txUrl, data.txhash);
    } catch (err) {
      $('#faucetLoader').hide();
      if (err.responseJSON) {
        let r = err.responseJSON;
        if (r.reason == "wait") {
          if (r.timeleft > 0) {
            startProgress(r.timeleft);
            return;
          }
        }
      }
      resultMsg(
        "Failed to receive free THX, reason:" + err.responseText,true
      );
      enableButton();
    }
  })();

async function watchTX(txUrl, txHash) {
  //$("#faucetLoader").show();
  //$("#faucetGroup").hide();
  if (faucetInterval) {
    clearInterval(faucetInterval);
  }
  const NUM_TRIES = 5;
  const TRY_DELAY = 15000;
  /*$("#faucetMsg").html(
    `<a href="${txUrl}">Transaction</a> processing, please wait`
  );*/
  for (let i = 0; i < NUM_TRIES; i++) {
    await delay(TRY_DELAY);
    let txStatus = await txStatusRequest(txHash);
    console.log("Status", txStatus);
    if (txStatus.blockNumber) {
      break;
    }
  }
  await queryBalance();
  //$("#faucetLoader").hide();
  //$("#faucetGroup").show();
  //$("#faucetMsg").html("");
}



/*
$(document).ready(function() {
  console.log("Iframe loaded");
  InitTitter();
  $("#fileInput").change(function() {
    $.each(this.files, function(key, value) {
      files.push(value);
    });
  });
  frameReady();
});*/

window.chooseFile = () => {

};

import Container from './components/container.js'

ReactDOM.render(
    <Container />,
    document.getElementById('frame_container')
);
