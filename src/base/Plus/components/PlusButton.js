import React from 'react';
import classNames from 'classnames';
import {getServiceUrl,getDomain} from '../../servicelocator.js';
import PlusActions from '../actions/PlusActions.js';


var domain = getDomain();

class PlusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userId: ''
        };
       this.gotoUrl = this.gotoUrl.bind(this);
    }

    userId(id) {
        this.setState({
            userId: id
        });

    }

    getProfile(jsmsg) {
        console.log("PLUS GOT PROFILE:",jsmsg);
        if (jsmsg.profile) {
            PlusActions.plusActive(false, 'https://wr.io/' + jsmsg.profile.id + '/Plus-WRIO-App/');
            this.userId(jsmsg.profile.id);
        }
    }

    componentDidMount () {
     /*  WindowActions.loginMessage.listen((jsmsg) => {
           this.getProfile(jsmsg);
        });*/
    }

    gotoUrl(e) {
        e.preventDefault();
        window.location = 'https://wr.io/' + this.state.userId + '/Plus-WRIO-App/';
        return false;
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
                <a href={'https://wr.io/' + this.state.userId + '/Plus-WRIO-App/'} onClick={this.gotoUrl} style={{width: '100%'}} className="collapsed">
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
