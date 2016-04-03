/**
 * Created by michbil on 21.03.16.
 */

import {CrossStorageFactory} from './CrossStorageFactory.js';
import Reflux from 'reflux';
import UserActions from "../actions/UserActions.js";
import DocumentActions from '../actions/WrioDocument.js';

var storage = CrossStorageFactory.getCrossStorage();

export default Reflux.createStore({
    listenables: UserActions,
    async saveLoggedUser(id,profile) {
        await storage.onConnect();
        var users = await storage.get('savedUsers');
        if (!users) {
            users = {};
        }
        users[id] = profile;
        await storage.set('savedUsers',users);
    },

    async getLoggedUsers() {
        this.state = {};
        console.log("Getting user list...");
        await storage.onConnect();
        var users = await storage.get('savedUsers');
        this.trigger(this.convert(users));



        return users;
    },

    convert(users) {
        var userList = Object.values(users);
        var length = userList.length;
        var selected = null;
        if (length == 0) {
            selected = null;
        } else {
            selected = userList[0].id;
            users[selected].active = true;
            this.onSelectUser(userList[0]);
        }

        this.state =  {
            users: users,
            selected: selected
        };
        return this.state;
    },

    onSelectUser(data) {
        console.log("SelectUser Triggered",data);
        console.log(this.state);
        this.state.selected = data.id;
        this.trigger(this.state);
        this.setUserActive(data.id);
        DocumentActions.loadDocumentWithUrl.trigger(data.cover+'?cover');
    },

    setUserActive(id) {
        var userList = Object.values(this.state.users);
        userList.forEach((user) => {
           if (user.id == id) {
               this.state.users[user.id].active = true;
           } else {
               this.state.users[user.id].active = false;
           }
        });
    },

    getActiveUser(userState) {

        if (userState.selected == null) {
            return null;
        }

        var users = Object.values(userState.users);
        var length = users.length;
        if (length == 0) {
            return null;
        }
        return userState.users[userState.selected];
    }


});