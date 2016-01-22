import React from 'react';
import classNames from 'classnames';
import {getServiceUrl,getDomain} from '../../WRIO-InternetOS/js/servicelocator.js';

var domain = getDomain();

class P extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userId: ''
        };
        this.userId = this.userId.bind(this);
        this.gotoUrl = this.gotoUrl.bind(this);
    }

    userId(id) {
        this.setState({
            userId: id
        });

    }
    componentDidMount () {
        window.addEventListener('message', function (e) {

            var httpChecker = new RegExp('^(http|https)://login.' + domain, 'i');
            if (httpChecker.test(e.origin)) {
                var jsmsg = JSON.parse(e.data);
                if (jsmsg.profile) {
                    this.userId(jsmsg.profile.id);
                }

            }

        }.bind(this));
    }

    gotoUrl(){
        window.location = '//wr.io/' + this.state.userId + '/Plus-WRIO-App/';
    }

    render(){
        var className = classNames(
            'new panel',
            {
                active: this.props.active,
                fixed: this.props.data.fixed
            }
        );

        return (
            <div className={className}>
                <a onClick={this.gotoUrl} style={{width: '100%'}} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </div>
        );
    }
}

P.propTypes = {
    data: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool.isRequired
};

export default P;
