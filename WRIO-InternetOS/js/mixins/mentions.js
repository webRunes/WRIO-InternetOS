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
	                return <img src={img.src} />;
	            }
	            return null;
	        },
	        Link = link(m.link),
	        Image = image(m.image),
	        After = m.after;
		var before = function(str, i) {
			i--;
			m = mentions[i];
            if (m) {
	            var L = link(m.link),
	            	I = image(m.image),
	                A = str.replace(m.before + (m.link.text || ''), '');
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
