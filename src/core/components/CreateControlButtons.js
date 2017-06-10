import React from 'react';
import UIActions from '../actions/UI.js';
import PlusActions from '../../widgets/Plus/actions/PlusActions.js';
import normURL from '../../widgets/Plus/utils/normURL';
import UrlMixin from '../mixins/UrlMixin';
import RaisedButton from 'material-ui/RaisedButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close.js'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit.js'

export default class CreateControlButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editAllowed: false
        };
    }

    componentWillMount() {
        UIActions.gotProfileUrl.listen((author) => {
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
        UIActions.switchToEditMode({
            editMode: true
        });
    }

    render() {
        return (
            <div className="margin-bottom">
                {this.state.editAllowed && <RaisedButton lable="Edit"
                                                         icon={<EditIcon />}
                                                         onClick={this.onEditClick} /> }

                <RaisedButton label="Close"
                              icon={<CloseIcon />}
                              onClick={this.onCloseClick.bind(this)}
                    />
            </div>
        );
    }
};

CreateControlButtons.propTypes = {
    article: React.PropTypes.object.isRequired,
    author: React.PropTypes.string.isRequired
};