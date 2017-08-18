import React from 'react';
//import moment from 'moment'; // moment js have pretty heavy js footprint, get rid of
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import {getResourcePath} from '../../global.js';

var domain = getDomain();

function formatDate() {
    var d = new Date();

    return d.getDate()  + " " + (d.getMonth()+1) + "-" + d.getFullYear() + " ";

// 16-5-2015 9:50
}

class Details extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            registered: formatDate()
        };
    }


    render() {

        var img = getResourcePath('/img/no-photo-200x200.png');

        return (
            <div className="col-xs-12 col-md-6 pull-right">
            <span itemScope="" itemType="https://schema.org/ImageObject">
                <img itemProp="thumbnail" src={img} className="img pull-left"/>
            </span>
                <ul className="details">
                    <li>Registered: {this.state.registered}</li>
                    <li>Account: Basic</li>
                    {/*<li>Rating: {this.state.rating}</li>
                    <li>Followers: {this.state.followers}</li>
                    <li>Posts: {this.state.posts}</li>*/}
                </ul>
            </div>
        );
    }
}


Details.propTypes = {

};

export default Details;
