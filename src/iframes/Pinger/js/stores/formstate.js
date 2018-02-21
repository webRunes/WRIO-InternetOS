/**
 * Created by michbil on 25.05.17.
 */
/**
 * Created by michbil on 07.12.16.
 */
import Reflux from "reflux";
import { getCookie, saveDraft, loadDraft, delay } from "../utils.js";
import {
  sendCommentRequest,
  sendDonateRequest,
  getBalanceRequest,
  getAddFundsDataRequest,
  getEthereumIdRequest,
  getUserEthereumId,
  freeWrgRequest,
  txStatusRequest
} from "../requests.js";
import FormActions from "../actions/formactions.js";
import { COMMENT_LENGTH, TITLE_LENGTH } from "../constants.js";
import { sanitizePostUrl, getParameterByName } from "../urlutils.js";
import { openAuthPopup } from "../auth.js";
import { getServiceUrl } from "base/servicelocator";

var frame_params = {
  // parameters we got from the query url
  posturl: sanitizePostUrl(getParameterByName("origin")),
  loggedUserID: getParameterByName("userID"),
  recipientWrioID: getParameterByName("author")
};

const raiseUnlockPopup = function(callback) {
  return window.open(
    getServiceUrl("pinger") + callback,
    "name",
    "width=800,height=500"
  );
};

var faucetInterval;

var messageListener = msg => {
  // callback to listen data sent back from the popup
  console.log("GOT message", msg);
  try {
    let msgdata = JSON.parse(msg.data);
    if (msgdata.closePopup) {
      FormActions.cancelDonate();
    }
    if (msgdata.cancelPopup) {
      console.log("Canceling popup");
      FormActions.cancelDonate();
    }

    if (msgdata.reload) {
      console.log("Reload required");
      window.location.reload();
    }

    if (msgdata.txId) {
      console.log("GOT TX id to watch!", msgdata.txId);
      FormActions.resultMsg(
        "You've credited " +
          window.savedAmount +
          " CRD. Thank you! It may take a few minutes before your comment is displayed."
      );
      afterDonate(window.savedAmount);
      watchTX("...", msgdata.txId)
        .then(() => {})
        .catch(err => {
          console.log(err);
          FormActions.resultMsg(
            "",
            "Failed to process trasaction, reason:" + err.responseText,
            true
          );
        });
    }
  } catch (e) {}
};

