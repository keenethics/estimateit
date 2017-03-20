import React from 'react';
import CalculationPage from './CalculationPage/CalculationPage.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        HELLO
        <CalculationPage />
      </div>
    );
  }
}
