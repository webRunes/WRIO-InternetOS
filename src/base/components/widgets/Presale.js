/**
 * Created by michbil on 31.10.16.
 */
import React from "react";
import { getServiceUrl, getDomain } from "../../servicelocator.js";
import { webgoldHeight } from "base/actions/WindowMessage";
var domain = getDomain();

const iframeUrl = getServiceUrl("webgold") + "/presale";

class CreatePresale extends React.Component {
  createPresaleWidget() {
    var twheight = 10000;
    document.getElementById("presaleiframe").style.height = "480px";
    webgoldHeight.subscribe(ht => {
      document.getElementById("presaleiframe").style.height = ht + "px";
    });
  }
  componentDidMount() {
    this.createPresaleWidget();
  }
  render() {
    const editIframeStyles = {
      width: "100%",
      border: "none"
    };
    return (
      <div>
        <section key="b">
          <iframe
            id="presaleiframe"
            src={iframeUrl}
            frameBorder="no"
            scrolling="no"
            style={editIframeStyles}
          />
        </section>
      </div>
    );
  }
}

export default CreatePresale;
