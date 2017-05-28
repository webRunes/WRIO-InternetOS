/**
 * Created by michbil on 25.05.17.
 */
/**
 * Created by michbil on 07.12.16.
 */
import Reflux from 'reflux';
import {
    getCookie,
    getLoginUrl,
    getWebgoldUrl,
    saveDraft,
    loadDraft,
    delay
} from "../utils.js";
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
import FormActions from '../actions/formactions.js'
import {COMMENT_LENGTH, TITLE_LENGTH} from '../constants.js';
import { sanitizePostUrl, getParameterByName } from "../urlutils.js";
import {openAuthPopup} from '../auth.js'


var frame_params = { // parameters we got from the query url
        posturl: sanitizePostUrl(getParameterByName('origin')),
        loggedUserID: getParameterByName('userID'),
        recipientWrioID: getParameterByName('author')
};

const raiseUnlockPopup = function(callback) {
    return window.open(callback, "name", "width=800,height=500");
};


const genFormData = (state) => {
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
        const [draftTitle,draftText] = loadDraft();
        this.state = {
            user: frame_params.loggedUserID,
            donateDisabled: true,
            registred: false,
            haveWallet: false,
            amount: 0, // amount to send
            balance: 0, // user balance
            rtx: 0,
            comment: draftText,
            tags:draftTitle,
            noAuthor: false,
            noWebgold: false,
            noAuthorWallet: false,
            files: [],
            left: {
                comment : COMMENT_LENGTH,
                title: TITLE_LENGTH
            },
            donateResultText: false,
            donateError: false,
        };

        this.state = this.validateParams(this.state);

        this.queryBalance();
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
        this.state.comment = '';
        this.state.tags = '';
        this.state.amount =0;
        this.state.files = [];
        this.state.busy = false;
        this.trigger(this.state);
    },

    resultMsg(text,error) {
        this.state.donateResultText =text;
        this.state.donateError = error;
        this.trigger(this.state);
    },
    getInitialState() {
        return this.state;
    },

    async onSendComment() {
        const amount = this.state.amount;
        this.state.busy = true;
        this.trigger(this.state);
        // empty /donatePopup is opened. it's waiting for the message to arrive with callback address
        let popup;
        let params = "";
        if (amount > 0 && recipientWrioID) {
            params = "to=" + recipientWrioID + "&amount=" + amount;
            popup = raiseUnlockPopup('/donatePopup');
        }

        window.savedAmount = amount; //saving amount as global, quick hack, TODO : fix it later
        //deactivateButton();
        try {
            let command = amount > 0 ? sendDonateRequest : sendCommentRequest;
            const data = await command(genFormData(state), params);

            console.log(data);
            if (data.callback) {
                popup.postMessage(JSON.stringify({callback: data.callback}),'*');
                return;
            }
            afterDonate(amount);
        } catch (request) {
            if (popup) {
                popup.postMessage(JSON.stringify({error:true}),'*');
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
                'There was error during donation: "' + errCode + '"',true
            );
        }
        // activate button
        this.state.busy = false;
        this.trigger(this.state);
    },
    onOpenAuthPopup() {
        saveDraft(this.state.tags,this.state.title);
        openAuthPopup();
    },

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
            if (!recipientWrioID) {
                return false;
            }
            try {
                const userId = await getUserEthereumId(recipientWrioID);
                console.log("GOT target ethereum id's", userId);
                if (!userId.wallet) {
                   this.state.noAuthorWallet = true;
                   this.trigger(this.state);
                }
                return !!userId.wallet;
            } catch (err) {
                console.log("Error during getTargetId request",err);
                return false;
            }
        };
    },

    async queryBalance () {
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
    }

});