import React from 'react';

import Calculation from './Calculation.jsx';
import FinalEstimate from './FinalEstaimate.jsx';
import Contacts from './Contacts.jsx';
import LineChart from './LineChart.jsx';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div>
        <LineChart />
        <Calculation />
        <FinalEstimate />
        <Contacts />
      </div>
    )
  }
  
}