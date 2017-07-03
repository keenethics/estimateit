import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import {
  Card,
  CardBlock,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
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
import { Creatable } from 'react-select';
import { required, requiredArray, number } from '../libs/validation';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      axios: [],
      dropdownOpen: false,
      csv: '',
      value: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
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
    const dropdownOpen = !this.state.dropdownOpen;
    this.setState({ dropdownOpen });
  }

  saveAsUrl(values) {
    const { mainState: { estimateOptions, devHours }, headerState: { tasks }, mutate } = this.props;
    console.log(values);

    mutate({
      variables: { input: { ...values, estimateOptions, tasks, devHours } },
    }).then(({ data: { estimateCreate: { url } } }) => {
      this.notificationSystem.addNotification({
        title: 'Success',
        position: 'br',
        level: 'success',
        children: (
          <div>
            <input
              type="text"
              value={url}
              onClick={e => e.stopPropagation()}
              className={styles['custom-notification-input']}
              ref={node => (this.customNotificationInput = node)}
            />
            <button
              type="button"
              onClick={this.copyUrlToClipboard.bind(this, url)}
              className={styles['custom-notification-action-button']}
            >
            Copy to clipboard
          </button>
          </div>
        ),
      });
    }).catch(error => {
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

  async saveAsPdf() {
    axios.post('/api/pdf', {
      url: decodeURIComponent(location.href),
    }, { responseType: 'arraybuffer' })
      .then((response) => {
        console.log(response);
        // const file = new Blob([response.data], { type: 'application/pdf' });
        // const link = document.createElement('a');
        //
        // link.href = window.URL.createObjectURL(file);
        // link.download = 'keenethics_report.pdf';
        // link.click();
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

  handleOnChange(value) {
    console.log(value);
    this.setState({ value });
  }
  // <Field
  //   name="technologies"
  //   component={MultiSelect}
  //   validate={[requiredArray]}
  //   multi={true}
  //   name='emails'
  //   onChange={this.handleOnChange}
  //   placeholder='Emails'
  //   value={this.state.value}
  // />
  render() {
    const { handleSubmit } = this.context;
    return (
      <Card className={styles.final}>
        <CardBlock className={styles.final__wrapper}>

          <ButtonDropdown
            id="screenShot"
            toggle={this.toggle}
            className={styles.final__result}
            isOpen={this.state.dropdownOpen}
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
                onClick={handleSubmit(this.saveAsPdf)}
              >
                Generate PDF
              </DropdownItem>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.saveAsCSV)}
              >
                Generate CSV
              </DropdownItem>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.saveAsUrl)}
              >
                Generate URL
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </CardBlock>
        <Notification ref={ref => this.notificationSystem = ref} />
      </Card>
    );
  }
}

Reports.contextTypes = {
  handleSubmit: PropTypes.func,
};

Reports.propTypes = {
  mutate: PropTypes.func.isRequired,
  mainState: PropTypes.object.isRequired,
  headerState: PropTypes.object.isRequired,
};

export default compose(
  graphql(gql`
    mutation EstimateMutation (
      $input: EstimateInputType!
    ) {
      estimateCreate (
        input: $input
      ) {
        url
      }
    },
  `),
  withStyles(styles),
)(Reports);
