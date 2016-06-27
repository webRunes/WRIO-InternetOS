/**
 * Created by michbil on 27.06.16.
 */
import AbstractMention from './abstractMention.js';
import React from 'react';

class Social extends AbstractMention {
    constructor(opts) {
        super(opts)
        this.name = opts.headline;
        this.sharedContent = opts.sharedContent
    }

    warn(text) {
        text = text || 'Not Found: ' + this.url;
    }

    attach(s) {
        var before = s.substr(0, this.start),
            after = s.substring(this.start, s.length);
        return {
            before: before,
            obj: this,
            after: after
        };
    }

    render () {
        if (post) {
            return (<div className="pixels-photo">
                <p>
                    <img src="https://drscdn.500px.org/photo/98284235/m%3D900/9fcefab43363c25fd985bd06402a82c8" alt="D E T E R M I N A T I O N by David Ruiz Luna | 500px.com" />
                </p>
                <a href="https://500px.com/photo/98284235/d-e-t-e-r-m-i-n-a-t-i-o-n-by-david-ruiz-luna" alt="D E T E R M I N A T I O N by David Ruiz Luna | 500px.com"></a>

            </div>);
        }
    }
}

module.exports = Image;
