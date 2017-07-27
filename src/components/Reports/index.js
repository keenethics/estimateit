import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  Card,
  CardBlock,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownToggle,
} from 'reactstrap';
import axios from 'axios';
import Notification from 'react-notification-system';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Field } from 'redux-form';

import columns from '../../constants/csvCoulumns';
import csvGenerate from './lib/csvGenerate';
import csvFilename from './lib/csvFilename';
import styles from './styles.scss';
import MultiSelect from '../libs/MultiSelect';

import { emailsArray } from '../libs/validation';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      axios: [],
      dropdownOpen: false,
      csv: '',
    };

    this.toggle = this.toggle.bind(this);
    this.saveAsCSV = this.saveAsCSV.bind(this);
    this.estimateUpdate = this.estimateUpdate.bind(this);
    this.downloadPdf = this.downloadPdf.bind(this);
    this.sendPdfToEmails = this.sendPdfToEmails.bind(this);
  }

  copyUrlToClipboard(url) {
    this.customNotificationInput.value = url.trim();
    this.customNotificationInput.select();
    document.execCommand('copy');
  }

  toggle() {
    const dropdownOpen = !this.state.dropdownOpen;
    this.setState({ dropdownOpen });
  }

  estimateUpdate(values) {
    const { mutate } = this.props;
    delete values['emails'];
    delete values['users'];

    mutate({
      variables: { input: { ...values } },
    }).then(() => {
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Success',
        level: 'success',
        message: 'Estimate saved',
      });
    }).catch((error) => {
      console.error(error.message);
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Error',
        level: 'error',
        message: error.message,
      });
    });
  }

  sendPdfToEmails({ emails }) {
    const { fetch } = this.context;

    if (!emails || !emails.length) {
      this.notificationSystem.addNotification({
        title: 'Error',
        level: 'error',
        position: 'br',
        autoDismiss: 6,
        message: 'Enter emails',
      });
      return null;
    }

    fetch('/api/sendPpfToEmails', {
      body: JSON.stringify({
        emails: decodeURIComponent(emails),
        url: decodeURIComponent(location.href),
      }),
    })
      .then(() => {
        this.notificationSystem.addNotification({
          title: 'Success',
          level: 'success',
          position: 'br',
          autoDismiss: 6,
          message: 'PDF will be send to the emails!',
        });
      })
      .catch((error) => {
        console.error(error);
        this.notificationSystem.addNotification({
          title: 'Error',
          level: 'error',
          position: 'br',
          autoDismiss: 6,
          message: 'internal server error',
        });
      });
  }

  downloadPdf() {
    axios.post('/api/downloadPpdf', {
      url: decodeURIComponent(location.href),
    }, { responseType: 'arraybuffer' })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');

        link.href = window.URL.createObjectURL(file);
        link.download = 'keenethics_report.pdf';
        link.click();
        this.notificationSystem.addNotification({
          title: 'Success',
          message: 'generation of the PDF was successful!',
          level: 'success',
          autoDismiss: 6,
          position: 'br',
        });
      })
      .catch((error) => {
        console.error(error);
        this.notificationSystem.addNotification({
          title: 'Error',
          level: 'error',
          position: 'br',
          autoDismiss: 6,
          message: 'internal server error',
        });
      });
  }

  saveAsCSV() {
    const {
      tasks,
      estimateOptions,
    } = this.props;

    this.setState({
      csv: csvGenerate(columns, tasks, estimateOptions),
    }, () => {
      const a = document.createElement('a');
      a.textContent = 'download';
      a.download = csvFilename();
      a.href = `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(this.state.csv)}`;
      a.click();
    });
  }

  render() {
    const { handleSubmit } = this.context;
    return (
      <Card className={styles.final}>
        <CardBlock className={styles.final__wrapper}>
          <Field
            multi
            name="emails"
            placeholder="Emails"
            component={MultiSelect}
            value={this.state.value}
            validate={[emailsArray]}
            className={styles.emails}
          />
          <Dropdown
            id="screenShot"
            toggle={this.toggle}
            className={styles.final__result}
            isOpen={this.state.dropdownOpen}
            dropup
          >
            <DropdownToggle
              caret
              color="danger"
              className={styles.final__result_info}
            >
              Report
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Type</DropdownItem>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.estimateUpdate)}
              >
                Save Estimate
              </DropdownItem>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.sendPdfToEmails)}
              >
                Send PDF to emails
              </DropdownItem>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.downloadPdf)}
              >
                Download PDF
              </DropdownItem>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.saveAsCSV)}
              >
                Generate CSV
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardBlock>
        <Notification ref={ref => this.notificationSystem = ref} />
      </Card>
    );
  }
}

Reports.contextTypes = {
  handleSubmit: PropTypes.func,
  fetch: PropTypes.func,
};

Reports.propTypes = {
  tasks: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  estimateOptions: PropTypes.object.isRequired,
};

export default compose(
  graphql(gql`
    mutation Mutation (
      $input: EstimateInputType
    ) {
      estimateUpdate (
        input: $input
      )
    },
  `),
  withStyles(styles),
)(Reports);
