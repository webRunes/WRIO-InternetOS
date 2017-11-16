import { loginMessage } from 'base/actions/WindowMessage';
import { CrossStorageFactory } from '../../utils/CrossStorageFactory.js';
import { getActiveElement, deletePageFromTabs } from '../utils/tabTools';

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

export const GOT_PLUS_DATA = 'GOT_PLUS_DATA';
export const CLICK_LINK = 'CLICK_LINK';

export function getPlusData() {
  return async (dispatch) => {
    await storage.onConnect();
    const plus = (await storage.get('plus')) || {};
    console.log('Got plus data', plus);
    // wait until we have user wrioID
    loginMessage
      .filter(msg => !!msg && !!msg.profile)
      .first()
      .subscribe((msg) => {
        console.log('got user id, dispatching');
        dispatch({ type: GOT_PLUS_DATA, plus, wrioID: msg.profile.id });
      });
  };
}

async function persistPlusDataToLocalStorage(data) {
  await storage.onConnect();
  await storage.set('plus', data);
}

async function onDel(plusTabs, listName, elName) {
  const [newdata, next, wasActive] = deletePageFromTabs(plusTabs, listName, elName);

  await persistPlusDataToLocalStorage(newdata);
  window.location.href = next || getPlusUrl(this.id);
}

export const onCloseTab = () => async (dispatch, getState) => {
  const { plusTabs } = getState().plusReducer;
  const [listName, elName] = getActiveElement(plusTabs);
  if (listName) {
    await onDel(plusTabs, listName, elName);
  } else {
    console.error('Cannot find current tab while closing tab!');
  }
};

async function onClickLink(data) {
  console.log('Link clicked', data);
  if (data.children && data.children.length > 0) {
    return;
  }

  try {
    await storage.onConnect();
    const _plus = saveCurrentUrlToPlus(this.data);
    persistPlusDataToLocalStorage(_plus);
    window.location = data.fullUrl || data.url;
  } catch (e) {
    console.log('Error during gotoUrl', e);
  }
}
