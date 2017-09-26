import React from 'react';
import PropTypes from 'prop-types'
class Alert extends React.Component {
    render() {
        return (
            <div className={ 'alert alert-' + this.props.type } >
                <button onClick={ this.props.onClose } type="button" className="close">×</button>
                <span id="txtPaymentSuccess">{ this.props.message }</span>
            </div>
        );
    }    
}

Alert.defaultProps = {
    type: 'success',
    message: 'Default message'
};
Alert.propTypes = {
    type: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func
};

export default Alert;