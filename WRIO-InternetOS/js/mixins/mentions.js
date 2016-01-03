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
	        Link = link(m.link),
	        After = m.after,
	        before = function (str, x) {
	            x -= 1;
	            m = mentions[x];
	            if (m) {
		            var L = link(m.link),
		                A = str.replace(m.before + m.link.text, '');
	                return (
	                    <span>
	                        {before(m.before, x)}
	                        {L}
	                        {A}
	                    </span>
	                );
	            }
	            return str;
	        };
        return (
            <div>
                {before(m.before, i)}
                {Link}
                {After}
            </div>
        );
    }
};
