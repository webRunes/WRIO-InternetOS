import React from "react";
import { connect } from "react-redux";

const Token =
  "pk.eyJ1Ijoid2VicnVuZXMiLCJhIjoiY2p5NGY5Nm93MTVlNDNpbzg1N3czdmd5cCJ9.CptajnA9N30WwXNK1EygyA";

class MapBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null
    };
    this.map;
  }

  componentDidUpdate() {
    const filteredGeoCoordinates = this.props.geoCoordinates
      .filter(item => item.feedUrl)
      .map(item => [item.longitude, item.latitude]);

    const mapBoxGL = window.mapboxgl || undefined;
    if (mapBoxGL) {
      mapboxgl.accessToken = Token;
      this.map = new mapboxgl.Map({
        container: this.map || "hidden-map",
        style: "mapbox://styles/mapbox/light-v10",
        center: filteredGeoCoordinates[0] || this.props.geoCoordinates,
        zoom: 12
      });

      if (filteredGeoCoordinates && filteredGeoCoordinates.length > 0) {
        filteredGeoCoordinates.map(geoCoord => {
          new mapboxgl.Marker().setLngLat(geoCoord).addTo(this.map);
        });
      } else {
        new mapboxgl.Marker()
          .setLngLat(this.props.geoCoordinates)
          .addTo(this.map);
      }
    }

    this.map ? this.map.addControl(new mapboxgl.NavigationControl()) : "";
    const that = this;
    this.map.on("load", () => {
      setInterval(() => {
        that.map.resize();
      }, 4000);
    });
  }

  static mapOnClick(allcordinates,cordinates, description, sensorProductName, checkEnable) {
    // for popup
    let allcord = allcordinates
      .filter(item => item.feedUrl)
      .map(item => [item.longitude, item.latitude])

    const filteredGeoCoordinates = [
      cordinates[0].longitude,
      cordinates[0].latitude
    ];
    let Description = description;
    const ProductName = sensorProductName;
    const longitude = cordinates[0].longitude;
    const latitude = cordinates[0].latitude;
    Description = Description.toString()
      .split(",")
      .join(" <br /> ");
    let text;
    if (checkEnable == "enable") {
      text =`${'<div>' + '<h4>'}${ProductName}</h4>`
    } else {
      text =`${'<div>' + '<h4 class="mapboxgl-popup-content inactive">'}${ProductName}</h4>`
    } 
    text = text + `<p>${Description}</p>` + `<p>Latitude: ${longitude}</p>` + `<p>Longitude: ${latitude}</p>` + '</div>';
    const mapBoxGL = window.mapboxgl || undefined;
    if (mapBoxGL) {
      mapboxgl.accessToken = Token;
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        center: filteredGeoCoordinates,
        zoom: 18
      });
        if (allcord && allcord.length > 0) {
        allcord.map(geoCoord => {
          new mapboxgl.Marker().setLngLat(geoCoord).addTo(this.map);
        });
        } else {
        new mapboxgl.Marker()
          .setLngLat(filteredGeoCoordinates)
          .addTo(this.map);
        }
        
        new mapboxgl.Popup({ offset: 25 })
        .setLngLat(filteredGeoCoordinates)
        .setHTML(text)
        .addTo(this.map);

        this.map ? this.map.addControl(new mapboxgl.NavigationControl()) : "";
        const that = this;
        this.map.on("load", () => {
        setInterval(() => {
        that.map.resize();
         }, 4000);
        });
    }
  }

  render() {
    const geoCoordinates =
      this.props.geoCoordinates && this.props.geoCoordinates.length > 0
        ? this.props.geoCoordinates
        : undefined;
    console.log("geoCoordinates 1 === ", geoCoordinates);
    console.log("window mapbox 1", window.mapboxgl);
    return geoCoordinates && window.mapboxgl != undefined ? (
      <div className="mapbox-main-div" id="map" ref={x => (this.map = x)} />
    ) : (
      <img
        id="hidden-map"
        src="https://default.wrioos.com/img/no-photo-200x200.png"
      />
    );
  }
}

const mapStateToPropsMapBox = state => ({
  geoCoordinates: state.document.geoCoordinates
});

export const MapBoxGl = connect(mapStateToPropsMapBox)(MapBox);
