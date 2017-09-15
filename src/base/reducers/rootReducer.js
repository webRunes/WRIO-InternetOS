import { combineReducers } from 'redux'
import headerReducer from './headerReducer'
import loginReducer from './loginReducer'
import documentReducer from './documentReducer'
import plusReducer from 'base/Plus/reducers/plusReducer'

const combinedReducer = combineReducers({
    header: headerReducer,
    login: loginReducer,
    document: documentReducer,
    plusReducer: plusReducer
});


export default combinedReducer;
