import Rx from "rxjs";

const listener = new Rx.Subject();

export const postUpdateHook = () => listener.next();
