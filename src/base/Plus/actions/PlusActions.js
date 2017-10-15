import { loginMessage } from "base/actions/WindowMessage";
import { CrossStorageFactory } from "../../utils/CrossStorageFactory.js";

const storage = CrossStorageFactory.getCrossStorage();
/*
    'create',
    'read',
    'update',
    'del',
    'closeTab',
    'plusActive',
    'clickLink',
    'gotWrioID'
*/

export const GOT_PLUS_DATA = "GOT_PLUS_DATA";
export const CLICK_LINK = "CLICK_LINK";

export function getPlusData() {
  return async dispatch => {
    await storage.onConnect();
    const plus = (await storage.get("plus")) || {};
    console.log("Got plus data", plus);
    // wait until we have user wrioID
    loginMessage
      .filter(msg => !!msg && !!msg.profile)
      .first()
      .subscribe(msg => {
        console.log("got user id, dispatching");
        dispatch({ type: GOT_PLUS_DATA, plus, wrioID: msg.profile.id });
      });
  };
}

async function onClickLink(data) {
  console.log("Link clicked", data);
  if (data.children && data.children.length > 0) {
    return;
  }

  try {
    await storage.onConnect();
    const _plus = saveCurrentUrlToPlus(this.data);
    this.persistPlusDataToLocalStorage(_plus);
    window.location = data.fullUrl || data.url;
  } catch (e) {
    console.log("Error during gotoUrl", e);
    debugger;
  }
}
