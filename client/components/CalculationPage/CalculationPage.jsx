import React from 'react';
import DiscreteVector from 'discrete-vector';

import Calculation from './Calculation.jsx';
import FinalEstimate from './FinalEstaimate.jsx';
import Contacts from './Contacts.jsx';
import LineChart from './LineChart.jsx';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props)
    this.T = []
    this.tasks = [[5,10], [8, 16], [30, 40], [1, 3]];
    
    this.embodiment = this.embodiment.bind(this);
    this.transformToVector = this.transformToVector.bind(this);
  }
  
  embodiment(a, b) {
    return a.reduce((prev, item, i) => prev + item[b[i]], 0);
  }
  
  transformToVector() {
    const vector = new DiscreteVector(this.tasks);
    this.T = Array(vector.combinations).fill().map((prev, item) => this.embodiment(this.tasks, vector.next())).sort((a, b) => a - b);
  }
  
  render() {
    this.transformToVector();
    console.log(this.T);
    return (
      <div>
        <LineChart vector={this.T}/>
        <Calculation />
        <FinalEstimate />
        <Contacts />
      </div>
    )
  }
  
}