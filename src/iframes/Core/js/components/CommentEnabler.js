/**
 * Created by michbil on 29.04.16.
 */
import React from 'react';
import {getWidgetID} from '../webrunesAPI.js';
import WrioActions from '../actions/wrio.js';
import WrioStore from '../stores/wrio.js';

var domain = process.env.DOMAIN;

export default class CommentEnabler extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            isChecked: WrioStore.areCommentsEnabled()
        };
    }

    componentDidMount() {
        this.listener = WrioStore.listen(this.storeListener.bind(this));
    }

    componentWillUnmount() {
        this.listener();
    }

    storeListener(state) {
        this.setState({isChecked: state.commentsEnabled});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        WrioActions.commentsEnabled(value);
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="id-Comment" className="col-xs-12 col-sm-4 col-md-3 control-label">
                { false && <span className="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="left" title="Comments work through the Twitter. The Advanced mode is designed for those wishing to have full control over comments. For the reasons of security we do not save the password from you Twitter account, thus you need to re-enter it every time you turn the Advanced mode on."></span> }Comments</label>
                <div className="col-xs-6 col-sm-4 col-md-4">
                    <div className="checkbox">
                        <label><input name="isChecked" type="checkbox" checked={this.state.isChecked} onChange={this.handleInputChange} />Enabled</label>
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate () {
        window.frameReady();
    }

}

CommentEnabler.propTypes = {
    commentID: React.PropTypes.string,
    author: React.PropTypes.string,
    editUrl: React.PropTypes.string,
};
