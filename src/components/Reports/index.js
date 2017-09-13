import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import Notification from 'react-notification-system';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBlock,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownToggle,
} from 'reactstrap';

import * as styles from './styles.scss';
import history from '../../history';
import csvGenerate from './lib/csvGenerate';
import csvFilename from './lib/csvFilename';
import columns from '../../constants/csvCoulumns';
import {
  estimateUpdate,
  estimateRemove,
  estimateFormValues,
} from '../../data/queriesClient';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csv: '',
      axios: [],
      modal: false,
      dropdownOpen: false,
      updatingSpreadsheet: false,
      estimateHasBeenSaved: false,
    };

    this.toggle = this.toggle.bind(this);
    this.saveAsCSV = this.saveAsCSV.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.estimateUpdate = this.estimateUpdate.bind(this);
    this.estimateRemove = this.estimateRemove.bind(this);
    this.exportToGoogleSheet = this.exportToGoogleSheet.bind(this);
  }

  toggle() {
    const dropdownOpen = !this.state.dropdownOpen;
    this.setState({ dropdownOpen });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  exportToGoogleSheet() {
    const { estimateId } = this.props;
    const userId = window.App.user._id
    const { token, refreshToken } = window.App.user.google;
    this.setState({ updatingSpreadsheet: true });
    fetch('/spreadsheets', {
      method: 'POST',
      body: JSON.stringify({ token, refreshToken, estimateId, userId }),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      this.setState({ updatingSpreadsheet: false });
      return response.json()
    }).then(res => {
      if (res.error) {
        this.notificationSystem.addNotification({
          autoDismiss: 6,
          position: 'br',
          title: 'Error',
          level: 'error',
          message: res.message,
        });
      } else {
        this.setState({ estimateHasBeenSaved: false });
        this.notificationSystem.addNotification({
          autoDismiss: 6,
          position: 'br',
          title: 'Success',
          level: 'success',
          message: res.message,
        });
      }
    })
  }

  estimateUpdate(values) {
    const { estimateId } = this.props;

    this.props.estimateUpdate({
      variables: { input: { ...values } },
      refetchQueries: [{
        query: estimateFormValues,
        variables: { id: estimateId },
      }],
    }).then(() => {
      this.setState({ estimateHasBeenSaved: true });
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

  estimateRemove(e) {
    e.preventDefault();

    this.props.estimateRemove({
      variables: { id: this.props.estimateId },
    }).then(() => {
      this.setState({
        modal: false,
      });
      history.replace('/');
    }).catch((error) => {
      this.setState({
        modal: false,
      });
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Error',
        level: 'error',
        message: error.message,
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
      this.notificationSystem.addNotification({
        autoDismiss: 26,
        position: 'br',
        title: 'Saving CSV',
        level: 'success',
        message: <a id="csv-link" download={csvFilename()} href={`data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(this.state.csv)}`} />,
      });
      setTimeout(() => {
        document.getElementById('csv-link').click();
      }, 0);
    });
  }

  render() {
    const { handleSubmit } = this.context;
    const { updatingSpreadsheet, estimateHasBeenSaved } = this.state;
    const { userCanEditThisEstimate } = this.props;
    const token = window.App.user.google && window.App.user.google.token;
    return (
      <div>
        <CardBlock className={styles.final__wrapper}>
          { userCanEditThisEstimate &&
            <div>
              {token &&
                <Button
                  color={updatingSpreadsheet && estimateHasBeenSaved  ? 'secondary' : 'danger'}
                  onClick={handleSubmit(this.exportToGoogleSheet)}
                  disabled={updatingSpreadsheet || !estimateHasBeenSaved }
                >
               {updatingSpreadsheet ? 'exporting...' : 'export to google Sheets'}
              </Button>
              }
              <Button
                color="danger"
                onClick={handleSubmit(this.estimateUpdate)}
              >
                Save
              </Button>
              <Button
                color="danger"
                onClick={this.toggleModal}
              >
                Delete
              </Button>
            </div>
          }
          <Dropdown
            dropup
            id="screenShot"
            toggle={this.toggle}
            className={styles.final__result}
            isOpen={this.state.dropdownOpen}
          >
            <DropdownToggle
              caret
              className={styles.final__result_info}
            >
              Download
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                type="submit"
                onClick={handleSubmit(this.saveAsCSV)}
              >
                CSV
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </CardBlock>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Remove estimate</ModalHeader>
          <ModalBody>
            Do you really want to remove this estimate?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.estimateRemove}>Yes</Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>No</Button>
          </ModalFooter>
        </Modal>
        <Notification ref={ref => (this.notificationSystem = ref)} />
      </div>
    );
  }
}

Reports.contextTypes = {
  fetch: PropTypes.func,
  handleSubmit: PropTypes.func,
};

Reports.propTypes = {
  estimateId: PropTypes.string.isRequired,
  estimateUpdate: PropTypes.func.isRequired,
  estimateRemove: PropTypes.func.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  estimateOptions: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default compose(
  graphql(estimateUpdate, { name: 'estimateUpdate' }),
  graphql(estimateRemove, { name: 'estimateRemove' }),
  withStyles(styles),
)(Reports);
