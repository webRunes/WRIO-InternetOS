/* @flow */

import React from 'react';
import WrioDocumentActions from '../actions/WrioDocument.js';
import {replaceSpaces} from '../mixins/UrlMixin';


const MenuButton = ({active,name,url} : {active: boolean, name: string, url: string}) => {
    const className = active ? 'active' : '',
        click = () => {
            WrioDocumentActions.article(name, replaceSpaces(name));
        },
        href = replaceSpaces(url || '#'+ name || "#");
    return (
        <li className={className}>
            <a href={href} onClick={click} data-toggle="offcanvas">
                <span className="cd-dot"></span>
                <span className="cd-label">{name}</span>
            </a>
        </li>
    );

};



const ArticleTableOfContents  = ({articleItems} : {articleItems : Array<Object>} ) => {



        return (
            <div id="sidebar">
                <div className="sidebar-margin">
                    { (articleItems.length > 0) ?
                        <nav className="contents visible-md-block visible-lg-block"> {/* add "navbar-fixed-top" and id="cd-vertical-nav" for small displays */}
                            <h1>Contents</h1>
                            <ul>
                                {articleItems.map((i,key) => {
                                    return (<MenuButton active={i.active} name={i.name} url={i.url} key={key} />)
                                })}
                                <MenuButton name="Comments"
                                            key="CMMTS"
                                            url="#Comments"
                                               active={false}/>
                            </ul>
                        </nav>:""}
                </div>
            </div>
        );
};

export default ArticleTableOfContents;
