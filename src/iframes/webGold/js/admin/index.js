import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import Balances from './Balances'
import EthereumStats from './EthereumStats'
import EtherFeeds from './EtherFeeds'
import Donations from './Donations'
import Emissions from './Emissions'
import Invoices from './Invoices'
import Presales from './Presales'
import {requestStats} from './requests'
import {getServiceUrl} from '../../../../base/servicelocator'

const Admin = () => {
        return (
            <Router>
                    <div>
                            <div id="sidebar-wrapper">
                                    <ul className="sidebar-nav">
                                            <li className="sidebar-brand">
                                                    <a href="#">WRG general status</a>
                                            </li>
                                            <li>
                                                    <a href="#/balances">Balances</a>
                                            </li>
                                            <li>
                                                    <a href="#/emissions">Emissions</a>
                                            </li>
                                            <li>
                                                    <a href="#/donations">Donations</a>
                                            </li>
                                            <li>
                                                    <a href="#/etherfeeds">Ether feeds</a>
                                            </li>
                                            <li>
                                                    <a href="#/invoices">BlockChain Invoices</a>
                                            </li>
                                            <li>
                                                    <a href="#/presales">WRG Presales</a>
                                            </li>
                                    </ul>
                            </div>

                            <div id="main" className="container-fluid" style={{width:60+'%'}}>
                                    <Route exact path="/" component={EthereumStats} />
                                    <Route path="/balances" component={Balances}/>
                                    <Route path="/etherfeeds" component={EtherFeeds}/>
                                    <Route path="/donations" component={Donations}/>
                                    <Route path="/emissions" component={Emissions}/>
                                    <Route path="/invoices" component={Invoices}/>
                                    <Route path="/presales" component={Presales}/>
                            </div>
                    </div>
            </Router>
        )
};

class MainPage extends React.Component {
        constructor (props) {
                super(props);
                this.state = {loading:true,error:false}
        }
        async componentDidMount() {
              try {
                      await requestStats();
                      this.setState({loading:false});
              }  catch (e) {
                      this.setState({error: true});
              }
        }
        render () {
                if (this.state.error) {
                        return (<h1>You're not allowed to see this page, please
                                <iframe height="30" frameBorder="0" src={getServiceUrl('login')+'/buttons/twitter'}/></h1>);

                };
                if (this.state.loading) {
                        return (<img src="https://default.wrioos.com/img/loading.gif"/>);
                }
                return <Admin/>
        }
}

ReactDOM.render(<MainPage/>, document.getElementById('main'));


