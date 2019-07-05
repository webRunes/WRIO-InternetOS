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
            <div class="paragraph">
            <div className="col-xs-12"> <div>Product ID: {productData ? productData.productID: ''}</div></div>
            <div className="col-xs-12"> <div>Name: {productData? productData.name: ''}</div></div>
            <div className="col-xs-12"> <div>Description: {productData? productData.description: ''}</div></div>
            <div className="col-xs-12"> <div>Brand: {productData? productData.brand: ''}</div></div>
            <div className="col-xs-12"> <div>Manufacturer: {productData? productData.manufacturer: ''}</div></div>
            <div className="col-xs-12"> <div>Production Date: {productData? productData.productionDate: ''}</div></div>
            <div className="col-xs-12"> <div>Purchase Date: {productData? productData.purchaseDate: ''}</div></div>
            <div className="col-xs-12"> <div>Release Date: {productData? productData.releaseDate: ''}</div></div>
            <div className="col-xs-12"> <div>Height: {productData? productData.height: ''}</div></div>
            <div className="col-xs-12"> <div>Weight: {productData? productData.weight: ''}</div></div>
            <div className="col-xs-12"> <div>width: {productData? productData.width: ''}</div></div>
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