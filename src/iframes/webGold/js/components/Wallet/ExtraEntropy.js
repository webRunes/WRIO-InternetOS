import React from 'react';

export default class ExtraEntropy extends React.Component {

    constructor(props) {
        super(props);
        this.s = "";
        this.state = {
            percent: 0
        };
        this.count = 0;
        this.maxcount = 128;
        this.collectionFinished = false;
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(e) {
        const t = new Date().getTime();
        const s = ""+e.pageX+":"+e.pageY+"T:"+t;
        this.s = this.s+s;
        this.count++;
        let percent = Math.floor(100*(this.count / this.maxcount));
        if (percent > 100) {
            return;
        }
        this.setState({percent:percent});

        if (!this.collectionFinished && this.count > this.maxcount) {
            this.props.cb(this.s);
            this.collectionFinished = true;
        }
    }

    render() {
        const style = {
            verticalAlign:"middle",
            textAlign:"center"
        };
        return (<div className="col-xs-12">
          <div className="margin">
            <ul className="breadcrumb"><li className="active">Random key generator</li></ul>
            <div className="alert alert-warning" style={style}>
              Please, move the mouse randomly to generate a secure key for the wallet
              <div>
                <b>Finished {this.state.percent} %</b>
              </div>
            </div>
          </div>
        </div>)
    }
}
