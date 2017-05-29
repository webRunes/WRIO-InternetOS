/**
 * Created by michbil on 30.08.15.
 */
import Reflux from 'reflux';
import Actions from './PaymentActions';

var Store = Reflux.createStore({
   init: function() {
       this.listenTo(Actions.changeAmount,this.changeAmount);
   },
   changeAmount: function (amount) {
       console.log("Change amount triggered");
       this.trigger({
           amount: amount
       });
   }
});

export default Store;