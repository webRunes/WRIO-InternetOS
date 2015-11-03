'use strict';
var React = require('react'),
    Reflux = require('reflux'),
    Login = require('passport-signin'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme,
    CreateBreadcrumb = require('./CreateBreadcrumb'),
    CreateTitter = require('titter-wrio-app'),
    Center = require('./Center'),
    store = require('../store/center'),
    classNames = require('classnames'),
    ActionMenu = require('plus/js/actions/menu'),
    StoreMenu = require('plus/js/stores/menu'),
    UrlMixin = require('../mixins/UrlMixin');

class CreateDomCenter extends React.Component{

    constructor(props){
        super(props);
        this.UrlMixin = UrlMixin;
        this.editIframeStyles = {
            width: '100%',
            height: '700px',
            border: 'none'
        };
        var locationSearch = this.UrlMixin.getUrlParams();
        this.state = {
            editMode: false,
            content: {
                type: (locationSearch) ? locationSearch : 'article'
            },
            active: false
        };
        this.onShowSidebar = this.onShowSidebar.bind(this);
    }

    componentDidMount(){
        this.unsubscribe = store.listen(this.onStateChange);
        this.unsubscribe1 = StoreMenu.listenTo(ActionMenu.showSidebar, this.onShowSidebar);
    }

    onShowSidebar(data) {
        this.setState({
            active: data
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe1();
    }

    onStatusChange (x) {
        this.setState({
            content: x
        });
    }

    switchToReadMode () {
        this.setState({
            editMode: false
        });
    }

    switchToEditMode (){
        this.setState({
            editMode: true
        });
    }

    render (){
        var type = this.UrlMixin.searchToObject().list,
            condition = type === 'Cover' || this.state.content.type === 'external' || typeof type !== 'undefined',
            className = classNames({
                'col-xs-12 col-sm-5 col-md-7 content content-offcanvas' : true,
                'active': this.state.active
            });

        return (
            <div className={className} id="centerWrp">
                <div className="margin">
                    <Login importUrl={importUrl} theme={theme} />
                    <CreateBreadcrumb
                        converter={this.props.converter}
                        editMode={ this.state.editMode }
                        onReadClick={ this.switchToReadMode }
                        onEditClick={ this.switchToEditMode } />
                    { this.state.editMode ? <iframe src={'http://core.wrioos.com/?edit=' + location.href} style={ this.editIframeStyles }/> : null }
                    <Center data={this.props.data} content={this.state.content} type={type} />
                    <div style={{display: condition ? 'none' : 'block'}}>
                        <CreateTitter scripts={this.props.data} />
                    </div>
                </div>
            </div>
        );
    }
}

CreateDomCenter.propTypes = {
    data: React.PropTypes.array.isRequired,
    converter: React.PropTypes.object.isRequired
};

module.exports = CreateDomCenter;