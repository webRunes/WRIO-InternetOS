/**
 * Created by michbil on 29.05.17.
 */
import React from "react";
import Actions from "../actions/formactions.js";

// TODO: remove legacy jQuery hacks

$(document).ready(function() {
  console.log("Iframe loaded");
  $("#fileInput").change(function() {
    $.each(this.files, function(key, value) {
      Actions.addFile(value);
    });
  });
});

export default class FileEntry extends React.Component {
  render() {
    return (
      <div className="pull-left">
        <div style={{ height: "0px", overflow: "hidden" }}>
          <input
            type="file"
            accept="image/*"
            multiple
            id="fileInput"
            name="fileInput"
          />
        </div>
        <button
          type="button"
          className="btn btn-default"
          onClick={() => {
            $("#fileInput").click();
          }}
        >
          <span className="glyphicon glyphicon-camera" />
          Photo
        </button>
      </div>
    );
  }
}
