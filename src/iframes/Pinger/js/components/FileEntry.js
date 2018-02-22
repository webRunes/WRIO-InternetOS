/**
 * Created by michbil on 29.05.17.
 */
import React from "react";
import FormActions from "../actions/formactions.js";

export default class FileEntry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shouldAutoClick: false
    }
  }

  onClick() {
    return this.props.hasComment
      ? this.clearTextAreaAndAddPhoto()
      : this.props.hasPhoto
        ? FormActions.deletePhoto()
        : this.addFiles()
  }

  clearTextAreaAndAddPhoto() {
    this.setState({shouldAutoClick: true});
    FormActions.deleteComment();
  }

  componentDidUpdate() {
    if (this.state.shouldAutoClick) {
      this.addFiles();
      this.setState({shouldAutoClick: false});
    }
  }

  addFiles() {
    const input = this.refs.input;
    input.type = '';
    input.type = 'file';
    input.onchange = () => {
      for (let i = 0; i < input.files.length; i += 1)
        FormActions.addFile(input.files.item(i))

    }
    input.click()
  }

  text() {
    return this.props.hasComment
      ? 'Clear text area and add photo'
      : this.props.hasPhoto
        ? 'Delete photo and add text'
        : 'Photo'
  }

  render() {
    return (
      <div className="pull-left">
        <div style={{ height: "0px", overflow: "hidden" }}>
          <input
            type="file"
            ref="input"
            accept="image/*"
            multiple
          />
        </div>
        <button
          type="button"
          className="btn btn-default"
          onClick={() => this.onClick()}
        >
          {this.text()}
        </button>
      </div>
    );
  }
}
