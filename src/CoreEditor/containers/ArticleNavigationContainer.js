import { connect } from 'react-redux';
import {
  VerticalNav as VerticalNavComponent,
  LeftNav as LeftNavComponent,
} from 'base/components/ArticleNavigation';
import * as actions from 'base/actions/actions';

function mapStateToProps(state) {
  const { toc } = state.editorDocument;
  if (toc) {
    return {
      articleItems: toc.chapters,
    };
  } return {
    articleItems: [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNavigateArticleHash: hash => dispatch(actions.navigateArticleHash(hash)),
  };
}

export const VerticalNav = connect(mapStateToProps, mapDispatchToProps)(VerticalNavComponent);
export const LeftNav = connect(mapStateToProps, mapDispatchToProps)(LeftNavComponent);
