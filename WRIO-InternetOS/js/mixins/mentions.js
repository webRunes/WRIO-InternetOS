var React = require('react');

module.exports = {
	applyMentions: function (mentions) {
        var i = 0,
            m = mentions[i],
            link = function (lnk) {
                if (lnk) {
                    return <a href={lnk.url}>{lnk.text}</a>;
                }
                return null;
            },
            Link = link(m.link),
            After = m.after,
            intersection = function (s1, s2) {
                s2 = s2 || '';
                var a1 = s1.split('').reverse(),
                    a2 = s2.split(''),
                    i = 0;
                while (a1[i] && a2[i] && (a1[i] === a2[i])) {
                    i += 1;
                }
                return s2.substr(0, i);
            },
            before = function (str, i) {
                i += 1;
                m = mentions[i];
                if (m) {
                var Link = link(m.link),
                    After = intersection(str, m.after);
                    return (
                        <div>
                            {before(m.before)},
                            {Link},
                            {After}
                        </div>
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
