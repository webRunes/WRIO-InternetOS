/**
 * Created by michbil on 29.05.17.
 */
import React from "react";
import FormActions from "../actions/formactions.js";

export default class FileEntry extends React.Component {
  onClick() {
    const input = this.refs.input;

    input.onchange = () => {
      for (let i = 0; i < input.files.length; i += 1)
        FormActions.addFile(input.files.item(i))
    }

    input.click();
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
            id="fileInput"
            name="fileInput"
          />
        </div>
        <button
          type="button"
          className="btn btn-default"
          onClick={() => this.onClick()}
        >
          <span className="glyphicon glyphicon-camera" />
          Photo
        </button>
      </div>
    );
  }
}
