/**
 * Created by michbil on 31.10.16.
 */
import React from "react";
import { connect } from 'react-redux';

class CreateFeedPage extends React.Component {

  render() {
    let feedData = this.props.feed;
    let productData = this.props.sensorProductData.map(item => item.productData).find(item => item.productID == feedData['@id']);
    return ( <div class="paragraph">
    <div>
    <div className="col-xs-12"> <div>Product ID: {productData ? productData.productID: ''}</div></div>
    <div className="col-xs-12"> <div>Name: {productData? productData.name: ''}</div></div>
    <div className="col-xs-12"> <div>Description: {productData? productData.description: ''}</div></div>
    <div className="col-xs-12"> <div>Brand: {productData? productData.brand: ''}</div></div></div>
    <div className="col-xs-12"> <div>Manufacturer: {productData? productData.manufacturer: ''}</div></div>
    <div className="col-xs-12"> <div>Production Date: {productData? productData.productionDate: ''}</div></div>
    <div className="col-xs-12"> <div>Purchase Date: {productData? productData.purchaseDate: ''}</div></div>
    <div className="col-xs-12"> <div>Release Date: {productData? productData.releaseDate: ''}</div></div>
    <div className="col-xs-12"> <div>Height: {productData? productData.height: ''}</div></div>
    <div className="col-xs-12"> <div>Weight: {productData? productData.weight: ''}</div></div>
    <div className="col-xs-12"> <div>width: {productData? productData.width: ''}</div></div>
      </div>);
  }
}

const mapStateToProps = state => ({
    feed: state.document.feed,
    sensorProductData: state.document.sensorData
  });
  
  export const CreateFeed = connect(mapStateToProps)(CreateFeedPage);
