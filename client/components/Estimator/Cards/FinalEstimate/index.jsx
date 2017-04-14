import React, { Component } from 'react';
import { Button, Card, CardBlock, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import domtoimage from 'dom-to-image';
import styles from './styles.scss';

export default class FinalEstimate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.saveAsPdf = this.saveAsPdf.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  filter(node) {
    return (node.tagName !== 'BUTTON'
    && node.id !== 'screenShot' && node.className !== 'radarChartPart');
  }
  saveAsPdf() {
    const root = document.getElementById('screen');
    domtoimage.toPng(root, { filter: this.filter })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;

        const doc = new jsPDF('p', 'mm', [(root.clientHeight * 25.4) / 90, 300]);

        doc.addImage(img, 'PNG', 2, 2);
        doc.save('a4.pdf');
      });
  }

  render() {
    return (
      <Card className={styles.final}>
        <CardBlock className={styles.final__wrapper}>
          <div className={styles.final__result}>
            <div className={styles.final__result_info}>Total hours: {this.props.hours}</div>
          </div>
          <div className={styles.final__result}>
            <div className={styles.final__result_info}>Total sum: {this.props.hours * this.props.rate}$</div>
          </div>
          <ButtonDropdown
            isOpen={this.state.dropdownOpen}
            toggle={this.toggle}
          >
            <DropdownToggle
              className={styles.final__result_info}
              caret
              color="danger"
            >
              Report
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Type</DropdownItem>
              <DropdownItem onClick={this.saveAsPdf}>Generate PDF</DropdownItem>
              <DropdownItem>Generate CSV</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </CardBlock>
      </Card>
    );
  }
}
