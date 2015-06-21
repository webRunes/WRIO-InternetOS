var React = require('react'),
    CreateTitter = require('titter-wrio-app'),
    Login = require('passport-signin'),
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
    getInitialState: function() {
        return {
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
    render: function() {
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
                    <CreateArticleList converter={this.props.converter} data={this.props.data} editMode={this.state.editMode} />
                    <CreateTitter scripts={this.props.data} />
                </div>
            </div>
        );
    }
});
