export function applyMentions(mentions) {
  var i = mentions.length - 1,
    m = mentions[i],
    link = lnk => {
      if (lnk) {
        return "<a href=" + lnk.url + ">" + lnk.text + "</a>";
      }
      return "";
    },
    Link = link(m.link),
    After = m.after,
    before = (str, i) => {
      i--;
      m = mentions[i];
      if (m) {
        var L = link(m.link),
          A = str.replace(m.before + (m.link ? m.link.text : ""), "");
        return before(m.before, i) + L + A;
      }
      return str;
    };
  return before(m.before, i) + Link + After;
}
