/* @flow */
/**
 * Created by michbil on 17.06.17.
 */

import React from 'react';
import LdJsonDocument from '../jsonld/LdJsonDocument'
import LdJsonObject from '../jsonld/entities/LdJsonObject'
import ItemList from '../jsonld/entities/ItemList'
import ImageObject from '../jsonld/entities/ImageObject'
// $FlowFixMe
import {CarouselItem} from 'react-bootstrap'
import Carousel from '../components/misc/FixedCarousel'

const nextIcon = ( <i className="material-icons">keyboard_arrow_right</i>);
const prevIcon = ( <i className="material-icons">keyboard_arrow_left</i>);

/**
 * Renders cover text contents
 * @param cover
 * @returns {XML}
 * @constructor
 */

const CoverText = ({cover} : {cover : ImageObject}) => {

        console.log("cover", cover);
        var items = cover.getCoverItems();
        var descr = [];
        var bulletList = [];
        var index = 0;

        function purgeList() {
            if (bulletList.length !== 0) {
                descr.push(
                    <ul key={index++} className="features">{
                        bulletList.map(item => {
                            return (<li key={index++}>
                                        <span className="glyphicon glyphicon-ok" />{item}
                                    </li>)
                        })}
                    </ul>);
                bulletList = [];
            }
        }

        items.forEach((item, i) => {
            if (item.bullet) {
                bulletList.push(<span key={index++}>{item.text}</span>);
            } else {
                purgeList();
                descr.push(<div key={index++} className="description">{item.text}</div>);
            }

        });
        purgeList();

        const r = <span>{descr}</span>;
        console.log(r);
        return r;

};


const RenderCover = ({cover} : {cover : LdJsonObject}) => {
    const image : ImageObject = cover.children[0];

    var path = image.getKey('contentUrl'); //cover.img;
    var name = image.getKey('name');
    var about = image.getKey('about');

    const carouselStyle = {
        background: `url('${path}') no-repeat center center fixed`,
        WebkitBackgroundSize:"cover",
        MozBackgroundSize:"cover",
        OBackgroundSize:"cover",
        BackgroundSize:"cover",
        transform: "translate3d(0px, 0px, 0px)",
        minHeight:"100vh"
    };

    return (<div style={carouselStyle} className="cover-bg">
        <div className="carousel-caption">
            <div className="carousel-caption">
                <div className="row">
                    <div className="col-xs-8 col-xs-offset-2 col-lg-9 col-lg-offset-3">
                        <div className="title">
                            <div className="title-text">
                                <h1>{name}</h1>
                                <h3>{about}</h3>
                                <h3><CoverText cover={image}/></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

/**
 * Navigation buttons pane
 * @param items
 * @returns {XML}
 * @constructor
 */

const CoverNavigationButtons = ({items} : {items: Array<Object>}) => {
    return (<nav className="navbar navbar-transparent">
        <ul className="nav navbar-nav navbar-left">
            {items.map((r,key)=>{
                return (
                    <li key={key}>
                    <a href={r.segueUrl} className="active" data-toggle="tab">
                        {r.name}
                        <div className="ripple-container"></div>
                    </a>
                </li>)
            })}

        </ul>
    </nav>);
};

const CoverHeader = ({coverData} : {coverData : Array<Object>}) => {

    console.log("RENDERING", coverData);
    return (
        <div className="page-header">
            <div className="cover col-xs-8 col-xs-offset-2 col-lg-9 col-lg-offset-3">
                <div className="cover-left">
                    <div className="card card-profile card-plain">
                        <div className="card-image">
                            <a href="#" className="img">
                                <img src="https://default.wrioos.com/img/logo.png"/>
                            </a>
                        </div>
                        <div className="hidden">
                            <a href="#" className="author">By User Name</a>
                            <h6>Followers: 188</h6>
                        </div>
                    </div>
                </div>
                <CoverNavigationButtons items={coverData}/>
            </div>

            <Carousel defaultActiveIndex={0} nextIcon={nextIcon} prevIcon={prevIcon}>
            {coverData.map((item, key)=> {
                return (<CarouselItem key={key}>
                    <RenderCover cover={item.data} />
                </CarouselItem>)
            })}
            </Carousel>

        </div>);

};

export default CoverHeader;