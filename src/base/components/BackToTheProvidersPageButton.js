import React from 'react';
export default ({ providerLink }) => {
    return <div>
    <a href={providerLink}>
    <button class="btn btn-default">Back to the provider's page</button>
    </a>
  </div>
}