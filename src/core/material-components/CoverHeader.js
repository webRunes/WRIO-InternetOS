/**
 * Created by michbil on 17.06.17.
 */

import React from 'react';

function getCoverList(data) {
    var data = _.chain(data)
        .map('children')
        .flatten()
        .filter(function (item) {
            return !_.isEmpty(item);
        })
        .map(function (item, key) {
            return (
                <CarouselItem key={key}><CreateCover data={item} key={key} isActive={key === 0}/></CarouselItem>);
        })
        .value();

    return (
        <Carousel defaultActiveIndex={0}>{data}</Carousel>
    );
}

const CoverHeader = ({coverData}) => {
    console.log(coverData);
    return (
        <div className="page-header">
        <div className="cover col-xs-8 col-xs-offset-2 col-lg-9 col-lg-offset-3">
            <div className="cover-left">
                <div className="card card-profile card-plain">
                    <div className="card-image">
                        <a href="#" className="img">
                            <img src="https://default.wrioos.com/img/logo.png" />
                        </a>
                    </div>
                    <div className="hidden">
                        <a href="#" className="author">By User Name</a>
                        <h6>Followers: 188</h6>
                    </div>
                </div>
            </div>
            <nav className="navbar navbar-transparent">
                <ul className="nav navbar-nav navbar-left">
                    <li>
                        <a href="#profile" className="active" data-toggle="tab">
                            Cover
                            <div className="ripple-container"></div>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            Offer
                            <div className="ripple-container"></div>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            Tutorial
                            <div className="ripple-container"></div>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <div className="card card-carousel" data-parallax="true">
            <div id="carousel-header" className="carousel slide" data-ride="carousel">
                <div className="carousel slide" data-ride="carousel">

                    <div className="carousel-indicators">
                        <ol className="col-xs-8 col-xs-offset-2 col-lg-9 col-lg-offset-3">
                            <li data-target="#carousel-header" data-slide-to="0" className=""></li>
                            <li data-target="#carousel-header" data-slide-to="1" className="active"></li>
                            <li data-target="#carousel-header" data-slide-to="2" className=""></li>
                        </ol>
                    </div>

                    <div className="carousel-inner">
                        <div className="header-filter cover-bg item active">
                            <div className="carousel-caption">
                                <div className="row">
                                    <div className="col-xs-8 col-xs-offset-2 col-lg-9 col-lg-offset-3">
                                        <div className="title">
                                            <div className="title-text">
                                                <h1>Cosmos</h1>
                                                <h3>Cosmos: A Spacetime Odyssey is a 2014 American science documentary television series. The show is a follow-up to the 1980 television series ',
                                                         which was presented by Carl Sagan on the Public Broadcasting Service and is considered a milestone for scientific documentaries.</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a className="left carousel-control" href="#carousel-header" data-slide="prev">
                        <i className="material-icons">keyboard_arrow_left</i>
                    </a>
                    <a className="right carousel-control" href="#carousel-header" data-slide="next">
                        <i className="material-icons">keyboard_arrow_right</i>
                    </a>
                </div>
            </div>


        </div>
    </div>);
};

export default CoverHeader;