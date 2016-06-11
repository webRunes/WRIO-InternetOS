import React from 'react';
import CenterActions from '../actions/center';
import PlusActions from '../../widgets/Plus/actions/PlusActions.js';
import normURL from '../../widgets/Plus/utils/normURL';
import UrlMixin from '../mixins/UrlMixin';

export default class CreateControlButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editAllowed: false
        };
    }

    componentWillMount() {
        CenterActions.gotProfileUrl.listen((author) => {
            if (UrlMixin.fixUrlProtocol(author) == UrlMixin.fixUrlProtocol(this.props.author)) {
                this.setState({
                    editAllowed: true
                });
            }
        });
    }

    onCloseClick() {
        var url = window.location.href;
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
                //<button type="button" className="btn btn-success btn-block"><span className="glyphicon glyphicon-plus"></span>Added</button>
                <button type="button" onClick={this.onCloseClick.bind(this)} className="btn btn-default btn-block"><span className="glyphicon glyphicon-remove"></span>Close</button>
            </div>
        );
    }
};

CreateControlButtons.propTypes = {
    article: React.PropTypes.object.isRequired,
    author: React.PropTypes.string.isRequired
};
