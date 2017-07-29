import Reflux from 'reflux';

import { getRegistredUser} from '../webrunesAPI.js';
import {getWidgetID} from '../webrunesAPI.js';

export default Reflux.createStore({
    listenables: WrioActions,
    init() {
        this.state= {
            wrioID: '',
            commentsEnabled: false,
            commentID: "",
            busy: false
        };
        getRegistredUser().then((user)=> {
            this.state.wrioID = user.id;
            this.state.user = user;
            this.trigger(this.state);
            }
        ).catch((e)=> console.error("ERROR obtaining",e.stack));
    },

    getWrioID() {
        return this.state.wrioID;
    },

    requestCommentId(url,cb) {
        if (!this.state.commentsEnabled) {
            console.log("getCommentId canceled, because comments not enabled");
            return cb(null,"");
        }
        console.log("getCommentid started");
        getWidgetID(url).then((id)=> {
            console.log("Get widget id succeded", id);
            cb(null,id);
        }).catch((e) => {
            console.log("Failed to obtain widget ID");
            cb('Failure obtaining commentId');

        });
    },

    onSetDoc(doc) {
        this.state.commentId=doc.getCommentID();
        this.state.commentsEnabled = this.state.commentID !== "";
        this.trigger(this.state);
    },

    onCommentsEnabled(state) {
        this.state.commentsEnabled = state;
        this.trigger(this.state);
    },

    areCommentsEnabled () {
        return this.state.commentsEnabled;
    },

    getUser() {
        return this.state.user;
    },

    onHeaderChanged(header) {
        this.state.header = header;
        this.trigger(this.state);
    },

    onBusy(state) {
        this.state.busy = state;
        this.trigger(this.state);
    }

});