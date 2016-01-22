import React from 'react';
import actions from './actions/jsonld';
import Item from './Item';
import classNames from 'classnames';
import sortBy from 'lodash.sortby';
import some from 'lodash.some';

class SubList extends React.Component{
    constructor(props){
        super(props);
        this.style = {
            overflow: 'hidden',
            height: ''
        };
        this.gotoUrl = this.gotoUrl.bind(this);
    }
    gotoUrl () {
        window.location = '//' + this.props.data.url;
    }
    createItem () {
        var children = this.props.data.children;
        return sortBy(
            Object.keys(children).map(function (name) {
                return children[name];
            }),
            'order'
        ).map(function (i) {
                var list = this.props.data.url,
                    del = function () {
                        actions.del(list, i.url);
                    };
                if (i.active) {
                    this.style.height = 'auto';
                }
                return <Item className="panel" del={del} data={i} key={i.url} />;
            }, this);
    }

    render() {
        this.style.height = this.props.data.active ? 'auto' : '0px';
        var data = this.props.data,
            name = data.name,
            children = data.children,
            childrenActive = some(children, function(i){
                return i.active;
            }),
            lis = this.createItem(),
            rightContent = children ? Object.keys(children).length : <span onClick={this.del} className="glyphicon glyphicon-remove" />,
            className = classNames({
                panel: true,
                active: data.active,
                open: (children && (data.active || childrenActive))
            });
        return (
            <li className={className}>
                <a href={'//' + this.props.data.url} onClick={this.gotoUrl} className="collapsed" data-parent="#nav-accordion" data-toggle="collapse">
                    <span className="qty pull-right">{rightContent}</span>
                    <span>{name}</span>
                </a>
                <div className="in" style={this.style}>
                    <ul className="nav nav-pills nav-stacked sub">
                        {lis}
                    </ul>
                </div>
            </li>
        );
    }
}

SubList.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = SubList;

