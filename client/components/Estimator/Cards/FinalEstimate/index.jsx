import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Notification from 'react-notification-system';
import csvGenerate from './lib/csvGenerate';
import csvFilename from './lib/csvFilename';
import styles from './styles.scss';
import axiosInstance from '../../../../axios';

export default class FinalEstimate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      axios: [],
      dropdownOpen: false,
      csv: '',
    };
    this.saveAsUrl = this.saveAsUrl.bind(this);
    this.saveAsPdf = this.saveAsPdf.bind(this);
    this.saveAsCSV = this.saveAsCSV.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  copyUrlToClipboard(url) {
    this.customNotificationInput.value = url.trim();
    this.customNotificationInput.select();
    document.execCommand('copy');
  }
  toggle() {
    const { dropdownOpen } = this.state;
    this.setState({ dropdownOpen: !dropdownOpen });
  }

  saveAsUrl() {
    axiosInstance.post('/new/', {
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
          message: `${data.message}`,
          level: 'success',
          children: (
            <div>
              <input
                className={styles['custom-notification-input']}
                type="text"
                ref={node => (this.customNotificationInput = node)}
                value={data.url} onClick={e => e.stopPropagation()}
              />
              <button
                type="button"
                className={styles['custom-notification-action-button']}
                onClick={this.copyUrlToClipboard.bind(this, data.url)}
              >Copy to clipboard</button>
            </div>
          ),
        });
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
    axiosInstance.post('/api/pdf', {
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
    const {
      headerState: { tasks },
      mainState: { estimateOptions },
    } = this.props;

    this.setState({
      csv: csvGenerate(columns, tasks, estimateOptions),
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
    const { mainState: { moneyRate }, totalHours } = this.props;
    const totalSum = totalHours * moneyRate;
    return (
      <Card className={styles.final}>
        <CardBlock className={styles.final__wrapper}>
          <div className={styles.final__result}>
            <div className={styles.final__result_info}>Total hours: {totalHours}</div>
          </div>
          <div className={styles.final__result}>
            <div className={styles.final__result_info}>
              Total sum: {totalSum}$
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
              <DropdownItem onClick={this.saveAsUrl}>Generate URL</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <Notification ref="notificationSystem" />
        </CardBlock>
      </Card>
    );
  }
}

FinalEstimate.propTypes = {
  totalHours: PropTypes.number.isRequired,
  mainState: PropTypes.object.isRequired,
  headerState: PropTypes.object.isRequired,
};
