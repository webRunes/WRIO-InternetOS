import { combineReducers } from 'redux'
import headerReducer from './headerReducer'
import loginReducer from './loginReducer'
import documentReducer from './documentReducer'

const combinedReducer = combineReducers({
    header: headerReducer,
    login: loginReducer,
    document: documentReducer
});


export default combinedReducer;
