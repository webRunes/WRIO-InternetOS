import React from 'react';
export default ({ providerLink }) => {
    return (<div className="callout">
        <h5>The sensor is a part of IoT network. <a href={providerLink}>Back to the network provider's page</a></h5>
      </div>)
}
