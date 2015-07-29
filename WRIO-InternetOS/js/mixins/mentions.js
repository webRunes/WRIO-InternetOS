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
                    j = 0;
                while (a1[j] && a2[j] && (a1[j] === a2[j])) {
                    j += 1;
                }
                return s2.substr(0, j);
            },
            before = function (str, x) {
                x += 1;
                m = mentions[x];
                if (m) {
                var L = link(m.link),
                    A = intersection(str, m.after);
                    return (
                        <div>
                            {before(m.before)},
                            {L},
                            {A}
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
