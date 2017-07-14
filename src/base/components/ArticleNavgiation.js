/* @flow */

import React from 'react';
import WrioDocumentActions from '../actions/WrioDocument.js';
import {replaceSpaces} from '../mixins/UrlMixin';
import {scrollTop, getElementOffset, hasClass, addClass,removeClass} from './utils/domutils'

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


export const ArticleTableOfContents  = ({articleItems,elId} : {articleItems : Array<Object>,elId: string} ) => {
        return  (articleItems.length > 0) ?
            (<nav id={elId}>
                    <ul>
                        {articleItems.map((i,key) => {
                            return (<MenuButton active={i.active} name={i.name} url={i.url} key={key} />)
                        })}
                        <MenuButton name="Comments"
                                    key="CMMTS"
                                    url="#Comments"
                                       active={false}/>
                    </ul>
                </nav>) : null;

};




export class VerticalNav extends React.Component {
    props: {
        articleItems : Array<Object>,
        vertical : boolean
    };
    constructor(props) {
        super(props);
        this.state = {items: this.props.articleItems};
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentWillReceiveProps(newProps) {
        this.setState({items:newProps.articleItems});
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    }
    componentDidUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
        this.props.articleItems.forEach((item,i) => {

            const articleChapter = document.getElementById(item.url.replace('#',''));
            const chapterSize = getElementOffset(articleChapter);
            const windowHt = document.body.clientHeight;
            if ( ( chapterSize.top -  windowHt/2 < scrollTop() ) &&
                ( chapterSize.top + chapterSize.height - windowHt/2 > scrollTop() ) ) {
                //console.log("ACTIVE",i);
                this.setActive(i);
            }
        });
    }
    setActive(index) {
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
            {!vertical && <h1>Contents</h1>}
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

export class LeftNav extends React.Component {
    props: {
        articleItems:  Array<Object>
    };

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    }
    componentDidUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        var elem = this.refs.subcontainer;
        const windowHt = document.body.clientHeight;


        if (!elem.getAttribute('data-top')) {
            if (hasClass(elem,'navbar-fixed-top'))
                return;
            var offset = getElementOffset(elem);
            elem.setAttribute('data-top', windowHt);
        }
        const sz1 = elem.getAttribute('data-top') - elem.offsetHeight ;
        const sz2 = scrollTop() - elem.offsetHeight;
        console.log(`${sz1} <= ${sz2}`);
        if (sz1 <= sz2) {
            addClass(elem,'navbar-fixed-top');
            addClass(elem,'col-sm-3');
        }
        else {
            removeClass(elem,'navbar-fixed-top');
            removeClass(elem,'col-sm-3');
        }
    }

    render () {
        return (<div ref="container" className="col-sm-3">
            <div ref="subcontainer"
                 id="sidebar"
                 className="col-sm-3">
                <div className="sidebar-margin">
                    <VerticalNav vertical={false} articleItems={this.props.articleItems}
                                 cls="contents visible-md-block visible-lg-block"/>
                </div>
            </div>
        </div>);
    }
}
