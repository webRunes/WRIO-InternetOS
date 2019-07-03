import React from "react";
import { connect } from 'react-redux';
class FeedListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  let feedData = this.props.feed;
  let feed = feedData.dataFeedElement;
  let feedDates = feed ? [...new Set(feed.map(item => item.dateCreated))]: [];
  let productData = this.props.sensorProductData.map(item => item.productData).find(item => item.productID == feedData['@id']);
    return (feedDates.length > 0 ? <div>
    <div>
      <h2>Product ID: {productData ? productData.productID: ''}</h2>
      <h2>Name: {productData? productData.name: ''}</h2>
      <h2>Description: {productData? productData.description: ''}</h2>
      <h2>Brand: {productData? productData.brand: ''}</h2>
      <h2>Manufacturer: {productData? productData.manufacturer: ''}</h2>
      <h2>Production Date: {productData? productData.productionDate: ''}</h2>
      <h2>Purchase Date: {productData? productData.purchaseDate: ''}</h2>
      <h2>Release Date: {productData? productData.releaseDate: ''}</h2>
      <h2>Height: {productData? productData.height: ''}</h2>
      <h2>Weight: {productData? productData.weight: ''}</h2>
      <h2>width: {productData? productData.width: ''}</h2>
      </div>
    {
    feedDates.map(
    date => {
      let filterFeed = feed.filter(item => {
        return item.dateCreated == date;
      })
      return (
        <div>
          <h1>{filterFeed[0].dateCreated.slice(12,20)}</h1>
          <p>State: {filterFeed[0].item.variableMeasured.value}</p>
          <p>Temperature: {filterFeed[1].item.variableMeasured.value} &deg;{"C"}</p>
          <p>Battery: {filterFeed[2].item.variableMeasured.value}</p>
        </div>
      );
    }
  )
    }
  </div>:null);
  }
}

const mapStateToProps = state => ({
  feed: state.document.feed,
  sensorProductData: state.document.sensorData
});

export const FeedList = connect(mapStateToProps)(FeedListPage);