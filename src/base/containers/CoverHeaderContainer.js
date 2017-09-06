import Reflux from 'reflux'
import CoverBlock from '../components/CoverHeader'
import CoverActions from '../actions/CoverActions'
import CoverStore from '../store/CoverStore'

type CoverContainerProps =  {
}

class CoverContainer extends Reflux.Component {
    props: CoverContainerProps;

    constructor(props : CoverContainerProps) {
        super (props);
        this.stores = [CoverStore];
    }

    render () {
        if (!this.state) {
            return null;
        }
        return <CoverBlock covers={this.state.covers}
                           images={this.state.images}
                           currentCover={this.state.selected}
                           onCoverChanged={current => {
                                CoverActions.selectCover(current)
                           }}
        />
    }
}

export default CoverContainer;