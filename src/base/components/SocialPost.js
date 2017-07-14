/**
 * Created by michbil on 27.06.16.
*/
import React from 'react';
import request from 'superagent';
/*
EXAMPLE:
 {
 "@type":"SocialMediaPosting",
 "datePublished":"2015-02-08T19:08:20.000Z",
 "author":{
 "@type":"Person",
 "name":"User name who posted",
 "url":"https://domain.com/user_url"
 },
 "headline":"D E T E R M I N A T I O N",
 "sharedContent":{
 "@type":"WebPage",
 "headline":"The act or an instance of making a decision. \n\nThe ascent to Island Peak.\nSagarmatha National Park. Nepal.",
 "url":"https://500px.com/photo/98284235/d-e-t-e-r-m-i-n-a-t-i-o-n-by-david-ruiz-luna",
 "author":{
 "@type":"Person",
 "name":"Davidan",
 "url":"https://500px.com/Davidan"
 }
 }
 },

 */


class Figure extends React.Component {
    props: {
        title: string,
        description: string,
        content: Object
    };
    render () {
        let figcaption = "";
        if (this.props.title) {
            figcaption = (
                <figcaption className="callout figure-details">
                    <h5>{this.props.title}</h5>
                    <p>{this.props.description}</p>
                </figcaption>);
        }
        return (
            <figure className="col-xs-12 col-md-12">
                {this.props.content}
                {figcaption}
            </figure>
        );
    }
}

class SocialPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            html:"<img class=\"img_loading\" src=\"https://default.wrioos.com/img/loading.gif\" />"
        };

    }

    downloadEmebed() {
        const data = this.props.data.data;
        if (data.sharedContent && data.sharedContent.url) {
            request.get('https://iframely.wrioos.com/oembed?url='+data.sharedContent.url, (err, result) => {
                if (err) {
                    console.error("Can't load embed ",data.sharedContent.url);
                }
                console.log(result.body.html);
                if (window.twttr && result.body.provider_name == 'Twitter') {
                    setTimeout(() => window.twttr.widgets.load(),1000); // hack to reload twitter iframes
                }
                if (result.body.type == 'link') {
                    this.setState({
                        type:"link",
                        object: result.body
                    });
                }
                const html = result.body.html;
                if (this.refs.contentblock) {
                    this.refs.contentblock.innerHTML = html;
                    exec_body_scripts(this.refs.contentblock);
                    this.setState({html});
                } else {
                    console.warn("Contentblock hidden TODO: investigate if it's ok");
                }
            });
        }
    }

    componentDidMount() {
       this.downloadEmebed();
    }

    getContent() {
        if (this.state.type == 'link') {
            const data = this.state.object;
            return (<a href={data.url}><img src={data.thumbnail_url} alt={data.description}/></a>);
        }
        const htmlData = {__html: this.state.html};
        return  (<div ref="contentblock" />);
    }

    render () {
        const content = this.getContent();
        const title = this.props.data.data.sharedContent.headline;
        const description= this.props.data.data.sharedContent.about;
        return <Figure content={content} title={title} description={description}/>;
    }
}

SocialPost.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = SocialPost;

function exec_body_scripts (body_el) {
    // Finds and executes scripts in a newly added element's body.
    // Needed since innerHTML does not run scripts.
    //
    // Argument body_el is an element in the dom.

    function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toUpperCase() ===
            name.toUpperCase();
    };

    function evalScript(elem) {

        const head = document.getElementsByTagName("head")[0] ||
                document.documentElement;

        if (elem.tagName && elem.src && elem.tagName == 'SCRIPT') {
            let script = document.createElement('script');
            script.src = elem.src;
            script.onload = window.frameReady;
            head.appendChild(script);
            return;
        }

        var data = (elem.text || elem.textContent || elem.innerHTML || "" ),
            script = document.createElement("script");

        script.type = "text/javascript";
        try {
            // doesn't work on ie...
            script.appendChild(document.createTextNode(data));
            script.onload = window.frameReady;
        } catch(e) {
            // IE has funky script nodes
            script.text = data;
        }

        head.insertBefore(script, head.firstChild);
      //  head.removeChild(script);
    };

    // main section of function
    var scripts = [],
        script,
        children_nodes = body_el.childNodes,
        child,
        i;

    for (i = 0; children_nodes[i]; i++) {
        child = children_nodes[i];
        if (nodeName(child, "script" ) &&
            (!child.type || child.type.toLowerCase() === "text/javascript")) {
            scripts.push(child);
        }
    }

    for (i = 0; scripts[i]; i++) {
        script = scripts[i];
        if (script.parentNode) {script.parentNode.removeChild(script);}
        evalScript(scripts[i]);
    }
};