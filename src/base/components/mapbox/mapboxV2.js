import React from 'react';
import { connect } from 'react-redux';

const Token = "pk.eyJ1Ijoid2VicnVuZXMiLCJhIjoiY2p5NGY5Nm93MTVlNDNpbzg1N3czdmd5cCJ9.CptajnA9N30WwXNK1EygyA";

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
    mapboxgl.accessToken = Token;
    this.map = new mapboxgl.Map({
      container: this.map || 'hidden-map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: this.props.geoCoordinates,
      zoom: 12
    })      
    new mapboxgl.Marker()
    .setLngLat(this.props.geoCoordinates)
    .addTo(this.map);
    }
    this.map.addControl(new mapboxgl.NavigationControl());
  }
  render(){
    let geoCoordinates = (this.props.geoCoordinates && this.props.geoCoordinates.length > 0) ? this.props.geoCoordinates: undefined;
    console.log('geoCoordinates 1 === ', geoCoordinates);
    console.log('window mapbox 1', window.mapboxgl);
    return ((geoCoordinates && window.mapboxgl != undefined) ?
      <div className="mapbox-main-div" id='map' ref={(x) => this.map = x}>
      </div>: <img id="hidden-map" src="https://default.wrioos.com/img/no-photo-200x200.png" width="200" height="200"/>
    )
  }
};

const mapStateToPropsMapBox = state => ({
  geoCoordinates: state.document.geoCoordinates
});

export const MapBoxGl = connect(mapStateToPropsMapBox)(MapBox);