import React from 'react';
import classNames from 'classnames';
import {getServiceUrl,getDomain} from '../../core/servicelocator.js';
import Actions from './actions/jsonld';
import WindowActions from '../../core/actions/WindowActions.js';

var domain = getDomain();

class PlusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userId: ''
        };
      //  this.userId = this.userId.bind(this);
       // this.gotoUrl = this.gotoUrl.bind(this);
    }

    userId(id) {
        this.setState({
            userId: id
        });

    }

    getProfile(jsmsg) {
        console.log("PLUS GOT PROFILE:",jsmsg);
        if (jsmsg.profile) {
            Actions.plusActive(false, 'https://wr.io/' + jsmsg.profile.id + '/Plus-WRIO-App/');
            this.userId(jsmsg.profile.id);
        }
    }

    componentDidMount () {
       WindowActions.loginMessage.listen((jsmsg) => {
           this.getProfile(jsmsg);
        });
    }

    gotoUrl(e) {
        Actions.plusActive(true, 'https://wr.io/' + this.state.userId + '/Plus-WRIO-App/', () => {
            window.location = 'https://wr.io/' + this.state.userId + '/Plus-WRIO-App/';
        });
        e.preventDefault();
    }

    render() {
        var className = classNames(
            'new panel',
            {
                active: this.props.active,
                fixed: this.props.data.fixed
            }
        );

        return (
            <div className={className}>
                <a href={'//wr.io/' + this.state.userId + '/Plus-WRIO-App/'} onClick={this.gotoUrl} style={{width: '100%'}} className="collapsed">
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
            </div>
        );
    }
}

PlusButton.propTypes = {
    data: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool.isRequired
};

export default PlusButton;
