/**
 * Created by michbil on 26.06.17.
 */

import React from 'react';
import classNames from 'classnames';
import WrioDocumentActions from '../actions/WrioDocument.js';
import {replaceSpaces} from '../mixins/UrlMixin';


const MenuButton = ({active,name,url}) => {
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



const ArticleTableOfContents  = ({articleItems}) => {



        return (
            <div id="sidebar">
                <div className="sidebar-margin">
                    { (articleItems.length > 0) ?
                        <nav className="contents visible-md-block visible-lg-block"> {/* add "navbar-fixed-top" and id="cd-vertical-nav" for small displays */}
                            <h1>Contents</h1>
                            <ul>
                                {articleItems.map((i,key) => {
                                    return (<MenuButton active={i.active} name={i.name} url={i.url} />)
                                })}
                                <MenuButton name="Comments"
                                            url="#Comments"
                                               active={false}/>
                            </ul>
                        </nav>:""}
                </div>
            </div>
        );
};

export default ArticleTableOfContents;
