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
            <a href={href} onClick={click} >
                <span className="cd-dot"></span>
                <span className="cd-label">{name}</span>
            </a>
        </li>
    );

};

const ArticleTableOfContents  = ({articleItems,cls} : {articleItems : Array<Object>,cls: string} ) => {


        return  (articleItems.length > 0) ?
            (<nav className={cls}>
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

export default ArticleTableOfContents;
