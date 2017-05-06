import React, { Component } from 'react';
import { Card, CardBlock, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import domtoimage from 'dom-to-image';
import axios from 'axios';
import Notification from 'react-notification-system';
import csvGenerate from './lib/csvGenerate';
import csvFilename from './lib/csvFilename';
import styles from './styles.scss';


export default class FinalEstimate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      axios: [],
      dropdownOpen: false,
      csv: '',
    };
    this.saveAsShortUrl = this.saveAsShortUrl.bind(this);
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
  saveAsShortUrl() {
    axios.post('http://localhost:3000/new/', {
      url: decodeURIComponent(location.href),
    })
      .then((response) => {
        const { data } = response.data;
        this.refs.notificationSystem.addNotification({
          title: 'Success',
          position: 'br',
          message: `
          ${data.message}
          And copy to clipboard`,
          level: 'success' });
        this.setState({
          axios: response.data,
        });
      })
      .catch((error) => {
        const { data } = error.response;
        this.refs.notificationSystem.addNotification({
          title: 'Error',
          message: `
          ${data.message}
          ${data.url}`,
          level: 'error',
          autoDismiss: 6,
          position: 'br',
        });
      });
  }
  saveAsPdf() {
    console.log('state - in FinalEstimate', this.props.calculationData);
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
    const columns = [[{
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
    }], [{
      id: 'qa',
      displayName: 'QA',
    }, {
      id: 'pm',
      displayName: 'PM',
    }, {
      id: 'bugFixes',
      displayName: 'Bug Fixes',
    }, {
      id: 'risks',
      displayName: 'Risks',
    }, {
      id: 'completing',
      displayName: 'Completing',
    }]];

    this.setState({
      csv: csvGenerate(columns, this.props.data, this.props.calculationData),
    }, () => {
      console.log('csv', this.state.csv);
      const a = document.createElement('a');
      a.textContent = 'download';
      a.download = csvFilename();
      a.href = `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(this.state.csv)}`;
      a.click();
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
              <DropdownItem onClick={this.saveAsCSV}>Generate CSV</DropdownItem>
              <DropdownItem onClick={this.saveAsShortUrl}>Generate URL</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <Notification ref="notificationSystem" />
        </CardBlock>
      </Card>
    );
  }
}
