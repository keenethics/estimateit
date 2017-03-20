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
    
    this.onFieldChange = this.onFieldChange.bind(this);
  }
  
  onFieldChange(e) {
    this.estimateFields[e.target.name] = +e.target.value;
    this.props.onDataChnage(this.estimateFields);
  }
  
  componentDidMount() {
    this.props.onDataChnage(this.estimateFields)
  }
  
  render() {
    return (
      <div className="estimateOptions">
        <div>Rate USD</div>
        <div className="estimateOption">
          <span>QA</span>
          <input 
            name="qa"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
        </div>
        <div className="estimateOption">
          <span>PM</span>
          <input 
            name="pm"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
        </div>
        <div className="estimateOption">
          <span>Bug Fixes</span>
          <input 
            name="bugFixes"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
        </div>
        <div className="estimateOption">
          <span>Risks</span>
          <input 
            name="risks"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="10"/>
        </div>
        <div className="estimateOption">
          <span>Probability of project <br /> completing in time</span>
          <input 
            name="completing"
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            onChange={this.onFieldChange}
            defaultValue="90"/>
        </div>
      </div>
    )
  }
  
}