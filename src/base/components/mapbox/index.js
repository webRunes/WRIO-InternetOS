import * as React from 'react';
import ReactMapboxGl, { Layer, Source, Feature, GeoJSONLayer } from 'react-mapbox-gl';
import styled from 'styled-components';
import Config from './files/config.js';
import geojson from './files/geojson.js';
import { connect } from 'react-redux';

const { token, styles } = Config;
const Map = ReactMapboxGl({ accessToken: token });
const Container = styled.div `
  position: relative;
  height: 100%;
  flex: 1;
`;
const Button = styled.button `
  border: 1px solid #3770c6;
  background-color: rgb(84, 152, 255);
  height: 100%;
  color: white;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  :hover {
    background-color: #3770c6;
  }
`;
const Indicator = styled.div `
  padding: 6px 10px;
  background-color: white;
`;
const BottomBar = styled.div `
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const mapStyle = {
    height: '100%',
    width: '100%',
    minWidth: '100%'
};
const GEOJSON_SOURCE_OPTIONS = {
    type: 'geojson',
    data: {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-77.0323, 38.9131]
        },
        properties: {
            title: 'Mapbox DC',
            'marker-symbol': 'monument'
        }
    }
};
const POSITION_CIRCLE_PAINT = {
    'circle-stroke-width': 4,
    'circle-radius': 10,
    'circle-blur': 0.15,
    'circle-color': '#3770C6',
    'circle-stroke-color': 'white'
};
const selectedStyles = ['basic', 'dark', 'light'];
const switchStyles = Object.keys(styles).filter(k => selectedStyles.includes(k));
// const InitialUserPostion = [3.728149465869137, 51.04842478723869];

class MapBoxGL extends React.Component {
    constructor(props) {
        super(...arguments, props);
        this.InitialUserPostion = [7.728149465869137, 51.04842478723869];
        this.state = {
            styleKey: 'basic',
            featuresPostion: [this.InitialUserPostion, this.InitialUserPostion],
            // userPosition: InitialUserPostion,
            mapCenter: this.InitialUserPostion,
            renderLayer: true,
            myLocation: false
        };
        this.nextStyle = () => {
            const { styleKey } = this.state;
            const currentIndex = switchStyles.indexOf(styleKey);
            const nextIndex = currentIndex === switchStyles.length - 1 ? 0 : currentIndex + 1;
            this.setState({
                styleKey: switchStyles[nextIndex]
            });
        };
        this.toggleLayer = () => {
            const { renderLayer } = this.state;
            this.setState({ renderLayer: !renderLayer });
        };
        this.onDragStart = () => {
            console.log('onDragStart');
        };
        this.onDrag = () => {
            console.log('onDrag');
        };
        this.onDragEnd = ({ lngLat }, key) => {
            console.log('onDragEnd');
            this.setState({
                featuresPostion: this.state.featuresPostion.map((el, index) => {
                    if (key === index) {
                        return [lngLat.lng, lngLat.lat];
                    }
                    return el;
                })
            });
        };
        this.onStyleLoad = (map) => {
            const { onStyleLoad } = this.props;
            return onStyleLoad && onStyleLoad(map);
        };
    }
    componentWillMount() {
        if(this.state.myLocation) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { latitude, longitude } = coords;
            this.setState({
                featuresPostion: [[longitude, latitude], this.InitialUserPostion],
                mapCenter: [longitude, latitude]
            });
        }, err => {
            console.error('Cannot retrieve your current position', err);
        });
     }
    }

    render() {
        console.log('geoCoordinates PROPS ======>>>>>', this.props.geoCoordinates);
        this.state.featuresPostion = [this.props.geoCoordinates, this.props.geoCoordinates];
        this.state.mapCenter = this.props.geoCoordinates;
        let featuresPostion = [this.props.geoCoordinates, this.props.geoCoordinates];
        let mapCenter = this.props.geoCoordinates;
        const { styleKey,
            //  featuresPostion, mapCenter,
              renderLayer } = this.state;
        return (<div className="deviceProfile-mapboxgl-main">
            {
            this.props.geoCoordinates && this.props.geoCoordinates.length ?
            <div className="deviceProfile-mapboxgl"> 
                {
            React.createElement(Container, null,
            React.createElement(Map, { style: styles[styleKey], containerStyle: mapStyle, center: mapCenter, onStyleLoad: this.onStyleLoad },
                renderLayer ? (React.createElement("div", null,
                    React.createElement(Source, { id: "example_id", geoJsonSource: GEOJSON_SOURCE_OPTIONS }),
                    React.createElement(Layer, { type: "circle", id: "example_id_marker", paint: POSITION_CIRCLE_PAINT, sourceId: 'example_id' }))) : (undefined),
                React.createElement(Layer, { type: "circle", id: "position-marker", paint: POSITION_CIRCLE_PAINT }, featuresPostion.map((loc, index) => (React.createElement(Feature, { key: index, coordinates: loc, draggable: index === 0, onDragEnd: evt => this.onDragEnd(evt, index), onDragStart: this.onDragStart, onDrag: this.onDrag })))),
                // React.createElement(GeoJSONLayer, { data: geojson, circleLayout: { visibility: 'visible' }, symbolLayout: {
                //         'text-field': '{place}',
                //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                //         'text-offset': [0, 0.6],
                //         'text-anchor': 'top'
                //     } })
                    ),
            React.createElement(BottomBar, null,
                React.createElement(Button, { onClick: this.nextStyle }, "Change style"),
                // React.createElement(Button, { onClick: this.toggleLayer }, "Toggle layer"),
                React.createElement(Indicator, null, `Using style: ${styleKey}`)))
            }
              </div>: <img src="https://default.wrioos.com/img/no-photo-200x200.png" width="200" height="200"/>
            }
          </div>);
    }
}

const mapStateToProps = state => ({
    geoCoordinates: state.document.geoCoordinates
  });

export default connect(mapStateToProps)(MapBoxGL);