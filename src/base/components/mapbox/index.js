import * as React from 'react';
import ReactMapboxGl, { Layer, Source, Feature, GeoJSONLayer } from 'react-mapbox-gl';
import styled from 'styled-components';
import Config from './files/config.js';
const { token, styles } = Config;
// const geojson = require('./geojson.json');
import geojson from './files/geojson.js';
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
    height: '100vh',
    width: '100%'
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
const InitialUserPostion = [3.728149465869137, 51.04842478723869];
class StyleUpdate extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            styleKey: 'basic',
            featuresPostion: [InitialUserPostion, InitialUserPostion],
            // userPosition: InitialUserPostion,
            mapCenter: InitialUserPostion,
            renderLayer: true
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
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { latitude, longitude } = coords;
            this.setState({
                featuresPostion: [[longitude, latitude], InitialUserPostion],
                mapCenter: [longitude, latitude]
            });
        }, err => {
            console.error('Cannot retrieve your current position', err);
        });
    }
    render() {
        const { styleKey, featuresPostion, mapCenter, renderLayer } = this.state;
        return (React.createElement(Container, null,
            React.createElement(Map, { style: styles[styleKey], containerStyle: mapStyle, center: mapCenter, onStyleLoad: this.onStyleLoad },
                renderLayer ? (React.createElement("div", null,
                    React.createElement(Source, { id: "example_id", geoJsonSource: GEOJSON_SOURCE_OPTIONS }),
                    React.createElement(Layer, { type: "circle", id: "example_id_marker", paint: POSITION_CIRCLE_PAINT, sourceId: 'example_id' }))) : (undefined),
                React.createElement(Layer, { type: "circle", id: "position-marker", paint: POSITION_CIRCLE_PAINT }, featuresPostion.map((loc, index) => (React.createElement(Feature, { key: index, coordinates: loc, draggable: index === 0, onDragEnd: evt => this.onDragEnd(evt, index), onDragStart: this.onDragStart, onDrag: this.onDrag })))),
                React.createElement(GeoJSONLayer, { data: geojson, circleLayout: { visibility: 'visible' }, symbolLayout: {
                        'text-field': '{place}',
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 0.6],
                        'text-anchor': 'top'
                    } })),
            React.createElement(BottomBar, null,
                React.createElement(Button, { onClick: this.nextStyle }, "Change style"),
                React.createElement(Button, { onClick: this.toggleLayer }, "Toggle layer"),
                React.createElement(Indicator, null, `Using style: ${styleKey}`))));
    }
}
export default StyleUpdate;
