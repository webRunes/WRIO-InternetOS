import { connect } from 'react-redux'
import CoverHeader from 'base/components/CoverHeader'

function mapStateToProps(state) {
        return {
           covers: state.header.covers,
           images: state.header.images,
           currentCover: state.header.selected
        }
}

function mapDispatchToProps(dispatch) {
    return {
        onCoverChanged: current => {
            CoverActions.selectCover(current)
        }
    }
}

    
export default connect(mapStateToProps,mapDispatchToProps)(CoverHeader);
