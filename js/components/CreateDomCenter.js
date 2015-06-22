var React = require('react'),
    Reflux = require('reflux'),
    CreateTitter = require('titter-wrio-app'),
    Login = require('passport-signin'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme,
    CreateBreadcrumb = require('./CreateBreadcrumb'),
    CreateItemList = require('./CreateItemList'),
    CreateArticleList = require('./CreateArticleList'),
    store = require('../storages/CreateDomCenter');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        converter: React.PropTypes.object.isRequired
    },
    mixins: [Reflux.listenTo(store, "onStatusChange")],
    onStatusChange: function (type) {
        this.setState({
            content: type,
            editMode: this.state.editMode
        });
    },
    getInitialState: function() {
        return {
            content: 'article',
            editMode: false
        };
    },
    switchToReadMode: function() {
        this.setState({
            editMode: false
        });
    },
    switchToEditMode: function() {
        this.setState({
            editMode: true
        });
    },
    editIframeStyles: {
        width: '100%',
        height: '600px',
        border: 'none'
    },
    content: function () {
        var c = this.state.content;
        if (c === 'cover') {
            return <h1>COVER WILL BE HERE</h1>;//TODO
        } else if (c === 'article') {
            return <CreateArticleList converter={this.props.converter} data={this.props.data} editMode={this.state.editMode} />;
        } else {
            return <h1>EXTERNAL CONTENT WILL BE HERE from {c}</h1>;//TODO
        }
    },
    render: function () {
        return (
            <div className="content col-xs-12 col-sm-5 col-md-7" id="centerWrp">
                <div className="margin">
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        onReadClick={ this.switchToReadMode }
                        onEditClick={ this.switchToEditMode } />
                    { this.state.editMode ? <iframe src={'http://core.wrioos.com/?edit=' + location.href} style={ this.editIframeStyles }/>
                        : <CreateItemList converter={this.props.converter} /> }
                    {this.content()}
                    <CreateTitter scripts={this.props.data} />
                </div>
            </div>
        );
    }
});
