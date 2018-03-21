const
  html2list = (list, html, position) =>
    position + 18 === html.length
      ? list
      : function () {
          const
            url0 = html.indexOf('"', position),
            url1 = html.indexOf('"', url0 + 1),
            name0 = html.indexOf('>', url1 + 1),
            name1 = html.indexOf('<', name0 + 1);

          return html2list(
            list.concat({
              url: html.substring(url0 + 1, url1),
              name: html.substring(name0 + 1, name1)
            }),
            html,
            name1
          );
        }();

module.exports = html =>
  html2list([], html, 0);
