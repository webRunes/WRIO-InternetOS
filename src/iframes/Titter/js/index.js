// TODO legacy code, rewrite in react, get rid of globals


import ReactDOM from 'react-dom';
import React from 'react';
require("./iframeresize"); // require iframe resizer middleware







window.sendComment = () => {
  var amount = document.getElementById("inputAmount").value;
  if (amount < 0) {
    return alert("Wrong donate value");
  }
  sendTitterComment(amount);
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

function resultHide() {
  let $donatedStats = $("#donatedStats");
  $donatedStats.hide();
  frameReady();
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
  if (faucetInterval) {
    clearInterval(faucetInterval);
  }
  const NUM_TRIES = 5;
  const TRY_DELAY = 15000;
  for (let i = 0; i < NUM_TRIES; i++) {
    await delay(TRY_DELAY);
    let txStatus = await txStatusRequest(txHash);
    console.log("Status", txStatus);
    if (txStatus.blockNumber) {
      break;
    }
  }
  await queryBalance();
}





window.chooseFile = () => {

};

import Container from './components/container.js'

ReactDOM.render(
    <Container />,
    document.getElementById('frame_container')
);
document.getElementById('loadingInd').style="display:none;";
