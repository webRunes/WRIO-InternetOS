import React from 'react';
import { connect } from 'react-redux';
import ProviderLink from './BackToTheProvidersPageButton.js';
/* import MapBoxGL from '../../base/components/mapbox/index.js'; */
class DeviveProfileTab extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let feedData = this.props.feed;
        let productData = this.props.sensorProductData;
        let providerLink = feedData.provider != undefined ? feedData.provider: undefined;
        return (
            <div className="product">
            {
             providerLink !=undefined ?<ProviderLink providerLink={providerLink}/>:null
            }

            <div className="row">
              <div className="col-sm-6">
                {
                 <img src={productData ? (productData.image?productData.image:'https://default.wrioos.com/img/no-photo-200x200.png'): 'https://default.wrioos.com/img/no-photo-200x200.png'} width="200" height="200"/>
                }
              </div>
              <div className="col-sm-6">
                <h2>Product details</h2>
                  {
                   productData !=undefined && productData.productID != undefined ? <div>
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
                  </div>: null
                  }
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
              <MapBoxGl/>
              </div>
              <div className="col-sm-6">
                <h2>Location</h2>
                <div>imec Ghent</div>
                <div><a href="mailto:info@imec.be">info@imec.be</a></div>
                <div>+32 9 248 55 55</div>
                <div>De Krook</div>
                <div>Miriam Makebaplein 1</div>
                <div>9000 Ghent</div>
                <div>Belgium</div>
              </div>
            </div>
            </div>
        );
    }
}



const mapStateToProps = state => ({
    feed: state.document.feed,
    sensorProductData: state.document.feedProductData,
    geoCoordinates: state.document.geoCoordinates
  });

  export const DeviceProfile = connect(mapStateToProps)(DeviveProfileTab);


  class MapBox extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        map: null
      }
      this.map;
    }
  
    componentDidUpdate() {
      let mapBoxGL = window.mapboxgl || undefined;
      if(mapBoxGL) {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic2hvcnRkaXYiLCJhIjoiY2l3OGc5YmE5MDJzZjJ5bWhkdDZieGdzcSJ9.1z-swTWtcCHYI_RawDJCEw'
      this.map = new mapboxgl.Map({
        container: this.map || 'hidden-map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.props.geoCoordinates,
        zoom: 12
      })      
      new mapboxgl.Marker()
      .setLngLat(this.props.geoCoordinates)
      .addTo(this.map);
      }
    }
    render(){
      let geoCoordinates = this.props.geoCoordinates || undefined;
      return ((geoCoordinates && window.mapboxgl != undefined) ?
        <div className="mapbox-main-div" id='map' ref={(x) => this.map = x}>
        </div>: <img id="hidden-map" src="https://default.wrioos.com/img/no-photo-200x200.png" width="200" height="200"/>
      )
    }
};

const mapStateToPropsMapBox = state => ({
    geoCoordinates: state.document.geoCoordinates
});

const MapBoxGl = connect(mapStateToPropsMapBox)(MapBox);