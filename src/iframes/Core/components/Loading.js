/**
 * Created by michbil on 18.07.17.
 */
import React,{Component} from 'react'

export class Loading extends Component {
    render () {
        return (<div>
            Loading editor <img src="https://default.wrioos.com/img/loading.gif" id="loadingInd"/>
        </div>);
    }
}

export class LoadingError extends Component {
    render () {
        return (<div className="alert alert-danger">
            Oops, something went wrong... Please try again
        </div>);
    }
}
