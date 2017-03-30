import React from 'react';
import domtoimage from 'dom-to-image';

import './style/finalEstimate.css';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props)

    this.saveAsPdf = this.saveAsPdf.bind(this);
  }

  saveAsPdf() {
    debugger;
    const root = document.getElementById('root');
    domtoimage.toPng(root)
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;

        var doc = new jsPDF('p', 'mm', [(root.clientHeight * 25.4) / 90, 300]);

        doc.addImage(img, 'PNG', 2, 2);
        doc.save('a4.pdf');

    })
    // const doc = new jsPDF('p', 'pt', 'a4');
    // doc.addHTML(document.getElementById('root'), {pagesplit: true}, () => {
    //   doc.save('a4.pdf');
    // });

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

        <div><button onClick={this.saveAsPdf}>Generate PDF</button></div>
      </div>
    )
  }
}
