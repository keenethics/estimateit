import React from 'react';

export default class EstimateOptions extends React.Component{
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className="estimateOptions">
        <div>Rate USD</div>
        <div className="estimateOption">
          <span>QA</span><input type="range" />
        </div>
        <div className="estimateOption">
          <span>PM</span><input type="range" />
        </div>
        <div className="estimateOption">
          <span>Bug Fixes</span><input type="range" />
        </div>
        <div className="estimateOption">
          <span>Risks</span><input type="range" />
        </div>
        <div className="estimateOption">
          <span>Probability of project <br /> completing in time</span><input type="range" />
        </div>
      </div>
    )
  }
  
}