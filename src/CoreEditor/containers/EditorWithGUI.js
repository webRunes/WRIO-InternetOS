/* @flow */
import React from 'react';
import {VerticalNav,LeftNav} from 'base/components/ArticleNavgiation'
import CoverHeader from '../containers/CoverHeaderContainer'
import Tabs from 'base/components/Tabs'
import CoverStore from 'base/store/CoverStore'
import EditorContainer from './EditorContainer.js'
import PlusActions from 'base/Plus/actions/PlusActions'
import Login from 'base/components/widgets/Login.js';
import configureStore from '../configureStore'
// $FlowFixMe
import { Provider , connect} from 'react-redux'
import {fromList} from 'base/utils/tocnavigation';


const RightNav = () => {
    return ( <div className="right-nav">
        <a href="#" onClick={(evt) => {
            evt.preventDefault();
           // PlusActions.closeTab();
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


const store = configureStore();


let numRender = 0;
class EditorWithGUI extends React.Component {

    state: {
        toc : {
            chapters: Array<Object>
        },
        editAllowed: boolean,
        readItLater: Array<mixed>,
        tabKey: string,
        profile: Object,
    }

    constructor(props : Object) {
        super(props);
        this.state = {
            toc: {
                chapters: [],

            },
            editAllowed: false,
            readItLater: [],
            profile: {},
            tabKey: "home"
        }
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
            {!!this.props.toc && <LeftNav articleItems={fromList(this.props.toc)} /> }

            <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-6">
                <Tabs center={(<EditorContainer />)}
                      externals={[]}
                      editAllowed={this.state.editAllowed}
                      RIL={this.state.readItLater}
                      tabKey={this.state.tabKey}
                />
            </div>

        </div>
       );
    }

}

function mapStateToProps(state) {
    const {toc} = state.document;
    return {toc};
}

const EditorMapped = connect(mapStateToProps)(EditorWithGUI)


const Wrapper = () => {
    return (<Provider store={store}>
        <EditorMapped/>
        </Provider>);
}

export default Wrapper;