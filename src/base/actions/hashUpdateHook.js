import Rx from "rxjs";

// this hook is triggered after DOM redraw, to set article hash
// it's needed because you can't set artcile hash before article is rendered

function forceHash() {
  setTimeout(() => {
    const orig = window.location.hash;
    window.location.hash = orig + " ";
    window.location.hash = orig;
  }, 100);
}

const listener = new Rx.Subject();
let updateRequested = false;

listener.delay(100).subscribe(m => {
  if (updateRequested) {
    forceHash();
    updateRequested = false;
  }
});

export const requestHashUpdate = () => (updateRequested = true);
export const postUpdateHook = () => listener.next();
