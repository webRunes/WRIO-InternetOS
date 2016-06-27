import React from 'react';

function makeLink (lnk) {

    if (lnk) {
        var ext = "";
        var linkUrl = lnk.url;
        var target,color;
        if (lnk.external) {
            ext = (<sup><span className="glyphicon glyphicon-new-window"></span>{lnk.extra}</sup>);
            target="_blank";
            linkUrl = lnk.externalUrl;

        } else {
            if (lnk.hash) {
                color='coming-soon';
            }
        }
        return (<span>
            <a href={linkUrl} target={target} className={color}>{lnk.text}</a>
            {ext}
            </span>);
    }
    return null;
}

function makeImage (img) {
    if (img) {
        var figcaption;
        if (img.name) {
            figcaption = (
                <figcaption className="callout figure-details">
                    <h5>{img.name}</h5>
                    <p>{img.description}</p>
                </figcaption>);
        }
        return (
            <figure>
                <img style={{width: '100%'}} src={img.src}/>
                {figcaption}
            </figure>
        );
    }
    return null;
}

function makeSocialMediaPosting (post) {
    if (post) {
        return (<div className="pixels-photo">
            <p>
                <img src="https://drscdn.500px.org/photo/98284235/m%3D900/9fcefab43363c25fd985bd06402a82c8" alt="D E T E R M I N A T I O N by David Ruiz Luna | 500px.com" />
            </p>
                <a href="https://500px.com/photo/98284235/d-e-t-e-r-m-i-n-a-t-i-o-n-by-david-ruiz-luna" alt="D E T E R M I N A T I O N by David Ruiz Luna | 500px.com"></a>

        </div>);
    }
}

/*

takes as input array of mention objects, converts them to the react code

each mention object contains

{
    before: "before text"
    after: "after text"
    link: { ... link object ...}
}

*/
export default function applyMentions(mentions,span) {
    var i = mentions.length - 1,
        mention = mentions[i],
        Link = makeLink(mention.link),
        Image = makeImage(mention.image),
        After = mention.after;

    function before (str, i) {
        i--;
        mention = mentions[i];
        if (mention) {

            var L = makeLink(mention.link),
                I = makeImage(mention.image),
                S = makeImage(mention.social),
                A = str.replace(mention.before + (mention.link ? mention.link.text : ''), '');
            return (
                <span>
                    {before(mention.before, i)}
                    {L || I || S}
                    {A}
                </span>
            );
        }
        return str;
    }

    return (
        <span>
            {before(mention.before, i)}
            {Link || Image}
            {After}
        </span>
    );


}

