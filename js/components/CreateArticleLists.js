var React = require('react'),
    cssUrl = require('../global').cssUrl,
    theme = require('../global').theme;

// for article list in itemList view (if have url in json-ld then show aticle in listview otherwise same as article formate)
var CreateArticleLists = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        articlename: React.PropTypes.string.isRequired,
        about: React.PropTypes.string.isRequired
    },
    render: function() {
        var title = this.props.articlename.replace(/\s/g, '_');
        return (
            <div id={title}>;
                <article>
                    <div className="media thumbnail clearfix" id="plusWrp">
                        <header className="col-xs-12">
                            <h2>
                                <a href={this.props.url}>{title}</a>
                                <sup>{title}</sup>
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
                            <p>{this.props.about}</p>
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
