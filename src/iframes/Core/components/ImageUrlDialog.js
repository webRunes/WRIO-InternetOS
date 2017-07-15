/**
 * Created by michbil on 07.12.16.
 */

import LinkUrlDialog from "./LinkUrlDialog.js";
import TextEditorActions from '../actions/texteditor.js';

export default class ImageUrlDialog extends LinkUrlDialog {
    constructor(props) {
        super(props);
        this.state.showTitle = true;
        this.state.showDescription = true;
    }

    onEditLink(e) {
        e.preventDefault();
        const {titleValue, urlValue, descValue,linkEntityKey} = this.state;
        TextEditorActions.editImage(urlValue,descValue, titleValue, linkEntityKey);
        this.props.actions.closeDialog();
    }

    onConfirmLink(e) {
        e.preventDefault(e);
        const {titleValue, urlValue, descValue} = this.state;
        TextEditorActions.createNewImage(urlValue,descValue,titleValue);
        this.props.actions.closeDialog();
    }

    onCancelLink(e) {
        e.preventDefault();
        this.props.actions.closeDialog();

    }

    onRemoveLink(e) {
        e.preventDefault();
        const {linkEntityKey} = this.state;
        TextEditorActions.removeEntity(linkEntityKey);
        this.props.actions.closeDialog();
    }
}