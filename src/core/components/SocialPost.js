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

class SocialPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            html:"<img class=\"img_loading\" src=\"https://default.wrioos.com/img/loading.gif\" />"
        };

    }

    downloadEmebed() {
        var data = this.props.data.data;
        if (data.sharedContent && data.sharedContent.url) {
            request.get('https://iframely.wrioos.com/oembed?url='+data.sharedContent.url, (err, result) => {
                if (err) {
                    console.error("Can't load embed ",data.sharedContent.url);
                }
                console.log(result.body.html);
                this.setState({html:result.body.html});
            });
        }
    }

    componentDidMount() {
       this.downloadEmebed();

    }

    render () {
        var htmlData = {__html: this.state.html};
        return <div className="col-xs-12 col-md-6" dangerouslySetInnerHTML={htmlData} />;
    }
}

SocialPost.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = SocialPost;
