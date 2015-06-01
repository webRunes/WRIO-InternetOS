var React = require('react'),
    CreateTitter = require('../ext/titter.jsx'),
    Login = require('../ext/login.jsx'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme,
    CreateBreadcrumb = require('./CreateBreadcrumb'),
    CreateItemList = require('./CreateItemList'),
    CreateArticleList = require('./CreateArticleList');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        converter: React.PropTypes.object.isRequired
    },
    render: function() {
        return (
            <div className="content col-xs-12 col-sm-5 col-md-7" id="centerWrp">
                <div className="margin">
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb converter={this.props.converter} />
                    <CreateItemList converter={this.props.converter} />
                    <CreateArticleList data={this.props.data} />
                    <CreateTitter scripts={this.props.data} />
                </div>
            </div>
        );
    }
});
