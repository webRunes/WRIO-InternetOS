var React = require('react');

module.exports = {
    applyMentions: function (mentions) {
        var i = mentions.length - 1,
            m = mentions[i],
            link = function (lnk) {
                if (lnk) {
                    return <a href={lnk.url}>{lnk.text}</a>;
                }
                return null;
            },
            image = function (img) {
                if (img) {
                    return (
                        <figure>
                            <img style={{width: '100%'}} src={img.src} />
                            <figcaption className="callout figure-details">
                                <h5>{img.name}</h5>
                                <p>{img.description}</p>
                            </figcaption>
                        </figure>
                    );
                }
                return null;
            },
            Link = link(m.link),
            Image = image(m.image),
            After = m.after;

        console.log("Processing mention",m);

        var before = function(str, i) {
            i--;
            m = mentions[i];
            if (m) {
                var L = link(m.link),
                    I = image(m.image),
                    A = str.replace(m.before + (m.link ? m.link.text : ''), '');
                return (
                    <span>
                        {before(m.before, i)}
                        {L || I}
                        {A}
                    </span>
                );
            }
            return str;
        };
        return (
            <div>
                {before(m.before, i)}
                {Link || Image}
                {After}
            </div>
        );
    }
};
