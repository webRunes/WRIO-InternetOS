import React from 'react';
import AddFundsButton from './AddFundsButton';
import LoginButton from './LoginButton';
import request from 'superagent';

class AddFunds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };

    }
    
    componentWillMount() {
        request
            .get('/get_user')
            .end((err, res) => {
                if (err) {
                    return console.log('Error:', err.message);
                }
                
                this.setState(res.body);
            });
    }
    
    render() {
        return (

            <div className="col-xs-12">
                 { this.state.user == null ? <div className="callout">Please login to add funds</div> : <div /> }
                <div className="form-group col-xs-12">
                    <div className="pull-right">
                        { this.state.user !== null ? 
                            <AddFundsButton /> : 
                            <LoginButton loginUrl={ this.props.loginUrl } /> }
                    </div>
                </div>
            </div>
        );
    }
}
AddFunds.propTypes = {
    loginUrl: React.PropTypes.string.isRequired
};

export default AddFunds;