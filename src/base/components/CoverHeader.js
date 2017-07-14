/* @flow */
/**
 * Created by michbil on 17.06.17.
 */
// $FlowFixMe
import Reflux from 'reflux'
import React from 'react';
import ItemList from '../jsonld/entities/ItemList'
import ImageObject from '../jsonld/entities/ImageObject'
import CoverActions from '../actions/CoverActions'
import CoverStore from '../store/CoverStore'
// $FlowFixMe
import {CarouselItem} from 'react-bootstrap'
import Carousel from './misc/FixedCarousel'

const nextIcon = ( <i className="material-icons">keyboard_arrow_right</i>);
const prevIcon = ( <i className="material-icons">keyboard_arrow_left</i>);

const defaultBg = "https://default.wrioos.com/img/default-cover-bg.png";

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
                descr.push(<div key={index++} >{item.text}</div>);
            }

        });
        purgeList();

        return  <span>{descr}</span>;

};

const carouselStyle = (path,height) => {
    return {
        background: `url('${path}') no-repeat center center fixed`,
        WebkitBackgroundSize:"cover",
        MozBackgroundSize:"cover",
        OBackgroundSize:"cover",
        BackgroundSize:"cover",
        transform: "translate3d(0px, 0px, 0px)",
        minHeight:height
    }
};

const RenderCover = ({image} : {image : ImageObject}) => {

    var path = image.getKey('contentUrl'); //cover.img;
    var name = image.getKey('name');
    var about = image.getKey('about');



    return (<div style={carouselStyle(path,"100vh")} className="cover-bg header header-filter">
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

const hasIndex = (array,index) => array.reduce((res,item) => res || (item == index),false);

/**
 * Navigation buttons pane
 * @param items
 * @returns {XML}
 * @constructor
 */

const CoverNavigationButtons = ({items,currentCover} : {items: Array<Object>,currentCover: number}) => {
    return (<nav className="navbar navbar-transparent">
        <ul className="nav navbar-nav navbar-left">
            {items.map((r,key)=>{
                let cls = hasIndex(r.carouselIndexes,currentCover) ? "active" : "";

                return (
                    <li key={key}>
                    <a href={r.segueUrl}
                       onClick={(e) => {
                           e.preventDefault();
                           CoverActions.pressCoverButton(r);
                       }}
                       className={cls}
                       data-toggle="tab">
                        {r.name}
                        <div className="ripple-container"></div>
                    </a>
                </li>)
            })}

        </ul>
    </nav>);
};

/**
 * Stateless component for overall cover block
 * @param covers
 * @param onCoverChanged
 * @returns {XML}
 * @constructor
 */

const CoverBlock = ({covers,images,currentCover,onCoverChanged}
: {covers : Array<ItemList>,
    images : Array<ImageObject>,
    currentCover: number,
    onCoverChanged : Function}) => {


    console.log("RENDERING", covers);
    const headerStyle = (covers.length == 0) ? {height:"auto",minHeight:"120px"} : {height:"auto",minHeight:"100vh"};
    return (
        <div className="page-header" style={headerStyle}>
            <div className="cover col-xs-8 col-xs-offset-2 col-lg-9 col-lg-offset-3">
                <div className="cover-left">
                    <div className="card card-profile card-plain">
                        <div className="card-image hidden">
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
                <CoverNavigationButtons items={covers} currentCover={currentCover}/>
            </div>
            {(covers.length != 0) ?
            <Carousel defaultActiveIndex={0}
                      activeIndex={currentCover}
                      onSelect={(e) => onCoverChanged(e)}
                      interval={8000}
                      nextIcon={nextIcon}
                      prevIcon={prevIcon}>
            {images.map((image : ImageObject, key : number)=> {
                return (<CarouselItem key={key}>
                    <RenderCover image={image} />
                </CarouselItem>)
            })}
            </Carousel> : <div style={carouselStyle(defaultBg,"120px")} className="cover-bg" />
            }

        </div>);

};

type CoverContainerProps =  {
}

class CoverContainer extends Reflux.Component {
    props: CoverContainerProps;

    constructor(props : CoverContainerProps) {
        super (props);
        this.stores = [CoverStore];
    }

    render () {
        if (!this.state) {
            return null;
        }
        return <CoverBlock covers={this.state.covers}
                           images={this.state.images}
                           currentCover={this.state.selected}
                           onCoverChanged={current => {
                                CoverActions.selectCover(current)
                           }}
        />
    }
}

export default CoverContainer;