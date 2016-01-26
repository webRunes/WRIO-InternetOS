import React from 'react';
import classNames from 'classnames';
import {getServiceUrl,getDomain} from '../../WRIO-InternetOS/js/servicelocator.js';
import WindowActions from '../../WRIO-InternetOS/js/actions/WindowActions.js';
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
       WindowActions.loginMessage.listen((jsmsg) => {
            if (jsmsg.profile) {
                this.userId(jsmsg.profile.id);
            }
        });
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
