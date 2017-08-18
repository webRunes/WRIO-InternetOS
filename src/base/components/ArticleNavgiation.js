/* @flow */

import React from 'react';
import WrioDocumentActions from '../actions/WrioDocument.js';
import {replaceSpaces} from '../mixins/UrlMixin';
import {scrollTop, getElementDimensions, StayOnTopElement,pageEltHt,addClass,removeClass} from './utils/domutils'

const MenuButton = ({active,name,url,hasLabel} : {active: boolean, name: string, hasLabel: boolean, url: string}) => {
    const className = active ? 'active' : '',
        click = () => WrioDocumentActions.article(name, replaceSpaces(name)),
        href = replaceSpaces(url || '#'+ name || "#");
    return (
        <li className={className}>
            <a href={href} onClick={click}
               data-toggle="offcanvas"
               style={active ? {color:"black"}:{}}
               className={active && "is-selected"}
            >
                <span className="cd-dot"></span>
                {hasLabel && <span className="cd-label">{name}</span>}
            </a>
        </li>
    );

};

const UpButton = ({showUp}) => {
    return(<a href="#"
      data-toggle="tab" className="to-top"
              onClick={() => {
                  // $FlowFixMe
                   document.body.scrollTop = 0; // For Chrome, Safari and Opera
                   // $FlowFixMe
                   document.documentElement.scrollTop = 0; // For IE and Firefox
              }}
    >
        {showUp && <i className="material-icons dp_big invert-icon-v visib2le-xs-block">file_download</i>}
    </a>);
}

type VNProps = {
    articleItems : Array<Object>,
    vertical : boolean,
    showUp: boolean
};

export class VerticalNav extends React.Component {
    props: VNProps;
    constructor(props: VNProps) {
        super(props);
        this.state = {items: this.props.articleItems};
    // $FlowFixMe
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentWillReceiveProps(newProps : VNProps) {
        this.setState({
            items:newProps.articleItems,
            showUp:newProps.showUp
        });
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
        this.props.articleItems.forEach((item,i) => {

            const articleChapter = document.getElementById(item.url.replace('#',''));
            const chapterSize = getElementDimensions(articleChapter);
            // $FlowFixMe
            const windowHt = document.body.clientHeight;
            if ( ( chapterSize.top -  windowHt/2 < scrollTop() ) &&
                ( chapterSize.top + chapterSize.height - windowHt/2 > scrollTop() ) ) {
                //console.log("ACTIVE",i);
                this.setActive(i);

            }
        });
    }
    setActive(index : number) {
        const newItems = this.state.items.map((item,i) => {
            const newItem = item;
            item.active = index == i;
            return newItem;
        });
        this.setState({items:newItems});
    }
    render () {
        const vertical = this.props.vertical;
        return (<nav ref='nav'
                     id={vertical ? "cd-vertical-nav" : ""}
                     className={!vertical ? "contents visible-md-block visible-lg-block" : ""} >
            {!vertical && (<UpButton showUp={this.props.showUp} ref="up"/>)}
            {!vertical && (<h1 style={{paddingTop: "0px"}}>Contents</h1>)}
            <ul>
                {this.state.items.map((i,key) => {
                    return (<MenuButton active={i.active}
                                        name={i.name}
                                        url={i.url}
                                        key={key}
                                        hasLabel ={!vertical}
                    />)
                })}
            </ul>
        </nav>);
    }
}

export class LeftNav extends StayOnTopElement {
    props: {
        articleItems:  Array<Object>
    };

    constructor(props : {articleItems:  Array<Object>}) {
        super(props);
        // $FlowFixMe
        this.handleScroll = this.handleScroll.bind(this);
        this.state={showUp:false};
        this.detached = false;
    }

    handleScroll() {
        var elem = this.refs.subcontainer;

        const sz1 = pageEltHt('page-header') - elem.offsetHeight ;
        const sz2 = scrollTop() - elem.offsetHeight;
        //console.log(`${sz1} <= ${sz2}`);
        if (sz1 <= sz2) {
            if (this.detached) return;
            addClass(elem,'navbar-fixed-top');
            addClass(elem,'col-sm-3');
            this.setState({showUp:true});
            this.detached = true;
        }
        else {
            if (!this.detached) return;
            removeClass(elem,'navbar-fixed-top');
            removeClass(elem,'col-sm-3');
            this.setState({showUp:false});
            this.detached = false;
        }
    }


    render () {
        return (<div ref="container" className="col-sm-3">
          <div ref="subcontainer"
            id="sidebar">
                <div className="sidebar-margin">
                    <VerticalNav vertical={false}
                                 showUp={this.state.showUp}
                                 articleItems={this.props.articleItems}
                                 cls="contents visible-md-block visible-lg-block"/>
                </div>
            </div>
        </div>);
    }
}
