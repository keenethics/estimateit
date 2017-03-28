import React from 'react';
import domtoimage from 'dom-to-image';

import './style/finalEstimate.css';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props)
    
    this.saveAsPdf = this.saveAsPdf.bind(this);
  }
  
  saveAsPdf() {
    domtoimage.toPng(document.getElementsByClassName('wrapper')[0])
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        var doc = new jsPDF();
        doc.addImage(img, 'PNG', 10, 10)
        doc.save('a4.pdf');
        
    })

  }
  
  render() {
    return (
      <div className="finalEstimate">
       <div className="estimateResult">
          <div className="estimateTitle">Total hours:</div>
          <div>{this.props.hours}</div>
       </div>
        <div className="estimateResult">
           <div className="estimateTitle">Total sum:</div>
           <div>{this.props.hours * this.props.rate}</div>
        </div>
        
        <div><button onClick={this.saveAsPdf}>Generate PDF</button></div>
      </div>
    )
  }
}