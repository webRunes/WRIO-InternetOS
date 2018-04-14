import {navigateArticleHash} from '../actions/actions';

let once = false;

const
  routeOnce = () => {
    once = true;
    navigateArticleHash(location.hash);
    return once;
  },
  isHash = () => location.hash[0] !== '#',
  firstRoute = () =>
    once || routeOnce() && isHash();

module.exports = firstRoute;
