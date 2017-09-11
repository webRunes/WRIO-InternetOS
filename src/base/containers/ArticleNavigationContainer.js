
import {connect} from 'react-redux'
import {VerticalNav as VerticalNavComponent,LeftNav as LeftNavComponent} from 'base/components/ArticleNavigation'
import * as actions from 'base/actions/actions'

function mapStateToProps(state) {
    return {
        articleItems: state.document.toc.chapters
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onNavigateArticleHash: (hash) => dispatch(actions.navigateArticleHash(hash))
    }
}

export const VerticalNav =  connect(mapStateToProps,mapDispatchToProps)(VerticalNavComponent);
export const LeftNav =  connect(mapStateToProps,mapDispatchToProps)(LeftNavComponent);
