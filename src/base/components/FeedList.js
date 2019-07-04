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
    <div class="paragraph"><div className="col-xs-12"> <div>Product ID: {productData ? productData.productID: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Name: {productData? productData.name: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Description: {productData? productData.description: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Brand: {productData? productData.brand: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Manufacturer: {productData? productData.manufacturer: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Production Date: {productData? productData.productionDate: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Purchase Date: {productData? productData.purchaseDate: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Release Date: {productData? productData.releaseDate: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Height: {productData? productData.height: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>Weight: {productData? productData.weight: ''}</div></div></div>
    <div class="paragraph"><div className="col-xs-12"> <div>width: {productData? productData.width: ''}</div></div></div>
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