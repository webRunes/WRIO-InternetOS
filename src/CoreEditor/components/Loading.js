/**
 * Created by michbil on 18.07.17.
 */
import React, { Component } from 'react';
import LoadingComp from 'base/components/misc/Loading';

export class Loading extends Component {
  render() {
    return <LoadingComp />;
  }
}

export class LoadingError extends Component {
  render() {
    return <div className="alert alert-danger">Oops, something went wrong... Please try again</div>;
  }
}
