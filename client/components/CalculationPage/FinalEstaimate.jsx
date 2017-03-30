import React from 'react';

import './style/finalEstimate.css';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className="finalEstimate">
       <div className="estimateResult">
          <div className="estimateTitle">Total hours:</div>
          <div>H</div>
       </div>
        <div className="estimateResult">
           <div className="estimateTitle">Total sum:</div>
           <div>H*Rate</div>
        </div>
        
        <div><button>Generate PDF</button></div>
      </div>
    )
  }
}