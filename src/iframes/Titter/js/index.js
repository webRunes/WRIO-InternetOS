// TODO legacy code, rewrite in react, get rid of globals

import {
  getCookie,
  getLoginUrl,
  getWebgoldUrl,
  saveDraft,
  loadDraft,
  delay
} from "./utils.js";
import {
  sendCommentRequest,
  getBalanceRequest,
  getAddFundsDataRequest,
  getEthereumIdRequest,
  freeWrgRequest,
  txStatusRequest
} from "./requests.js";
import { sanitizePostUrl } from "./urlutils.js";
require("./iframeresize"); // require iframe resizer middleware

var files = [];

window.getWebgoldUrl = getWebgoldUrl;

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

  if (comment == "") {
    comment = " "; // to address issue, when empty message is sent
  }

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

window.raiseUnlockPopup = function() {
  window.popupLink = window.open(window.cburl, "name", "width=800,height=500");
};

window.addEventListener("message", msg => {
  // callback to listen data sent back from the popup
  console.log("GOT message", msg);
  try {
    let msgdata = JSON.parse(msg.data);
    if (msgdata.closePopup) {
      cancelUnlock();
    }
    if (msgdata.txId) {
      console.log("GOT TX id to watch!", msgdata.txId);
      watchTX("...", msgdata.txId)
        .then(() => {
          activateButton();
        })
        .catch(err => {
          console.log(err);
          $("#faucetMsg").html(
            "Failed to process trasaction, reason:" + err.responseText
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
  window.cburl = "";
};

function afterDonate() {
  activateButton();
  document.getElementById("comment").value = "";
  document.getElementById("IDtweet_title").value = "";
  console.log("successfully sent");
  $("#result").html("Successfully sent!").removeClass("redError");
  $(".comment-limit").html("Ok");
  var $donatedStats = $("#donatedStats");

  //prev: "You've donated " + data.donated + " WRG. The author received "+ data.feePercent + " %, which amounts to a " + data.amountUser + "WRG or 0.19 USD. Thank you!"
  if (data.status == "Done") {
    if (data.donated > 0) {
      $donatedStats.show();
      $donatedStats.attr("class", "alert alert-success");
      $("#donatedAmount").html(
        "You've donated " +
          data.donated +
          " THX. Thank you! Your message has been sent, it may take a few minutes before you comment is displayed."
      );
      return;
    }
  }
  $donatedStats.hide();

  frameReady();
}

function sendTitterComment(amountdonated) {
  $(".comment-limit").html("Loading");

  var params = "";
  if (amountdonated > 0 && recipientWrioID) {
    params = "to=" + recipientWrioID + "&amount=" + amountdonated;
  }
  deactivateButton();
  sendCommentRequest(genFormData(), params)
    .done(data => {
      console.log(data);
      if (data.callback) {
        $("#titter-id").hide();
        $("#unlock").show().css("display", "flex");
        window.cburl = data.callback;
        return;
      }

      afterDonate();
    })
    .fail(function(request) {
      activateButton();
      $(".comment-limit").html("Fail");
      console.log("Request: " + JSON.stringify(request));

      var errCode = "Unknown";
      if (request.responseJSON) {
        if (request.responseJSON.error) {
          errCode = request.responseJSON.error;
        }
      }

      var $donatedStats = $("#donatedStats");
      $donatedStats.show();
      $donatedStats.attr("class", "alert alert-danger");
      $("#donatedAmount").html(
        'There was error during donation: "' + errCode + '"'
      );
      frameReady();
    });
}

var exchangeRate;

function updateBalance(balance, rtx) {
  $("#balancestuff").show();
  if (balance) {
    $("#wrgBalance").html("&nbsp" + balance);
  }
  $("#rtx").html("&nbsp" + rtx);
  if (exchangeRate && balance) {
    var usdBalance = exchangeRate * balance / 10000;
    $("#usdBalance").html("&nbsp" + usdBalance.toFixed(2));
  }
  frameReady();
}

const queryBalance = async () => {
  try {
    let data = await getBalanceRequest();
    console.log(data);
    updateBalance(data.balance, data.rtx);
    if (!noAccount) $("#balancePane").show();
    frameReady();
  } catch (err) {
    $("#wrgBalance").html("&nbsp" + 0);
    if (!noAccount) $("#balancePane").show();
    frameReady();
  }
};

const queryRates = async () => {
  try {
    let data = await getAddFundsDataRequest();
    console.log(data);
    exchangeRate = data.exchangeRate;
    updateBalance();
  } catch (err) {
    $("#balancestuff").hide();
    throw new Error("Cannot get exchange rates!!!!");
    if (!noAccount) $("#balancePane").show();
    frameReady();
  }
};

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
  queryRates();
}

var faucetInterval = false;
window.wrgFaucet = () =>
  (async () => {
    try {
      let data = await freeWrgRequest();
      await watchTX(data.txUrl, data.txhash);
    } catch (err) {
      if (err.responseJSON) {
        let r = err.responseJSON;
        if (r.reason == "wait") {
          if (r.timeleft > 0) {
            $("#faucetMsg").html(`Wait ${Math.round(r.timeleft)} minutes`);
            let minutes = r.timeleft;
            faucetInterval = setInterval(() => {
              $("#faucetMsg").html(`Wait ${Math.round(minutes)} minutes`);
              minutes--;
              if (minutes < 0) {
                clearInterval(faucetInterval);
                $("#faucetLoader").hide();
                $("#faucetGroup").show();
                $("#faucetMsg").html("");
              }
            }, 60 * 1000);
            $("#faucetLoader").hide();
            return;
          }
        }
      }
      $("#faucetMsg").html(
        "Failed to receive free THX, reason:" + err.responseText
      );
      $("#faucetLoader").hide();
    }
  })();

async function watchTX(txUrl, txHash) {
  $("#faucetLoader").show();
  $("#faucetGroup").hide();
  if (faucetInterval) {
    clearInterval(faucetInterval);
  }
  const NUM_TRIES = 5;
  const TRY_DELAY = 15000;
  $("#faucetMsg").html(
    `<a href="${txUrl}">Transaction</a> processing, please wait`
  );
  for (let i = 0; i < NUM_TRIES; i++) {
    await delay(TRY_DELAY);
    let txStatus = await txStatusRequest(txHash);
    console.log("Status", txStatus);
    if (txStatus.blockNumber) {
      break;
    }
  }
  await queryBalance();
  $("#faucetLoader").hide();
  $("#faucetGroup").show();
  $("#faucetMsg").html("");
}

var noAccount = false;

function getEthereumId() {
  getEthereumIdRequest()
    .done(data => {
      frameReady();
    })
    .fail(err => {
      $("#createwallet").show();
      noAccount = true;
      frameReady();
    });
}
getEthereumId();

$(document).ready(function() {
  console.log("Iframe loaded");
  InitTitter();
  $("#fileInput").change(function() {
    $.each(this.files, function(key, value) {
      files.push(value);
    });
  });
  frameReady();
});

window.chooseFile = () => {
  $("#fileInput").click();
};
