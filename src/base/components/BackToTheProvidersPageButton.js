import React from 'react';
export default ({ providerLink }) => {
    return (<div className="callout">
        <h5>The device is a part of an IoT network. <a href={providerLink}>Back to the network provider's dashboard</a></h5>
      </div>)
}
