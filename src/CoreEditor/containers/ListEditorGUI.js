/* @flow */
import React from 'react';
import {
  VerticalNav,
  LeftNav
} from '../containers/ArticleNavigationContainer';
import CoverHeader from './CoverHeaderContainer';
import Tabs from 'base/components/Tabs';
import EditorContainer from './EditorContainer.js';
import PlusActions from 'base/Plus/actions/PlusActions';
import Login from 'base/components/widgets/Login.js';
// $FlowFixMe
import { Provider, connect } from 'react-redux';
import { fromList } from 'base/utils/tocnavigation';
import * as Actions from 'base/actions/actions';
import PostSettings from '../containers/Postsettings.js';


const RightNav = () => {
  return (
    <div className="right-nav">
      <a
        href="#"
        onClick={evt => {
          evt.preventDefault();
          // PlusActions.closeTab();
        }}
        className="btn btn-just-icon btn-simple btn-default btn-sm btn-flat pull-right"
      >
        <i className="material-icons dp_big">highlight_off</i>
      </a>
      <a
        href="#"
        className="hidden btn btn-just-icon btn-simple btn-default btn-lg"
      >
        <i className="material-icons dp_big">bookmark</i>
      </a>
      <a
        href="#"
        className="hidden btn btn-just-icon btn-simple btn-default btn-lg"
      >
        <i className="material-icons dp_big">share</i>
      </a>
    </div>
  );
};

const LoginBar = ({ profile, readItLater }) => {
  const loginStyle = {
    margin: "1em 4.2em",
    position: "absolute",
    right: 0,
    zIndex: 120
  };
  return (
    <div style={loginStyle}>{!!profile && <Login profile={profile} readItLater={readItLater} />}</div>
  );
};


class EditorWithGUI extends React.Component {
  state: {
    toc: {
      chapters: Array<Object>
    },
    editAllowed: boolean,
    readItLater: Array<mixed>,
    tabKey: string,
    profile: Object
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      toc: {
        chapters: []
      },
      editAllowed: false,
      readItLater: [],
      profile: {},
      tabKey: "home"
    };

    this.props.dispatch({type:"NEW_LIST"});

    document.getElementById('loadingInd').setAttribute('style', 'display:none;');
  }

  render() {
    return (
      <div>
        <VerticalNav vertical={true} showUp={false} />
        <LoginBar profile={this.state.profile} readItLater={this.state.readItLater}/>
        <RightNav />
        <CoverHeader />
        {!!this.props.toc && <LeftNav />}

        <div className="main col-xs-12 col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-0 col-lg-6">
          <Tabs
              center={<EditorContainer />}
            editMode
            externals={[]}
            forceExternals
            editAllowed={this.props.editAllowed}
            //RIL={this.state.readItLater}
            tabKey={this.props.tabKey}
            tabClick={tab => this.props.dispatch(Actions.tabClick(tab))}
          />
        </div>
        <div className="col-xs-12 card">
          <PostSettings />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("EDITORDOC", state.editorDocument.toc);
  return{
    url: state.document.url,
    editAllowed: state.document.editAllowed,
    toc: {chapters: []},
    lists: state.document.lists,
    tabKey: state.document.tabKey
  }
};
const EditorMapped = connect(mapStateToProps)(EditorWithGUI);

export default EditorMapped;
