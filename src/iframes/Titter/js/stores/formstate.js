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


export default Reflux.createStore({
    listenables: FormActions,
    init() {
        this.state = {
            registred: false,
            haveWallet: false,
            amount: 0,
            balance: 0,
            rtx: 0,
            comment: "",
            tags:"",
            noAuthor: false,
            noWebgold: false,
            noAuthorWallet: false
        };
        this.queryBalance();
        this.getEthereumId();
    },
    getInitialState() {
        return this.state;
    },

    onSendComment() {
        const amount = this.state.amount;
        //$(".comment-limit").html("Loading");
        // empty /donatePopup is opened. it's waiting for the message to arrive with callback address
        let popup;
        let params = "";
        if (amount > 0 && recipientWrioID) {
            params = "to=" + recipientWrioID + "&amount=" + amount;
            popup = raiseUnlockPopup('/donatePopup');
        }

        window.savedAmount = amount; //saving amount as global, quick hack, TODO : fix it later
        deactivateButton();
        let command = amount > 0 ? sendDonateRequest : sendCommentRequest;
        command(genFormData(), params)
            .done(data => {
                console.log(data);
                if (data.callback) {
                    popup.postMessage(JSON.stringify({callback: data.callback}),'*');
                    return;
                }

                afterDonate(amount);
            })
            .fail(function(request) {

                if (popup) {
                    popup.postMessage(JSON.stringify({error:true}),'*');
                }
                activateButton();
                $(".comment-limit").html("Fail");
                console.log("Request: " + JSON.stringify(request));

                var errCode = "Unknown";
                if (request.responseJSON) {
                    if (request.responseJSON.error) {
                        errCode = request.responseJSON.error;
                    }
                }
                resultMsg(
                    'There was error during donation: "' + errCode + '"',true
                );
                frameReady();
            });
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
        this.trigger(this.state);
    },
    onTagsChanged(v) {
        this.state.tags = v;
        this.trigger(this.state);
    },
    onAmountChanged(v) {
        this.state.amount = v;
        this.trigger(this.state);
    }

});