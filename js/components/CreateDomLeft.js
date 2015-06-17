var React = require('react'),
    Plus = require('plus'),
    themeImportUrl = require('../global').themeImportUrl;

var CreateDomLeft = React.createClass({
    render: function() {
        return (
            <div className="col-xs-12 col-sm-3 col-md-2">
                <div className="navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu">
                    <div className="navbar-header tooltip-demo" id="topMenu">
                        <ul className="nav menu pull-right">
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Call IA">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-comment" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Logout">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-lock" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Full screen">
                                <a className="btn btn-link btn-sm" href="#">
                                    <span className="glyphicon glyphicon-fullscreen" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Open/close menu">
                                <a data-target=".navbar-collapse" data-toggle="collapse" className="btn btn-link btn-sm visible-xs collapsed" href="#">
                                    <span className="glyphicon glyphicon-align-justify" />
                                </a>
                            </li>
                            <li title="" data-placement="bottom" data-toggle="tooltip" data-original-title="Show/hide the sidebar">
                                <a data-toggle="offcanvas" id="myoffcanvas" className="btn btn-link btn-sm visible-xs" href="#">
                                    <span className="glyphicon glyphicon-transfer" />
                                </a>
                            </li>
                        </ul>
                        <a title="" data-placement="right" data-toggle="tooltip" className="navbar-brand" href="webrunes-contact.htm" data-original-title="Contact us">&nbsp;</a>
                    </div>
                    <Plus themeImportUrl={themeImportUrl} />
                </div>
            </div>
        );
    }
});

module.exports = CreateDomLeft;
