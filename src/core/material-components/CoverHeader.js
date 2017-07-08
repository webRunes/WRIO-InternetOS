/* @flow */
/**
 * Created by michbil on 17.06.17.
 */

import React from 'react';
import ItemList from '../jsonld/entities/ItemList'
import ImageObject from '../jsonld/entities/ImageObject'
import WrioDocumentActions from '../actions/WrioDocument'
// $FlowFixMe
import {CarouselItem} from 'react-bootstrap'
import Carousel from '../components/misc/FixedCarousel'

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

type CoverMetaData = {
    image : ImageObject,
    index : number,
    listName: string
}

const extractCovers = (coverData : Array<ItemList>) : Array<ImageObject> => {
    return coverData.reduce((acc : Array<ImageObject>, value : ItemList) => {
        return acc.concat(value.data.children);
    },[]);
}

/**
 * Stateless component for overall cover block
 * @param coverData
 * @param onCoverChanged
 * @returns {XML}
 * @constructor
 */

const CoverBlock = ({coverData,currentCover,onCoverChanged} : {coverData : Array<ItemList>,currentCover: number,onCoverChanged : Function}) => {

    const covers = extractCovers(coverData)

    console.log("RENDERING", coverData);
    const headerStyle = (coverData.length == 0) ? {height:"auto",minHeight:"120px"} : {height:"auto",minHeight:"100vh"};
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
                <CoverNavigationButtons items={coverData}/>
            </div>
            {(coverData.length != 0) ?
            <Carousel defaultActiveIndex={0}
                      onSelect={(e) => onCoverChanged(e)}
                      interval={8000}
                      nextIcon={nextIcon}
                      prevIcon={prevIcon}>
            {covers.map((image : ImageObject, key : number)=> {
                return (<CarouselItem key={key}>
                    <RenderCover image={image} />
                </CarouselItem>)
            })}
            </Carousel> : <div style={carouselStyle(defaultBg,"120px")} className="cover-bg" />
            }

        </div>);

};

type CoverContainerProps =  {
    coverData : Array<ItemList>
}

class CoverContainer extends React.Component {
    props: CoverContainerProps;

    constructor(props : CoverContainerProps) {
        super (props);
        this.state = {
            current: 0,
        }
    }

    render () {
        return <CoverBlock coverData={this.props.coverData}
                           currentCover={this.state.current}
                           onCoverChanged={current => {
                                this.setState({current})
                           }}
        />
    }
}

export default CoverContainer;