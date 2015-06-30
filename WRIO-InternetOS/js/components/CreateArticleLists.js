var React = require('react'),
    cssUrl = require('../global').cssUrl,
    theme = require('../global').theme;

var CreateArticleLists = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    render: function() {
        var o = this.props.data;
        return (
            <div id={o.name}>;
                <article>
                    <div className="media thumbnail clearfix" id="plusWrp">
                        <header className="col-xs-12">
                            <h2>
                                <a href={o.url}>{o.name}</a>
                                <sup>{o.name}</sup>
                            </h2>
                        </header>
                        <div className="col-xs-12 col-md-6 pull-right">
                            <img className="pull-left" src={cssUrl + theme + '/img/no-photo-200x200.png'} />
                            <ul className="details">
                                <li>Created: 22 Jun 2013</li>
                                <li>Rating: 244</li>
                                <li>Readers: 1,634</li>
                                <li>Access: Free</li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <p>{o.about}</p>
                            <ul className="actions">
                                <li><a href="#"><span className="glyphicon glyphicon-plus"></span>Add</a></li>
                                <li><a href="#"><span className="glyphicon glyphicon-share"></span>Share</a></li>
                            </ul>
                            <p></p>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
});

module.exports = CreateArticleLists;
