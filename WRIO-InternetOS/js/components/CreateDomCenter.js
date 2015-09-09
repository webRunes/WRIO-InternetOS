var React = require('react'),
    Reflux = require('reflux'),
    Login = require('passport-signin'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme,
    CreateBreadcrumb = require('./CreateBreadcrumb'),
    CreateTitter = require('titter-wrio-app'),
    Center = require('./Center'),
    store = require('../store/center'),
    UrlMixin = require('../mixins/UrlMixin');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        converter: React.PropTypes.object.isRequired
    },
    mixins: [Reflux.listenTo(store, 'onStatusChange'), UrlMixin],
    onStatusChange: function (x) {
        this.setState({
            content: x
        });
    },
    getInitialState: function() {
        var locationSearch = this.getUrlParams();
        return {
            editMode: false,
            content: {
                  type: (locationSearch) ? locationSearch : 'article'
            }
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
        height: '700px',
        border: 'none'
    },
    render: function () {
        var type = this.searchToObject().list,
            condition = type === 'Cover' || this.state.content.type === 'external' || typeof type !== 'undefined';

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
                        : null }
                    <Center data={this.props.data} content={this.state.content} type={type} />
                    <div style={{display: condition ? 'none' : 'block'}}>
                        <CreateTitter scripts={this.props.data} />
                    </div>
                </div>
            </div>
        );
    }
});
