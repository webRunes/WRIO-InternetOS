import React from 'react';
import moment from 'moment';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import {getResourcePath} from '../core/global.js';

var domain = getDomain();

class Details extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            registered: moment(Date.now()).format('DD MMM YYYY')
        };
    }

    getPath() {

    }

    render() {

        var img = getResourcePath('/img/no-photo-200x200.png');

        return (
            <div className="col-xs-12 col-md-6 pull-right">
            <span itemScope="" itemType="http://schema.org/ImageObject">
                <img itemProp="thumbnail" src={img} className="pull-left"/>
            </span>
                <ul className="details">
                    <li>Registered: {this.state.registered}</li>
                    <li>Rating: {this.state.rating}</li>
                    <li>Followers: {this.state.followers}</li>
                    <li>Posts: {this.state.posts}</li>
                </ul>
            </div>
        );
    }
}


Details.propTypes = {

};

export default Details;