import React from 'react';
import Details from './Details.js';
import { getServiceUrl, getDomain } from '../../servicelocator.js';
import { Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';

const isMetaMaskInstalled = require('../../../metamask/is_metamask_installed');
const getMetaMaskInstallLink = require('../../../metamask/get_metamask_install_link');

const domain = getDomain();

const LoginButton = ({ onLogin }) => (
  <a href="#" className="btn btn-just-icon btn-simple btn-default btn-sm btn-flat pull-right">
    <i className="material-icons dp_big">account_circle</i>
    Login
  </a>
);

const performLogout = () => {
  document
    .getElementById('loginbuttoniframe')
    .contentWindow.postMessage('logout', getServiceUrl('login'));
};

export const performLogin = () => {
  window.open(
    `${getServiceUrl('login')}/auth/twitter?callback=${encodeURIComponent('/buttons/callback')}`,
    'Login',
    'height=500,width=700',
  );
  // document.getElementById('loginbuttoniframe').contentWindow.postMessage('login', getServiceUrl('login'));
};

const Login = ({ profile, readItLater = [], onLogout, onLogin }) => (
  <Dropdown id="dropdown-custom-1" pullRight>
    <Dropdown.Toggle className="btn-simple btn-default btn-lg btn-flat">
      <i className="material-icons dp_big">account_circle</i>{' '}
      {isMetaMaskInstalled()
        ? web3.eth.defaultAccount
        : profile.temporary
          ? 'Guest account'
          : profile.name
      }
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {
        !!readItLater.length && (readItLater.map((o, index) =>
          <MenuItem href={o.url} key={index}>
            <i className="material-icons dp_small with_text">bookmark</i>{o.name}
          </MenuItem>
        ))
      }
      {!!readItLater.length && (<MenuItem divider />)}
      <MenuItem eventKey="1" href="https://core.wrioos.com/create">
        <i className="material-icons dp_small with_text">create</i>Create new article
      </MenuItem>
      {/*
      <MenuItem eventKey="1" href="https://core.wrioos.com/create_list">
        <i className="material-icons dp_small with_text">create</i>Create new list
      </MenuItem>
      */}
      <MenuItem eventKey="1" href={profile.url}>
        <i className="material-icons dp_small with_text">perm_identity</i>Profile
      </MenuItem>
      <MenuItem divider />
      {!profile.temporary ? (
        <MenuItem eventKey="2" onClick={performLogout}>
          <i className="material-icons dp_small with_text">exit_to_app</i>Twitter Logout
        </MenuItem>
      ) : (
        <MenuItem eventKey="2" onClick={performLogin}>
          <i className="material-icons dp_small with_text">exit_to_app</i>Twitter Login
        </MenuItem>
      )}
      {!isMetaMaskInstalled() &&
        (<MenuItem eventKey="3" href={getMetaMaskInstallLink()}>
          <i className="material-icons dp_small with_text">exit_to_app</i>Download metamask extension
         </MenuItem>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
);

export default Login;
