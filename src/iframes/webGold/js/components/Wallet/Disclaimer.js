import React from 'react';

export default class Disclaimer extends React.Component {
    render() {
        return (
            <div className="callout">
              <h5>Keep it safe!</h5>
              <p>These 12 words are your wallet seed. It will unlock complete access to your funds even if you can't access your computer anymore. Please write them down on a piece of paper before continuing.</p>
              <p><b>Important:</b> We care about the security and anonymity of our users, thus we do not save passwords, access keys or personal data on the servers. It is impossible to steal something that doesn't exist. This protects your data and money against interventions of hackers and other third parties. But remember: we will not be able to recover access to the wallet if you lose the code phrase provided below.</p>
            </div>);
    }
}
