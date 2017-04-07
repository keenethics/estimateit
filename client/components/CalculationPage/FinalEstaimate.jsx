import React from 'react';
import domtoimage from 'dom-to-image';

import './style/finalEstimate.css';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props)

    this.saveAsPdf = this.saveAsPdf.bind(this);
  }
  
  filter(node) {
    return (node.tagName !== 'BUTTON' && node.className !== 'header--addTaskForm');
  }

  saveAsPdf() {
    const root = document.getElementById('root');
    domtoimage.toPng(root, {filter: this.filter})
    .then(function (dataUrl) {
        const img = new Image();
        img.src = dataUrl;

        const doc = new jsPDF('p', 'mm', [(root.clientHeight * 25.4) / 90, 300]);

        doc.addImage(img, 'PNG', 2, 2);
        doc.save('a4.pdf');

    })
  }

  render() {
    return (
      <div className="finalEstimate">
       <div className="estimateResult">
          <div className="estimateTitle">Total hours: {this.props.hours}</div>
       </div>
        <div className="estimateResult">
           <div className="estimateTitle">Total sum: {this.props.hours * this.props.rate}$</div>
        </div>

        <div className="estimateResult"><button onClick={this.saveAsPdf}>Generate PDF</button></div>
      </div>
    )
  }
}
