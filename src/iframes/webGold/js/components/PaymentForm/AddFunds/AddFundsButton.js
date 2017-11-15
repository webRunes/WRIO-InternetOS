import React from "react";
/*
class AddFundsButton extends React.Component {
    render() {
        return (

            <button type="submit" className="btn btn-success" value="Pay $10">
                <span className="glyphicon glyphicon-arrow-down"></span>Add funds
            </button>

        );
    }
}*/
class AddFundsButton extends React.Component {
  render() {
    return (
      <button type="submit" className="btn btn-success">
        <span className="glyphicon glyphicon-arrow-down" />Add funds
      </button>
    );
  }
}

export default AddFundsButton;
