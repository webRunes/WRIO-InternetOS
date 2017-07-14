/* @flow */

import React from 'react';
import WrioDocumentActions from '../actions/WrioDocument.js';
import {replaceSpaces} from '../mixins/UrlMixin';


const MenuButton = ({active,name,url,hasLabel} : {active: boolean, name: string, hasLabel: boolean, url: string}) => {
    const className = active ? 'active' : '',
        click = () => WrioDocumentActions.article(name, replaceSpaces(name)),
        href = replaceSpaces(url || '#'+ name || "#");
    return (
        <li className={className}>
            <a href={href} onClick={click}
               data-toggle="offcanvas"
               style={active ? {color:"black"}:{}}
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
        const contentSections = this.refs.nav ;
        this.props.articleItems.forEach((item,i) => {
            const element = contentSections.children[i];
            if (element) {
                const $this = $(element);
                if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) &&
                    ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
                     console.log("ACTIVE",i);
                    this.setActive(i);
                }
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
                <MenuButton name="Comments"
                            key="CMMTS"
                            url="#Comments"
                            hasLabel={!vertical}
                            active={false}/>
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
        var elem = $(this.refs.container);

        if (!elem.attr('data-top')) {
            if (elem.hasClass('navbar-fixed-top'))
                return;
            var offset = elem.offset();
            elem.attr('data-top', $(window).height());
        }
        const sz1 = elem.attr('data-top') - elem.outerHeight() ;
        const sz2 = $(this).scrollTop() - $(elem).outerHeight();
        console.log(`${sz1} <= ${sz2}`);
        if (sz1 <= sz2) {
            elem.addClass('navbar-fixed-top');
            elem.addClass('col-sm-3');
        }
        else {
            elem.removeClass('navbar-fixed-top');
            elem.removeClass('col-sm-3');
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
