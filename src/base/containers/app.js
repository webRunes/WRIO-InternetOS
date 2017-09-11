/* @flow */
import React from 'react';
// $FlowFixMe
import {CreateDomCenter, TransactionsCenter, PresaleCenter, ChessCenter, WebGoldCenter} from './CreateDomCenter';
import {VerticalNav,LeftNav} from 'base/containers/ArticleNavigationContainer'
import {getServiceUrl,getDomain} from '../servicelocator.js';
import LdJsonDocument from '../jsonld/LdJsonDocument';
import UrlMixin from '../mixins/UrlMixin.js';
import PlusActions from '../Plus/actions/PlusActions'
import Login from '../components/widgets/Login.js';
import CoverHeader from '../containers/CoverHeaderContainer'
import Tabs from '../components/Tabs'
import { Provider , connect} from 'react-redux'
import {loadDocumentWithData} from 'base/actions/actions'
import configureStore from '../configureStore'

const RightNav = () => {
    return ( <div className="right-nav">
        <a href="#" onClick={(evt) => {
            evt.preventDefault();
            PlusActions.closeTab();
        }} className="btn btn-just-icon btn-simple btn-default btn-sm btn-flat pull-right">
            <i className="material-icons dp_big">highlight_off</i></a>
        <a href="#" className="hidden btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">bookmark</i></a>
        <a href="#" className="hidden btn btn-just-icon btn-simple btn-default btn-lg"><i className="material-icons dp_big">share</i></a>

    </div>);
};

const LoginBar = ({profile}) => {
    const loginStyle = {
        margin: "1em 4.2em",
        position: "absolute",
        right: 0,
        zIndex: 120
    };
    return (<div style={loginStyle}>
        {!!profile && <Login profile={profile}/>}
    </div>);
}


class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    propTypes: {
        document : LdJsonDocument
    };

    componentDidMount() {
        // hide preloader
        const preloader = document.getElementById('preloader');
        preloader ? preloader.style.display = 'none' : true;
        this.props.dispatch(loadDocumentWithData(this.props.document,window.location.href));
    }

    renderWithCenter(center) {
        let data: LdJsonDocument = this.props.document;
        let externals = this.props.lists.filter(list => list.type == 'external');


        return ( <div>

            <VerticalNav vertical={true}
                         showUp={false}
            />
            <LoginBar profile={this.props.profile}/>
            <RightNav />
            <CoverHeader />
            <LeftNav />

            <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-6">
                <Tabs center={center}
                      externals={externals}
                      editAllowed={this.props.editAllowed}
                      RIL={this.props.readItLater}
                      tabKey={this.props.tabKey}
                />
            </div>


        </div>);
    }

    render() {
        const url : string = this.props.url;
        const urlDecoded = UrlMixin.searchToObject(url);

        if (urlDecoded.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter  data={this.props.document}
                                                       url={url}
                                                       profile={this.props.profile}
                                                       wrioID={this.props.wrioID}
            />);
        }

        if (urlDecoded.transactions) {
            return this.renderWithCenter(<TransactionsCenter  data={this.props.document}
                                                              url={url}
                                                              profile={this.props.profile}
                                                              wrioID={this.props.wrioID}
            />);
        }

        if (urlDecoded.presale && (window.location.hostname.startsWith('webgold.wrioos.') ||
            window.location.hostname.startsWith('wrioos.local'))) {
            return this.renderWithCenter(<PresaleCenter  data={this.props.document}
                                                         url={url}
                                                         profile={this.props.profile}
                                                         wrioID={this.props.wrioID}
            />);
        }

        if (urlDecoded.add_funds) {
            return this.renderWithCenter(<WebGoldCenter data={this.props.document}
                                                        url={url}
                                                        profile={this.props.profile}
                                                        wrioID={this.props.wrioID}
            />);
        }


        return this.renderWithCenter(<CreateDomCenter data={this.props.document}
                                                      url={url}
                                                      profile={this.props.profile}
                                                      wrioID={this.props.wrioID}
        />);
    }



}

const mapStateToProps = state => (
    {
        url: state.document.url,
        profile: state.login.profile,
        wrioID: state.login.wrioID,
        editAllowed: state.document.editAllowed,
        toc: state.document.toc,
        lists: state.document.lists,

    }
)

const MainMapped = connect(mapStateToProps)(Main)

let doc = new LdJsonDocument(document.getElementsByTagName('script'));
const store = configureStore();

export default class App extends React.Component {
    render () {
        return (<Provider store={store}>
                <MainMapped document={doc}/>
            </Provider>
            ) 
    }
}

