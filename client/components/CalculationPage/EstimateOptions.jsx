import React from 'react';

export default class EstimateOptions extends React.Component{
  constructor(props) {
    super(props)
    
    this.estimateFields = {
      qa: 10,
      pm: 10,
      bugFixes: 10,
      risks: 10,
      completing: 90
    };
    
    this.rate = 25;
    this.onRateChange = this.onRateChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }
  
  onFieldChange(e) {
    this.estimateFields[e.target.name] = +e.target.value;
    this.props.onDataChange(this.estimateFields);
  }
  
  onRateChange(e) {
    this.rate = e.target.value;
    this.props.onRateChange(this.rate);
  }
  
  componentDidMount() {
    this.props.onDataChange(this.estimateFields)
  }
  
  render() {
    return (
      <div className="estimateOptions">
        <div>
          <span>Rate USD</span>
          <input 
            name="qa"
            type="number" 
            min="0" 
            step="1" 
            onChange={this.onRateChange}
            defaultValue="25"/>
        </div>
        <div className="estimateOption">
          <span>QA </span>
          <input 
            name="qa"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
            <span>{this.estimateFields.qa}</span>
        </div>
        <div className="estimateOption">
          <span>PM </span>
          <input 
            name="pm"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
            <span>{this.estimateFields.pm}</span>
        </div>
        <div className="estimateOption">
          <span>Bug Fixes </span>
          <input 
            name="bugFixes"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
            <span>{this.estimateFields.bugFixes}</span>
        </div>
        <div className="estimateOption">
          <span>Risks </span>
          <input 
            name="risks"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
            <span>{this.estimateFields.risks}</span>
        </div>
        <div className="estimateOption">
          <span>Probability of project <br />completing in time</span>
          <input 
            name="completing"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="90"/>
            <span>{this.estimateFields.completing}</span>
        </div>
      </div>
    )
  }
  
}