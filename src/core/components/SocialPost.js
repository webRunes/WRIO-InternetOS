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
            <figure className="col-xs-12 col-md-6">
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
                if (result.body.provider_name == 'Twitter') {
                    setTimeout(() => window.twttr.widgets.load(),1000); // hack to reload twitter iframes
                }
                this.setState({html:result.body.html});
            });
        }
    }

    componentDidMount() {
       this.downloadEmebed();

    }

    render () {
        var htmlData = {__html: this.state.html};
        const content = <div dangerouslySetInnerHTML={htmlData} />;
        const title = this.props.data.data.sharedContent.headline;
        const description= this.props.data.data.sharedContent.about;
        return <Figure content={content} title={title} description={description}/>;
    }
}

SocialPost.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = SocialPost;
