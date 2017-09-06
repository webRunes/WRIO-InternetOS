import React from 'react';
import {CompositeDecorator, ContentState, SelectionState, Editor, EditorState, Entity, RichUtils, CharacterMetadata, getDefaultKeyBinding,  Modifier} from 'draft-js';
import request from 'superagent';


class Figure extends React.Component {
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
            <figure >
                {this.props.content}
                {figcaption}
            </figure>
        );
    }
}
Figure.propTypes = {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    content: React.PropTypes.object
};

// image template component for the editor


export default class SocialMediaEntity extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getProps(props);
        this.onLinkEdit = this.onLinkEdit.bind(this);
    }

    componentDidMount() {
        if (this.state.src) {
            this.downloadEmebed( {
                sharedContent: {
                    url: this.state.src
                }
            });
        }
    }

    getProps(props) {
        const {
            src,description,title,editCallback
            } = Entity.get(props.entityKey).getData();
        console.log(props.decoratedText);
        this.downloadEmebed( {
            sharedContent: {
                url: src
            }
        });
        return {
            html:"<img class=\"img_loading\" src=\"https://default.wrioos.com/img/loading.gif\" />",
            src,
            description,
            title,
            entityKey: props.entityKey,
            linkCallback: editCallback
        };
    }

    downloadEmebed(data) {
        if (data.sharedContent && data.sharedContent.url) {
            request.get('https://iframely.wrioos.com/oembed?url='+encodeURIComponent(data.sharedContent.url), (err, result) => {
                if (err) {
                    return console.error("Can't load embed ",data.sharedContent.url);
                }

                if (result.body.provider_name && result.body.provider_name == 'Twitter') {
                    setTimeout(() => window.twttr.widgets.load(),1000); // hack to reload twitter iframes
                }
                if (result.body.type == 'link') {
                    this.setState({
                        type:"link",
                        object: result.body
                    });
                }
                const html = result.body.html;
                this.refs.contentblock.innerHTML = html;
                exec_body_scripts(this.refs.contentblock);
                this.setState({html});
            });
        }
    }

    onLinkEdit (e) {
        e.preventDefault();
        this.state.linkCallback(this.state.title, this.state.src, this.state.description, this.state.entityKey);
    }

    componentWillReceiveProps(props) {
        this.setState(this.getProps(props));
    }

    getContent() {
        if (this.state.type == 'link') {
            const data = this.state.object;
            return (<a href={data.url}><img src={data.thumbnail_url} alt={data.description}/></a>);
        }
        return  (<div ref="contentblock" />);
    }

    render() {
        const content = this.getContent();
        const title = this.state.title;
        const description= this.state.description;
        return (<div onClick={this.onLinkEdit}>
                <Figure content={content} title={title} description={description}/>
            </div>);
    }
}

SocialMediaEntity.propTypes = {
    entityKey: React.PropTypes.string,
    children: React.PropTypes.array
};


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
        var data = (elem.text || elem.textContent || elem.innerHTML || "" ),
            head = document.getElementsByTagName("head")[0] ||
                document.documentElement,
            script = document.createElement("script");

        script.type = "text/javascript";
        try {
            // doesn't work on ie...
            script.appendChild(document.createTextNode(data));
        } catch(e) {
            // IE has funky script nodes
            script.text = data;
        }

        head.insertBefore(script, head.firstChild);
        head.removeChild(script);
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