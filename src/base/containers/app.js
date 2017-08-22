/* @flow */
import React from 'react';
// $FlowFixMe
import Reflux from 'reflux'
import {CreateDomCenter, TransactionsCenter, PresaleCenter, ChessCenter, CoreCreateCenter, WebGoldCenter} from './CreateDomCenter';
import {VerticalNav,LeftNav} from '../components/ArticleNavgiation'
import {getServiceUrl,getDomain} from '../servicelocator.js';
import LdJsonDocument from '../jsonld/LdJsonDocument';
import UrlMixin from '../mixins/UrlMixin.js';
import WrioDocumentActions from '../actions/WrioDocument.js';
import WrioDocumentStore from '../store/WrioDocument.js';
import PlusStore from '../Plus/stores/PlusStore'
import PlusActions from '../Plus/actions/PlusActions'
import Login from '../components/widgets/Login.js';
import CoverHeader from '../components/CoverHeader'
import Tabs from '../components/Tabs'
import CoverStore from '../store/CoverStore'

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
        margin: "20px 110px",
        position: "absolute",
        right: 0,
        zIndex: 120
    };
    return (<div style={loginStyle}>
        {!!profile && <Login profile={profile}/>}
    </div>);
}

let numRender = 0;
class Main extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores = [WrioDocumentStore,PlusStore];
    }

    propTypes: {
        document : LdJsonDocument
    };

    componentDidMount() {
        // hide preloader
        const preloader = document.getElementById('preloader');
        preloader ? preloader.style.display = 'none' : true;
        WrioDocumentActions.loadDocumentWithData.trigger(this.props.document,window.location.href);
    }

    renderWithCenter(center) {
        let data: LdJsonDocument = this.props.document;
        let externals = this.state.lists.filter(list => list.type == 'external');

        console.log(`RENDERING state!!!!!!!!!!! ${numRender++}`, this.state);

        return ( <div>

            <VerticalNav vertical={true}
                         articleItems={this.state.toc.chapters}
                         showUp={false}
            />
            <LoginBar profile={this.state.profile}/>
            <RightNav />
            <CoverHeader />
            <LeftNav articleItems={this.state.toc.chapters} />

            <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-6">
                <Tabs center={center}
                      externals={externals}
                      editAllowed={this.state.editAllowed}
                      RIL={this.state.readItLater}
                      tabKey={this.state.tabKey}
                />
            </div>


        </div>);
    }

    render() {
        const url : string = this.state.url;
        const urlDecoded = UrlMixin.searchToObject(url);

        if (urlDecoded.start && (window.location.origin === getServiceUrl('chess'))) {
            return this.renderWithCenter(<ChessCenter  data={this.props.document}
                                                       url={url}
                                                       profile={this.state.profile}
                                                       wrioID={this.state.wrioID}
            />);
        }

        if (urlDecoded.transactions) {
            return this.renderWithCenter(<TransactionsCenter  data={this.props.document}
                                                              url={url}
                                                              profile={this.state.profile}
                                                              wrioID={this.state.wrioID}
            />);
        }

        if (urlDecoded.presale && (window.location.hostname.startsWith('webgold.wrioos.') ||
            window.location.hostname.startsWith('wrioos.local'))) {
            return this.renderWithCenter(<PresaleCenter  data={this.props.document}
                                                         url={url}
                                                         profile={this.state.profile}
                                                         wrioID={this.state.wrioID}
            />);
        }

        if (urlDecoded.create) {
            return this.renderWithCenter(<CoreCreateCenter data={this.props.document}
                                                           url={url}
                                                           profile={this.state.profile}
                                                           wrioID={this.state.wrioID}
            />);
        }

        if (urlDecoded.add_funds) {
            return this.renderWithCenter(<WebGoldCenter data={this.props.document}
                                                        url={url}
                                                        profile={this.state.profile}
                                                        wrioID={this.state.wrioID}
            />);
        }


        return this.renderWithCenter(<CreateDomCenter data={this.props.document}
                                                      url={url}
                                                      profile={this.state.profile}
                                                      wrioID={this.state.wrioID}
        />);
    }



}


let doc = new LdJsonDocument(document.getElementsByTagName('script'));

export  default  class App extends React.Component {
    render () {
        return <Main document={doc}/>
    }
}
