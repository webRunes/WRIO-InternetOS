import React from 'react';
import {getServiceUrl,getDomain} from '../core/servicelocator.js';
import WindowActions from '../core/actions/WindowActions.js';
import PlusActions from './Plus/actions/PlusActions.js';
var domain = getDomain();

class Core extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            article: this.fixArticleUrl(this.props.article)
        };
   }

    fixArticleUrl(url) {
        return url ? url.replace(/#.*/,'') : url;
    }

    componentDidMount() {
        WindowActions.coreMessage.listen((msg) => {
            if (msg.coreSaved) {
                window.location.reload();
            }
            if (msg.coreHeight) {
                document.getElementById('coreiframe').style.height = msg.coreHeight+'px';
                console.log("CoreHT", msg.coreHeight);
            }
            if (msg.followLink) {
                window.location.href = msg.followLink;
            }
            if (msg.closeTab) {
                this.closeTab();
            }
        });
    }

    closeTab() {
        let url = window.location.href;
        PlusActions.del(url);
    }

    render() {
        const url = !this.state.article ? getServiceUrl('core') + '/create' : getServiceUrl('core') + '/edit?article=' + encodeURIComponent(this.state.article);
        return (
          <div>
            <div className="callout">
              <h5>Need help or inspiration?</h5>
              <p>Check out <a href="https://core.wrioos.com/Get_Inspired/">Get Inspired</a> to get additional information and samples of the content that you can use in your webpages.</p>
            </div>
            <iframe id="coreiframe"
                    ref="coreiframe"
                    className="core"
                    src={url}
                style={
                {border:"none",
                  minHeight:"240px",
                  height:"240px",
                  width:"100%"
                }} />
          </div>
        );
    }
}

Core.propTypes = {
    article: React.PropTypes.string
};

module.exports = Core;
