/* @flow */
/**
 * Cover Carousel Component, shown on the top of the each document
 * Created by michbil on 17.06.17.
 */
// $FlowFixMe
import Reflux from 'reflux';
import React from 'react';
import ItemList from '../jsonld/entities/ItemList';
import ImageObject from '../jsonld/entities/ImageObject';
// $FlowFixMe
import { CarouselItem } from 'react-bootstrap';
import Carousel from './misc/FixedCarousel';

const nextIcon = <i className="material-icons">keyboard_arrow_right</i>;
const prevIcon = <i className="material-icons">keyboard_arrow_left</i>;

const defaultBg = 'https://default.wrioos.com/img/default-cover-bg.png';

const carouselStyle = (path, height) => ({
    background: `url('${path}') no-repeat center center`,
    minHeight: height,
});

/**
 * Renders cover text contents
 * @param cover
 * @returns {XML}
 * @constructor
 */

const CoverText = ({ cover }: { cover: ImageObject }) => {
  //  console.log('cover", cover);
  const items = cover.getCoverItems();
  let descr = [];
  let bulletList = [];
  let index = 0;

  function purgeList() {
    if (bulletList.length !== 0) {
      descr.push(
        <ul key={index++} className="features">
          {bulletList.map(item => {
            return (
              <li key={index++}>
                <span className="glyphicon glyphicon-ok with_text" />
                {item}
              </li>
            );
          })}
        </ul>
      );
      bulletList = [];
    }
  }

  items.forEach((item) => {
    if (item.bullet) {
      bulletList.push(<span key={index++}>{item.text}</span>);
    } else {
      purgeList();
      descr.push(<div key={index++}>{item.text}</div>);
    }
  });
  purgeList();

  return <span>{descr}</span>;
};

const RenderCover = ({ image, onPress }: { image: ImageObject }) => {
  const path = image.getKey('contentUrl'); //cover.img;
  const name = image.getKey('name');
  const about = image.getKey('about');

  return (
    <div
      style={carouselStyle(path, '100vh')}
      className="cover-bg header header-filter"
      onClick={onPress}
    >
      <div className="carousel-caption">
        <div className="carousel-caption">
          <div className="row">
            <div className="col-xs-8 col-xs-offset-2 col-lg-6 col-lg-offset-3">
              <div className="title">
                <div className="title-text">
                  <h1>{name}</h1>
                  <h2>{about}</h2>
                  <h3><CoverText cover={image}/></h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const hasIndex = (array, index) =>
  array.reduce((res, item) => res || item === index, false);

/**
 * Navigation buttons pane
 * @param items
 * @returns {XML}
 * @constructor
 */

const CoverNavigationButtons = ({
  items,
  currentCover,
  onCoverButtonPressed,
}: {
  items: Array<Object>,
  currentCover: number,
  onCoverButtonPressed: Function
}) => {
  return (
    <nav className="navbar navbar-transparent">
      <ul className="nav navbar-nav navbar-left">
        {items.map((r) => {
          const cls = hasIndex(r.carouselIndexes, currentCover) ? 'active' : '';

          return (
            <li key={r.name}>
              <a
                href={r.segueUrl}
                onClick={(e) => {
                  e.preventDefault();
                  onCoverButtonPressed(r);
                }}
                className={cls}
                data-toggle="tab"
              >
                {r.name}
                <div className="ripple-container" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const Logo = () => (<div className="cover-left">
<div className="card card-profile card-plain">
  <div className="card-image hidden">
    <a href="#" className="img">
      <img src="https://default.wrioos.com/img/logo.png" alt="Webrunes logo" />
    </a>
  </div>
  <div className="hidden">
    <a href="#" className="author">
      By User Name
    </a>
    <h6>Followers: 188</h6>
  </div>
</div>
</div>);

/**
 * Stateless component for overall cover block
 * @param covers
 * @param onCoverChanged
 * @returns {XML}
 * @constructor
 */

const CoverCarousel = ({
  covers,
  images,
  currentCover,
  onCoverChanged,
  onCoverPressed,
  onCoverButtonPressed,
}: {
  covers: Array<ItemList>,
  images: Array<ImageObject>,
  currentCover: number,
  onCoverChanged: Function,
  onCoverPressed: Function,
  onCoverButtonPressed: Function,
}) => {
  const headerStyle =
    covers.length === 0
      ? { height: 'auto', minHeight: '256px' }
      : { height: 'auto', minHeight: '100vh' };
  return (
    <div className="page-header" style={headerStyle} >
      <div className="cover col-xs-8 col-xs-offset-2 col-lg-6 col-lg-offset-3">
        <Logo />
        <CoverNavigationButtons
          items={covers}
          currentCover={currentCover}
          onCoverButtonPressed={onCoverButtonPressed}
        />
      </div>
      {covers.length !== 0 ? (
        <Carousel
          defaultActiveIndex={0}
          activeIndex={currentCover}
          onSelect={e => onCoverChanged(e)}
          interval={8000}
          nextIcon={nextIcon}
          prevIcon={prevIcon}
        >
          {images.map((image: ImageObject, key: number) => {
            return (
              <CarouselItem key={key}>
                <RenderCover image={image}
                  onPress={() => onCoverPressed(covers[currentCover].root.data)}
                />
              </CarouselItem>
            );
          })}
        </Carousel>
      ) : (
        <div className="cover-bg" onClick={() => onCoverPressed()} />
      )}
    </div>
  );
};


export default CoverCarousel;
