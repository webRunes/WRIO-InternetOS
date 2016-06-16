import React from 'react';

function makeLink (lnk) {
    if (lnk) {
        return <a href={lnk.url}>{lnk.text}</a>;
    }
    return null;
}

function makeImage (img) {
    if (img) {
        return (
            <figure>
                <img style={{width: '100%'}} src={img.src}/>
                <figcaption className="callout figure-details">
                    <h5>{img.name}</h5>
                    <p>{img.description}</p>
                </figcaption>
            </figure>
        );
    }
    return null;
}

export default function applyMentions(mentions) {
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
                A = str.replace(mention.before + (mention.link ? mention.link.text : ''), '');
            return (
                <span>
                    {before(mention.before, i)}
                    {L || I}
                    {A}
                </span>
            );
        }
        return str;
    }

    return (
        <div>
            {before(mention.before, i)}
            {Link || Image}
            {After}
        </div>
    );
}

