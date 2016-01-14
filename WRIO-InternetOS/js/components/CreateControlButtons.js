import React from 'react';
import CenterActions from '../actions/center';
import PlusActions from 'plus/js/actions/jsonld';
import normURL from 'plus/js/stores/normURL';

export default class CreateControlButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editAllowed: false
        };
    }

    componentWillMount() {
        CenterActions.gotWrioID.listen((id) => {
            if (id === this.props.author.id) {
                this.setState({
                    editAllowed: true
                });
            }
        });
    }

    onCloseClick() {
        var url = normURL(window.location.href);
        var parentUrl = this.props.author.url ? normURL(this.props.author.url) : undefined;
        parentUrl ? PlusActions.del(parentUrl, url) : PlusActions.del(url);
    }

    onEditClick() {
        CenterActions.switchToEditMode({
            editMode: true
        });
    }

    render() {
        return (
            <div className="margin-bottom">
                {this.state.editAllowed ? <button type="button" onClick={this.onEditClick} className="btn btn-default btn-block"><span className="glyphicon glyphicon-pencil"></span>Edit</button> : ''}
                <button type="button" className="btn btn-success btn-block"><span className="glyphicon glyphicon-plus"></span>Added</button>
                <button type="button" onClick={this.onCloseClick.bind(this)} className="btn btn-default btn-block"><span className="glyphicon glyphicon-remove"></span>Close</button>
            </div>
        );
    }
};

CreateControlButtons.propTypes = {
    article: React.PropTypes.object.isRequired,
    author: React.PropTypes.object.isRequired
};
