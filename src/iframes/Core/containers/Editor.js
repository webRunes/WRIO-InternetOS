/* @flow */
import React from 'react';
// $FlowFixMe
import {VerticalNav,LeftNav} from '../../../base/components/ArticleNavgiation'
import CoverHeader from '../../../base/components/CoverHeader'
import Tabs from '../../../base/components/Tabs'
import CoverStore from '../../../base/store/CoverStore'
import AsyncApp from './AsyncApp.js'


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

let numRender = 0;

export default class EditorMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toc: {
                chapters: [],

            },
            editAllowed: false,
            readItLater: [],
        }
    }



    componentDidMount() {
        // hide preloader
        const preloader = document.getElementById('preloader');
        preloader ? preloader.style.display = 'none' : true;
        WrioDocumentActions.loadDocumentWithData.trigger(this.props.document,window.location.href);
    }

    render () {
    

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
                <Tabs center={(<AsyncApp />)}
                      externals={[]}
                      editAllowed={this.state.editAllowed}
                      RIL={this.state.readItLater}
                      tabKey={this.state.tabKey}
                />
            </div>


        </div>);
    }

}
