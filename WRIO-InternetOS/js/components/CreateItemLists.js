var React = require('react'),
    cssUrl = require('../global').cssUrl,
    theme = require('../global').theme;

var CreateItemLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    render: function() {
        var item = this.props.data,
            title = item.name,
            image = cssUrl + theme + '/img/no-photo-200x200.png', //item.thumbnail,
            about = item.about,
            url = item.url,
            createdDate = item.datePublished;

        return (
            <a href={url}>
            <article>
              <div className="media thumbnail clearfix" >
                <header className="col-xs-12">
                  <h2>
                      {title}
                    <sup>sub_title</sup>
                  </h2>
                </header>
                <div className="col-xs-12 col-md-6 pull-right">
                  <img className="pull-left" src={image} />
                  <ul className="details">
                    <li>Created: {createdDate}</li>
                    <li>Rating: rating</li>
                    <li>Readers: readers</li>
                    <li>Access: access</li>
                  </ul>
                </div>

                <div className="col-xs-12 col-md-6">
                  <p>{about}</p>
                  <ul className="actions">
                    <li><a href="#"><span className="glyphicon glyphicon-plus"></span>Add</a></li>
                    <li><a href="#"><span className="glyphicon glyphicon-share"></span>Share</a></li>
                  </ul>
                  <p></p>
                </div>
              </div>
            </article>
          </a>
        );
    }
});

module.exports = CreateItemLists;
