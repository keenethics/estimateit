import React, { Component } from 'react';
import { Card, CardBlock, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import domtoimage from 'dom-to-image';
import csv from './lib/csv';
import styles from './styles.scss';


export default class FinalEstimate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      csv: '',
    };
    this.saveAsPdf = this.saveAsPdf.bind(this);
    this.saveAsCSV = this.saveAsCSV.bind(this);
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

  saveAsCSV() {
    const columns = [{
      id: 'number',
      displayName: '#',
    }, {
      id: 'taskName',
      displayName: 'Task',
    }, {
      id: 'minimumHours',
      displayName: 'Minimum hours',
    }, {
      id: 'maximumHours',
      displayName: 'Maximum hours',
    }, {
      id: 'tasks',
      displayName: '',
    }];


    const data = [{ taskName: '0. Task', parentTaskId: null, minimumHours: '123', maximumHours: '1', id: 1492178108311, tasks: [{ taskName: 'subtask - 0', parentTaskId: null, minimumHours: '1', maximumHours: '3', id: 1492178118506, tasks: [{ taskName: 'subtask  - 1', parentTaskId: null, minimumHours: '1', maximumHours: '9', id: 1492178154397 }] }] }, { taskName: '0. Task', parentTaskId: null, minimumHours: '123', maximumHours: '1', id: 1492178108311, tasks: [{ taskName: 'subtask - 0', parentTaskId: null, minimumHours: '1', maximumHours: '3', id: 1492178118506, tasks: [{ taskName: 'subtask  - 1', parentTaskId: null, minimumHours: '1', maximumHours: '9', id: 1492178154397 }] }] }, { taskName: '1. Task', parentTaskId: null, minimumHours: '123', maximumHours: '1', id: 1492178108311, tasks: [{ taskName: 'subtask - 2', parentTaskId: null, minimumHours: '1', maximumHours: '3', id: 1492178118506, tasks: [{ taskName: 'subtask  - 3', parentTaskId: null, minimumHours: '1', maximumHours: '9', id: 1492178154397 }] }] }, { taskName: '2. Task', parentTaskId: null, minimumHours: '55', maximumHours: '555', id: 1492185321557, tasks: [{ taskName: 'Make site more responsive', parentTaskId: null, minimumHours: '1', maximumHours: '4', id: 1492185337429 }] }];
    this.setState({
      csv: csv(columns, this.props.data),
    }, () => {
      console.log('state', this.state.csv);
      const a = document.createElement('a');
      a.textContent = 'download';
      a.download = filename;
      a.href = `data:text/csv;charset=utf-8,${bomCode}${encodeURIComponent(this.state.csv)}`;
      a.click();
    });
    const
      prefix = true,
      bom = true;
    let bomCode = '';
    let filename = 'estimate';
    if (filename.indexOf('.csv') === -1) {
      filename += '.csv';
    }
    if (bom) {
      bomCode = '%EF%BB%BF';
    }
    if (prefix) {
      if (typeof prefix === 'string' || typeof prefix === 'number') {
        filename = `${prefix}_${filename}`;
      } else {
        filename = `${(new Date()).getTime()}_${filename}`;
      }
    }
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
              <DropdownItem onClick={this.saveAsCSV}>Generate CSV</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </CardBlock>
      </Card>
    );
  }
  }
