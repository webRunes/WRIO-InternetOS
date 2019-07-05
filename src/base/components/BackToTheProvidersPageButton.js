import React from 'react';
export default ({ providerLink }) => {
    return
      <div className="alert alert-primary">
        The sensor is a part of IoT network. <a href={providerLink}>Back to the network provider's page</a>
      </div>
}
