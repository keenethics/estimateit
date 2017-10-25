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

import request from '../../utils/request.js';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csv: '',
      axios: [],
      modal: false,
      modal2: false,
      dropdownOpen: false,
      updatingSpreadsheet: false,
    };

    this.toggle = this.toggle.bind(this);
    this.saveAsCSV = this.saveAsCSV.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModal2 = this.toggleModal2.bind(this);
    this.estimateUpdate = this.estimateUpdate.bind(this);
    this.estimateRemove = this.estimateRemove.bind(this);
    this.exportToGoogleSheet = this.exportToGoogleSheet.bind(this);
  }

  toggle() {
    const dropdownOpen = !this.state.dropdownOpen;
    this.setState({ dropdownOpen });
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  toggleModal2() {
    this.setState({ modal2: !this.state.modal2 });
  }

  async exportToGoogleSheet() {
    const { estimateId } = this.props;
    const { user } =  window.App;
    const userId = user._id;
    const { token, refreshToken } = user.google;
    this.setState({ updatingSpreadsheet: true });
    const body = { token, refreshToken, estimateId, userId };
    const resp = await request('/spreadsheets', body, 'POST');
    const parsedResp = await resp.json();
    this.setState({ updatingSpreadsheet: false });
    const level = parsedResp.error ? 'error' : 'success';
    this.notificationSystem.addNotification({
      autoDismiss: 6,
      position: 'br',
      title: level,
      level,
      message: parsedResp.message,
    });
  }

  async estimateUpdate(values, forceUpdate = false, cb) {
    const { estimateId } = this.props;
    let msg = 'Estimate saved';
    let title = 'Success';
    let level = 'success';
    try {
      await this.props.estimateUpdate({
        variables: { input: { ...values, forceUpdate } },
        refetchQueries: [{
          query: estimateFormValues,
          variables: { id: estimateId },
        }],

      });
    } catch (error) {
      msg = error.message;
      title = 'Error';
      level = 'error';
      if (msg.includes('outdated')) {
        this.toggleModal2();
        return;
      } 
    }
    if (cb) cb();
    this.notificationSystem.addNotification({
      autoDismiss: 6,
      position: 'br',
      title,
      level,
      message: msg,
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
    const { updatingSpreadsheet } = this.state;
    const { userCanEditThisEstimate } = this.props;
    const token = window.App.user.google && window.App.user.google.token;
    return (
      <div>
        <CardBlock className={styles.final__wrapper}>
          { userCanEditThisEstimate &&
            <div>
              {token &&
                <Button
                  color={updatingSpreadsheet ? 'secondary' : 'danger'}
                  onClick={
                    handleSubmit(val =>
                      this.estimateUpdate(val, false, this.exportToGoogleSheet)
                    )}
                  disabled={updatingSpreadsheet}
                >
                  {updatingSpreadsheet ? 'Exporting...' : 'Save & export to Google Sheets'}
                </Button>}
              <Button
                color="danger"
                onClick={handleSubmit(val => this.estimateUpdate(val, false, false))}
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

        <Modal isOpen={this.state.modal2} toggle={this.toggleModal2}>
          <ModalHeader toggle={this.toggleModal2}>
            Current estimate is outdated
          </ModalHeader>
          <ModalBody>
            Do you really want to force update the document?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={() => {
                handleSubmit(val => this.estimateUpdate(val, true, false))();
                this.toggleModal2();
              }}
            >Yes</Button>{' '}
            <Button
              color="secondary"
              onClick={this.toggleModal2}
            >No</Button>
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
