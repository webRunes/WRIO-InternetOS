/* @flow */

import React from 'react';
import { replaceSpaces } from '../mixins/UrlMixin';
import {
  scrollTop,
  getElementDimensions,
  StayOnTopElement,
  pageEltHt,
  addClass,
  removeClass,
} from './utils/domutils';

const MenuButton = ({
  active,
  name,
  url,
  hasLabel,
  onNavigateArticleHash,
}: {
  active: boolean,
  name: string,
  hasLabel: boolean,
  url: string,
}) => {
  const className = active ? 'active' : '';
  const click = () => onNavigateArticleHash(name, replaceSpaces(name));
  const href = url && url !== 'url'
    ? url.replace(/ /g, '%20')
    : name
      ? '#' + name.replace(/ /g, '%20')
      : '#';
  return (
    <li className={className}>
      <a
        href={href}
        onClick={click}
        data-toggle="offcanvas"
        style={active ? { color: '#333' } : {}}
        className={active ? 'is-selected' : ''}
      >
        <span className="cd-dot" />
        {hasLabel && <span className="cd-label">{name}</span>}
      </a>
    </li>
  );
};

const UpButton = ({ showUp }) => (
  <a
    href="#"
    data-toggle="tab"
    onClick={() => {
      // $FlowFixMe
      document.body.scrollTop = 0; // For Chrome, Safari and Opera
      // $FlowFixMe
      document.documentElement.scrollTop = 0; // For IE and Firefox
    }}
  >
    {showUp && (
      <i className="material-icons dp_big invert-icon-v visib2le-xs-block">file_download</i>
    )}
  </a>
);

type VNProps = {
  articleItems: Array<Object>,
  vertical: boolean,
  showUp: boolean,
  onNavigateArticleHash: Function,
};

export class VerticalNav extends React.Component {
  props: VNProps;
  constructor(props: VNProps) {
    super(props);
    this.state = { items: this.props.articleItems };
    // $FlowFixMe
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }
  componentWillReceiveProps(newProps: VNProps) {
    this.setState({
      items: newProps.articleItems,
      showUp: newProps.showUp,
    });
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll() {
    this.props.articleItems.forEach((item, i) => {
      const articleChapter = document.getElementById(item.url.replace('#', ''));
      const chapterSize = getElementDimensions(articleChapter);
      if (!chapterSize) return;
      // $FlowFixMe
      const windowHt = document.body.clientHeight;
      if (
        chapterSize.top - windowHt / 2 < scrollTop() &&
        chapterSize.top + chapterSize.height - windowHt / 2 > scrollTop()
      ) {
        // console.log("ACTIVE",i);
        this.setActive(i);
      }
    });
  }
  setActive(index: number) {
    const newItems = this.state.items.map((item, i) => {
      const newItem = {
        ...item,
        active: index === i,
      };
      return newItem;
    });
    this.setState({ items: newItems });
  }
  render() {
    const { vertical } = this.props;
    return (
      <nav
        ref={(nav) => {
          this.nav = nav;
        }}
        id={vertical ? 'cd-vertical-nav' : ''}
        className={!vertical ? 'contents visible-md-block visible-lg-block' : ''}
      >
        {!vertical && (
          <UpButton
            showUp={this.props.showUp}
          />
        )}
        {!vertical && <h1 style={{ paddingTop: '0px' }}>Contents</h1>}
        <ul>
          {this.state.items.map(i => (
            <MenuButton
              active={i.active}
              onNavigateArticleHash={this.props.onNavigateArticleHash}
              name={i.name}
              url={i.url}
              key={i.url}
              hasLabel={!vertical}
            />
          ))}
        </ul>
      </nav>
    );
  }
}

export class LeftNav extends StayOnTopElement {
  props: {
    articleItems: Array<Object>,
    onNavigateArticleHash: Function,
  };

  constructor(props: { articleItems: Array<Object> }) {
    super(props);
    // $FlowFixMe
    this.handleScroll = this.handleScroll.bind(this);
    this.state = { showUp: false };
    this.detached = false;
  }

  handleScroll() {
    const elem = this.subcontainer;

    const sz1 = pageEltHt('page-header') - elem.offsetHeight;
    const sz2 = scrollTop() - elem.offsetHeight;
    // console.log(`${sz1} <= ${sz2}`);
    if (sz1 <= sz2) {
      if (this.detached) return;
      addClass(elem, 'navbar-fixed-top');
      addClass(elem, 'col-sm-3');
      this.setState({ showUp: true });
      this.detached = true;
    } else {
      if (!this.detached) return;
      removeClass(elem, 'navbar-fixed-top');
      removeClass(elem, 'col-sm-3');
      this.setState({ showUp: false });
      this.detached = false;
    }
  }

  render() {
    return (
      <div className="col-sm-3">
        <div
          ref={(ref) => {
            this.subcontainer = ref;
          }}
          id="sidebar"
        >
          <div className="sidebar-margin">
            <VerticalNav
              vertical={false}
              onNavigateArticleHash={this.props.onNavigateArticleHash}
              showUp={this.state.showUp}
              articleItems={this.props.articleItems}
              cls="contents visible-md-block visible-lg-block"
            />
          </div>
        </div>
      </div>
    );
  }
}
