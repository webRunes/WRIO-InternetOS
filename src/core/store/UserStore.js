/**
 * Created by michbil on 21.03.16.
 */

import {CrossStorageFactory} from './CrossStorageFactory.js';
import Reflux from 'reflux';

var storage = CrossStorageFactory.getCrossStorage();

export default Reflux.createStore({

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
        console.log("Getting user list...");
        await storage.onConnect();
        var users = await storage.get('savedUsers');
        this.trigger(this.convert(users));
        return users;
    },

    convert(users) {
        return users;
    }


});