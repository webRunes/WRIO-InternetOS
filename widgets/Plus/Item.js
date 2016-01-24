import React from 'react';
import classNames from 'classnames';

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.data ? props.data.active : false
        };
        this.gotoUrl = this.gotoUrl.bind(this);
    }
    gotoUrl() {
        if (window.localStorage) {
            localStorage.setItem('tabScrollPosition', document.getElementById('tabScrollPosition').scrollTop);
        }

        window.location = this.props.data.url;
    }
    render() {
        var className = classNames({
                active: this.state.active,
                panel: true
            }),
            data = this.props.data,
            name = data.name;
        return (
            <li tabIndex="1" className={className}>
                <a onClick={this.props.del} className="pull-right">
                    <span className="glyphicon glyphicon-remove" />
                </a>
                <a href={'//' + this.props.data.url} ref="tab" onClick={this.gotoUrl}>{name}</a>
            </li>
        );
    }
}

Item.propTypes = {
    data: React.PropTypes.object.isRequired,
    del: React.PropTypes.func.isRequired
};

module.exports = Item;
