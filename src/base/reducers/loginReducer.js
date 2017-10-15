import * as actions from "base/actions/actions";
const defaultState = {
  wrioID: null,
  profile: null
};

function loginReducer(state = defaultState, action) {
  switch (action.type) {
    case actions.LOGIN_MESSAGE:
      var profile = action.msg.profile;
      return { wrioID: profile.id, profile };
      break;
    default:
      return state;
  }
}

export default loginReducer;
