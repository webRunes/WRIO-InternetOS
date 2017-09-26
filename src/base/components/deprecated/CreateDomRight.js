import React from 'react';
import ReactDOM from 'react-dom';
import UrlMixin from '../mixins/UrlMixin';
import classNames from 'classnames';
import ActionMenu from '../../widgets/Plus/actions/menu';
import CreateInfoTicket from './CreateInfoTicket';
import CreateControlButtons from './CreateControlButtons';
import StoreMenu from '../../widgets/Plus/stores/menu';
import Reflux from 'reflux';
import WrioDocument from '../store/WrioDocument.js';
import WrioDocumentActions from '../actions/WrioDocument.js';
import {replaceSpaces} from '../mixins/UrlMixin';
import PropTypes from 'prop-types'

// abstract menu button

class MenuButton extends React.Component {

    onClick (e) {
        this.props.active(this);
        e.preventDefault();
    }
    constructor (props) {
        super(props);
        this.state =  {
            active: false
        };
    }
    componentWillMount () {
        if (this.props.isActive) {
            this.props.active(this);
        }
    }
    render () {
        var o = this.props.data,
            className = this.state.active ? 'active' : '',
            click = this.onClick.bind(this),
            href = replaceSpaces(o.url || '#'+ o.name || "#");
        return (
            <li className={className}>
              <a href={href} onClick={click} data-toggle="offcanvas">
                <span className="cd-dot"></span>
                <span className="cd-label">{o.name}</span>
              </a>
            </li>
        );
    }
}

MenuButton.propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired
};


class ExternalButton extends MenuButton {
    onClick (e) {
        this.props.active(this);
        console.log("External button clicked");
        WrioDocumentActions.external(this.props.data.url, this.props.data.name);
        super.onClick(e);
    }

    componentWillMount () {
        if (this.props.isActive) {
            this.props.active(this);
        }
        WrioDocumentActions.external(this.props.data.url, this.props.data.name, true, (url) => {
            this.setState({
                url: url
            });
        });
    }
}

class ArticleButton extends MenuButton{
    onClick (e) {
        this.props.active(this);
        console.log("Article button clicked");
        WrioDocumentActions.article(this.props.data.name, replaceSpaces(this.props.data.name));
        super.onClick(e);
    }
}

class CoverButton extends MenuButton {
    onClick (e) {
        console.log("Cover button clicked");
        WrioDocumentActions.cover(this.props.data.url, this.props.data.name);
        super.onClick(e);
    }
    componentWillMount () {
        if (this.props.isActive) {
            this.props.active(this);
        }
        WrioDocumentActions.cover(this.props.data.url, this.props.data.name, null, true);
    }
}

var CreateDomRight = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired
    },

    mixins: [UrlMixin],

    active: function (child) {
        if (this.current) {
            this.current.setState({
                active: false
            });
        }
        this.current = child;
        this.current.setState({
            active: true
        });
        if (this.state.active) {
            ActionMenu.showSidebar(false);
        }
    },

    getInitialState: function () {
        return {
            active: false,
            resize: false,
            article: {},
            author: ''
        };
    },

    componentDidMount: function () {
        this.listenStoreMenuSidebar = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);
        this.listenStoreMenuWindowResize = StoreMenu.listenTo(ActionMenu.windowResize, this.onWindowResize);
    },

    componentWillMount: function () {
        this.props.data.forEach((item) => {
            let o = item.data;
            if (o['@type'] === 'Article') {
                this.setState({
                    article: o,
                    author: o.author || ''
                });
            }
        });
    },

    onShowSidebar: function (data) {
        this.setState({
            active: data
        });
    },

    onWindowResize: function (width, height) {
        if (width > 767) {
            if (height < ReactDOM.findDOMNode(this.refs.sidebar)
                    .offsetHeight) {
                this.setState({
                    resize: true
                });
            }
        } else {
            this.setState({
                resize: true
            });
        }
    },

    componentWillUnmount: function () {
        this.listenStoreMenuSidebar();
        this.listenStoreMenuWindowResize();
    },

    render: function () {
        var className = classNames({
            '': true, /* removed "sidebar-offcanvas" */
            'active': this.state.active
        });

        var [coverItems,articleItems,externalItems] = this.getArticleItems();
        var height = this.getHeight();

        return (
            <div className={className} id="sidebar">
              <div ref="sidebar" className="sidebar-margin">
                <div className="hidden">
                  {this.state.article ? <aside>
                    <CreateInfoTicket article={this.state.article} author={this.state.author}/>
                  </aside> : ''}
                  {this.state.article ?
                    <CreateControlButtons article={this.state.article} author={this.state.author}/> : null}
                </div>
                { (coverItems.length > 0) ?
                  <ul className="nav nav-pills nav-stacked hidden" style={height}> {/* move to top of the page */}
                    {coverItems}
                  </ul>:""}
                { (articleItems.length > 0) ?
                  <nav className="contents visible-md-block visible-lg-block"> {/* add "navbar-fixed-top" and id="cd-vertical-nav" for small displays */}
                    <h1>Contents</h1>
                    <ul style={height}>
                      {articleItems}
                      <ArticleButton data={{name:"Comments",url:"#Comments"}}
                        active={this.active}
                        isActive={hashEquals('#Comments')}/>
                    </ul>
                  </nav>:""}
                { (externalItems.length > 0) ?
                  <ul style={height}>
                    {externalItems}
                  </ul>
                :""}
              </div>
            </div>
        );
    },

    getHeight() {
        if (window.innerWidth > 767) {
            return {
                height: 'auto'
            };
        } else {
            return {
                height: window.innerHeight - 52
            };
        }
    },


});

export default CreateDomRight;
