import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  Card,
  CardBlock,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  DropdownToggle,
} from 'reactstrap';
import Notification from 'react-notification-system';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import csvGenerate from './lib/csvGenerate';
import csvFilename from './lib/csvFilename';
import styles from './styles.scss';
import axiosInstance from '../../constants/axios';

class FinalEstimate extends Component {
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
    const { mainState: main, headerState: header } = this.props;

    this.props.mutate({
      variables: { input: { header, main } },
    }).then(({ data: { estimateCreate: { url } } }) => {
      this.refs.notificationSystem.addNotification({
        title: 'Success',
        position: 'br',
        // message: `${data.message}`,
        level: 'success',
        children: (
          <div>
            <input
              className={styles['custom-notification-input']}
              type="text"
              ref={node => (this.customNotificationInput = node)}
              value={url} onClick={e => e.stopPropagation()}
            />
            <button
              type="button"
              className={styles['custom-notification-action-button']}
              onClick={this.copyUrlToClipboard.bind(this, url)}
            >Copy to clipboard</button>
          </div>
        ),
      });
    }).catch(error => {
      console.log(error);
      this.refs.notificationSystem.addNotification({
        title: 'Error',
        level: 'error',
        position: 'br',
        autoDismiss: 6,
        message: 'internal server error',
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
    // console.log(totalSum);
    // console.log(totalHours)
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
              <DropdownItem onClick={this.saveAsPdf}>Generate PDF</DropdownItem>
              <DropdownItem onClick={this.saveAsCSV}>Generate CSV</DropdownItem>
              <DropdownItem onClick={this.saveAsUrl}>Generate URL</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </CardBlock>
        <Notification ref="notificationSystem"/>
      </Card>
    );
  }
}

FinalEstimate.propTypes = {
  mainState: PropTypes.object.isRequired,
  totalHours: PropTypes.number.isRequired,
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
)(FinalEstimate);