const genFormData = state => {
  var comment = state.comment;
  var title = state.tags;
  var files = state.files;
  var data = new FormData();
  var _data = {
    text: comment,
    title: title,
    comment: frame_params.posturl
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

export default Reflux.createStore({
  listenables: FormActions,
  init() {
    console.log("Setting iframe message listener");
    window.addEventListener("message", messageListener);
    const [draftTitle, draftText] = loadDraft();
    this.state = {
      user: frame_params.loggedUserID,
      donateDisabled: true,
      registred: false,
      haveWallet: false,
      amount: 0, // amount to send
      balance: 0, // user balance
      donateDisabled: false,
      rtx: 0,
      comment: draftText,
      tags: draftTitle,
      noAuthor: false,
      noWebgold: false,
      noAuthorWallet: false,
      files: [],
      left: {
        comment: COMMENT_LENGTH,
        title: TITLE_LENGTH
      },
      faucet: {
        busy: false,
        minutesLeft: 0
      },
      donateResultText: false,
      donateError: false
    };

    this.state = this.validateParams(this.state);

    this.onQueryBalance();
    this.getEthereumId();
  },
  validateParams(state) {
    const recipientWrioID = frame_params.recipientWrioID;
    const loggedUserID = frame_params.loggedUserID;
    if (!recipientWrioID || recipientWrioID === "undefined") {
      console.warn(
        "Donation recipient not specified, hiding donate form, use get parameter &id=xxxxxxxxxx"
      );
      state.donateDisabled = true;
      state.noAuthorWallet = true;
    }

    if (!loggedUserID) {
      state.donateDisabled = true;
    }

    if (recipientWrioID === loggedUserID) {
      console.log("Cannot donate to yourself");
      state.donateDisabled = true;
    }

    if (frame_params.posturl === "undefined") {
      state.donateDisabled = true;
      console.warn(
        "Origin paramater not specified, use &origin=urlencode(hostname)"
      );
    }
    this.trigger(state);
    return state;
  },
  resetFields() {
    this.state.comment = "";
    this.state.tags = "";
    this.state.amount = 0;
    this.state.files = [];
    this.state.busy = false;
    this.trigger(this.state);
  },

  resultMsg(text, error) {
    this.state.donateResultText = text;
    this.state.donateError = error;
    this.trigger(this.state);
  },
  getInitialState() {
    return this.state;
  },

  async onSendComment() {
    const amount = this.state.amount;
    this.setState({ busy: true });
    // empty /donatePopup is opened. it's waiting for the message to arrive with callback address
    let popup;
    let params = "";
    if (amount > 0 && frame_params.recipientWrioID) {
      params = "to=" + frame_params.recipientWrioID + "&amount=" + amount;
      popup = raiseUnlockPopup("/donatePopup");
    }

    window.savedAmount = amount; //saving amount as global, quick hack, TODO : fix it later
    //deactivateButton();
    try {
      let command = amount > 0 ? sendDonateRequest : sendCommentRequest;
      const data = await command(genFormData(this.state), params);

      console.log(data);
      if (data.callback) {
        setTimeout(
          () =>
            popup.postMessage(JSON.stringify({ callback: data.callback }), "*"),
          2000
        );
        return;
      }
      afterDonate(amount);
    } catch (request) {
      console.log(request);
      if (popup) {
        popup.postMessage(JSON.stringify({ error: true }), "*");
      }
      $(".comment-limit").html("Fail");
      console.log("Request: " + JSON.stringify(request));

      var errCode = "Unknown";
      if (request.responseJSON) {
        if (request.responseJSON.error) {
          errCode = request.responseJSON.error;
        }
      }
      this.resultMsg(
        'There was error during donation: "' + errCode + '"',
        true
      );
    }
    // activate button
    this.setState({ busy: false });
  },
  onOpenAuthPopup() {
    saveDraft(this.state.tags, this.state.title);
    openAuthPopup();
  },

  /**
     * Request api for ethereum id's of the receivers
     */

  async getEthereumId() {
    const getUserId = async () => {
      try {
        const userId = await getEthereumIdRequest();
        console.log("GOT user ethereum id's", userId);
        return true;
      } catch (err) {
        if (err.responseText == "User don't have ethereum wallet yet") {
          this.state.haveWallet = false;
          this.trigger(this.state);
        } else {
          this.state.haveWallet = false;
          this.state.noWebgold = true;
          this.trigger(this.state);
        }
        return false;
      }
    };
    const getTargetId = async () => {
      if (!frame_params.recipientWrioID) {
        return false;
      }
      try {
        const userId = await getUserEthereumId(frame_params.recipientWrioID);
        console.log("GOT target ethereum id's", userId);
        if (!userId.wallet) {
          this.state.noAuthorWallet = true;
          this.trigger(this.state);
        }
        return !!userId.wallet;
      } catch (err) {
        console.log("Error during getTargetId request", err);
        return false;
      }
    };
    return await Promise.all([getTargetId(), getUserId()]);
  },

  async onQueryBalance() {
    try {
      let data = await getBalanceRequest();
      console.log(data);
      this.state.balance = data.balance;
      this.state.rtx = data.rtx;
      this.state.haveWallet = true;
    } catch (err) {
      this.state.haveWallet = false;
    }
    this.state.showBalance = true;
    this.trigger(this.state);
  },

  onCommentChanged(v) {
    this.state.comment = v;
    this.state.left.comment = COMMENT_LENGTH - v.length;
    this.trigger(this.state);
  },
  onTagsChanged(v) {
    this.state.tags = v;
    this.state.left.title = TITLE_LENGTH - v.length;
    this.trigger(this.state);
  },
  onAmountChanged(v) {
    this.state.amount = v;
    this.trigger(this.state);
  },
  onAddFile(v) {
    this.state.files.push(v);
    this.trigger(v);
  },
  /**
     * Handler for request freeCRD
     */
  async onRequestFreeTHX() {
    const startProgress = timeleft => {
      console.log("Startprogeres", timeleft);
      this.setState({ faucet: { minutesLeft: timeleft, busy: true } });
      let minutes = timeleft;
      faucetInterval = setInterval(() => {
        this.setState({ faucet: { minutesLeft: minutes--, busy: true } });
        if (minutes < 0) {
          this.setState({ faucet: { minutesLeft: 0, busy: false } });
          clearInterval(faucetInterval);
        }
      }, 60 * 1000);
    };
    try {
      this.setState({ faucet: { busy: true, minutesLeft: 0 } });
      console.log(this.state);
      let data = await freeWrgRequest();
      this.setState({ faucet: { busy: false, minutesLeft: 0 } });
      this.resultMsg("Success! You'll get 10 CRD in a minute");
      startProgress(60);
      await watchTX(data.txUrl, data.txhash);
    } catch (err) {
      if (err.responseJSON) {
        let r = err.responseJSON;
        if (r.reason == "wait") {
          if (r.timeleft > 0) {
            startProgress(parseInt(r.timeleft));
            return;
          }
        }
        this.setState({ busy: false, minutesLeft: 0 });
      }
      this.resultMsg(
        "Failed to receive free CRD, reason:" + err.responseText,
        true
      );
    }
  },
  onCancelDonate() {
    this.setState({ busy: false });
  },
  onResultMsg(text, error) {
    this.resultMsg(text, error);
  },
  onResetFields() {
    this.setState({
      comment: "",
      amount: 0,
      tags: 0,
      files: []
    });
  },
  onDeletePhoto() {
    this.setState({
      files: []
    });
  },
  setState(state) {
    this.state = Object.assign(this.state, state);
    this.trigger(this.state);
  }
});

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
  FormActions.queryBalance();
}

function afterDonate(amount) {
  FormActions.resetFields();
  FormActions.resultMsg("Successfully sent!");
  console.log("successfully sent");

  if (amount == 0) {
    FormActions.resultMsg(
      "Message has been sent, it may take a few minutes before your comment is displayed."
    );
  }
}
