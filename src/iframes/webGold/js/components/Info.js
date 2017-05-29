import React from 'react';

class Info extends React.Component {
    render() {
        return (
        	<div className="well enable-comment" style="display:none" id="createwallet">
                <h4>Get your first crypto currency wallet!</h4>
                <p>Press "Create Wallet" to get your first crypto-wallet that will open a door into the world of financial independence. No control, ID or verification will be required of you.</p>
                <br />
                <a href="javascript:;" target="popup" onclick="window.open(getWebgoldUrl()+'/create_wallet','name','width=600,height=400')"><span
                    className="glyphicon glyphicon-comment"></span>Create Wallet</a>
            </div>
        );
    }
}

export default Info;