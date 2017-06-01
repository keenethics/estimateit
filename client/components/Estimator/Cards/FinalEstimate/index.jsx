import React, { Component } from 'react';
import { Card, CardBlock, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

  saveAsShortUrl() {
    axios.post('http://localhost:3000/new/', {
      url: decodeURIComponent(location.href),
      data: {
        header: this.props.headerState,
        main: this.props.mainState,
      },
    })
      .then((response) => {
        const { data } = response;
        this.refs.notificationSystem.addNotification({
          title: 'Success',
          position: 'br',
          message: `
          ${data.message}
          And copy to clipboard`,
          level: 'success' });
        this.setState({
          axios: data,
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
    axios.post('http://localhost:3000/api/pdf', {
      url: decodeURIComponent(location.href),
    }, { responseType: 'arraybuffer' })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = 'keenethics_report.pdf';
        link.click();
        this.refs.notificationSystem.addNotification({
          title: 'Success',
          message: 'generation of the PDF was successful!',
          level: 'success',
          autoDismiss: 6,
          position: 'br',
        });
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
    console.log(this.props);
    return (
      <Card className={styles.final}>
        <CardBlock className={styles.final__wrapper}>
          <div className={styles.final__result}>
            <div className={styles.final__result_info}>Total hours: {this.props.hours}</div>
          </div>
          <div className={styles.final__result}>
            <div className={styles.final__result_info}>
              Total sum: {this.props.hours * this.props.rate}$
            </div>
          </div>
          <ButtonDropdown
            id="screenShot"
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
