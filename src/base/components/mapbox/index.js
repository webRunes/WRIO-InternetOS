import * as React from 'react';
import ReactMapboxGl, { ScaleControl, ZoomControl, RotationControl, Layer, Feature } from 'react-mapbox-gl';
import { AllShapesPolygonCoords, AllShapesMultiPolygonCoords } from './files/data.js';
import mapData from './files/allShapesStyle.js';
import route from './files/route.js';
import Config from './files/config.js';
const mappedRoute = route.points.map(point => [point.lng, point.lat]);
const Map = ReactMapboxGl({ accessToken: Config.token });
const mapStyle = {
    flex: 1
};
const lineLayout = {
    'line-cap': 'round',
    'line-join': 'round'
};
const linePaint = {
    'line-color': '#4790E5',
    'line-width': 12
};
const polygonPaint = {
    'fill-color': '#6F788A',
    'fill-opacity': 0.7
};
const multiPolygonPaint = {
    'fill-color': '#3bb2d0',
    'fill-opacity': 0.5
};
class AllShapes extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            center: [-0.120736, 51.5118219],
            zoom: [8],
            circleRadius: 30,
            routeIndex: 0
        };
        this.intervalHandle = undefined;
        this.timeoutHandle = undefined;
        this.mounted = false;
        this.getCirclePaint = () => ({
            'circle-radius': this.state.circleRadius,
            'circle-color': '#E54E52',
            'circle-opacity': 0.8
        });
        this.onStyleLoad = (map) => {
            const { onStyleLoad } = this.props;
            return onStyleLoad && onStyleLoad(map);
        };
    }
    componentWillMount() {
        this.mounted = true;
        this.timeoutHandle = setTimeout(() => {
            if (this.mounted) {
                this.setState({
                    center: mappedRoute[0],
                    zoom: [10],
                    circleRadius: 10
                });
            }
        }, 3000);
        this.intervalHandle = setInterval(() => {
            if (this.mounted) {
                this.setState({
                    routeIndex: this.state.routeIndex + 1
                });
            }
        }, 8000);
    }
    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
        clearInterval(this.intervalHandle);
    }
    render() {
        return (React.createElement(Map, { style: mapData, containerStyle: mapStyle, 
            onStyleLoad: this.onStyleLoad, center: this.state.center, zoom: this.state.zoom },
            React.createElement(ScaleControl, null),
            React.createElement(ZoomControl, null),
            React.createElement(RotationControl, { style: { top: 80 } }),
            React.createElement(Layer, { type: "line", layout: lineLayout, paint: linePaint },
                React.createElement(Feature, { coordinates: mappedRoute })),
            React.createElement(Layer, { type: "circle", paint: this.getCirclePaint() },
                React.createElement(Feature, { coordinates: mappedRoute[this.state.routeIndex] })),
            React.createElement(Layer, { type: "fill", paint: polygonPaint },
                React.createElement(Feature, { coordinates: AllShapesPolygonCoords })),
            React.createElement(Layer, { type: "fill", paint: multiPolygonPaint },
                React.createElement(Feature, { coordinates: AllShapesMultiPolygonCoords }))));
    }
}
export default AllShapes;