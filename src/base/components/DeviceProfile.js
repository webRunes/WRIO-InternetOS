import React from 'react';
import { connect } from 'react-redux';
import ProviderLink from './BackToTheProvidersPageButton.js';
class DeviveProfileTab extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let feedData = this.props.feed;
        let productData = this.props.sensorProductData;
        let providerLink = feedData.provider != undefined ? feedData.provider: undefined;
        return (
           productData !=undefined ? <div className="container">
            {
             providerLink !=undefined ?<ProviderLink providerLink={providerLink}/>:null
            }
              <div className="paragraph">
                <div className="col-xs-12">
                  <div>Product ID: {productData ? productData.productID: ''}</div>
                  <div>Name: {productData? productData.name: ''}</div>
                  <div>Description: {productData? productData.description: ''}</div>
                  <div>Brand: {productData? productData.brand: ''}</div>
                  <div>Manufacturer: {productData? productData.manufacturer: ''}</div>
                  <div>Production Date: {productData? productData.productionDate: ''}</div>
                  <div>Purchase Date: {productData? productData.purchaseDate: ''}</div>
                  <div>Release Date: {productData? productData.releaseDate: ''}</div>
                  <div>Height: {productData? productData.height: ''}</div>
                  <div>Weight: {productData? productData.weight: ''}</div>
                  <div>Width: {productData? productData.width: ''}</div>
                </div>
              </div>
            </div>: null
        );
    }
}



const mapStateToProps = state => ({
    feed: state.document.feed,
    sensorProductData: state.document.feedProductData
  });

  export const DeviceProfile = connect(mapStateToProps)(DeviveProfileTab);
