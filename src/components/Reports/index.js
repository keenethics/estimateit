import axios from 'axios';
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

import styles from './styles.scss';
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
    };

    this.toggle = this.toggle.bind(this);
    this.saveAsCSV = this.saveAsCSV.bind(this);
    this.downloadPdf = this.downloadPdf.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.estimateUpdate = this.estimateUpdate.bind(this);
    this.estimateRemove = this.estimateRemove.bind(this);
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

  estimateUpdate(values) {
    const { estimateId } = this.props;

    this.props.estimateUpdate({
      variables: { input: { ...values } },
      refetchQueries: [{
        query: estimateFormValues,
        variables: { id: estimateId },
      }],
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

  // shareViaEmail({ emails }) {
  //   const { fetch } = this.context;
  //
  //   if (!emails || !emails.length) {
  //     this.notificationSystem.addNotification({
  //       title: 'Error',
  //       level: 'error',
  //       position: 'br',
  //       autoDismiss: 6,
  //       message: 'Enter emails',
  //     });
  //     return null;
  //   }
  //
  //   fetch('/api/shareViaEmails', {
  //     body: JSON.stringify({
  //       emails: decodeURIComponent(emails),
  //       url: decodeURIComponent(location.href),
  //     }),
  //   })
  //     .then(() => {
  //       this.notificationSystem.addNotification({
  //         title: 'Success',
  //         level: 'success',
  //         position: 'br',
  //         autoDismiss: 6,
  //         message: 'This estimate is shared',
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       this.notificationSystem.addNotification({
  //         title: 'Error',
  //         level: 'error',
  //         position: 'br',
  //         autoDismiss: 6,
  //         message: 'internal server error',
  //       });
  //     });
  // }
  //
  // sendPdfToEmails({ emails }) {
  //   const { fetch } = this.context;
  //
  //   if (!emails || !emails.length) {
  //     this.notificationSystem.addNotification({
  //       title: 'Error',
  //       level: 'error',
  //       position: 'br',
  //       autoDismiss: 6,
  //       message: 'Enter emails',
  //     });
  //     return null;
  //   }
  //
  //   fetch('/api/sendPpfToEmails', {
  //     body: JSON.stringify({
  //       emails: decodeURIComponent(emails),
  //       url: decodeURIComponent(location.href),
  //     }),
  //   })
  //     .then(() => {
  //       this.notificationSystem.addNotification({
  //         title: 'Success',
  //         level: 'success',
  //         position: 'br',
  //         autoDismiss: 6,
  //         message: 'PDF will be send to the emails!',
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       this.notificationSystem.addNotification({
  //         title: 'Error',
  //         level: 'error',
  //         position: 'br',
  //         autoDismiss: 6,
  //         message: 'internal server error',
  //       });
  //     });
  // }


  render() {
    const { handleSubmit } = this.context;
    const { userCanEditThisEstimate } = this.props;

    return (
      <div>
        <CardBlock className={styles.final__wrapper}>
          { userCanEditThisEstimate &&
            <div>
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
                onClick={handleSubmit(this.downloadPdf)}
              >
                PDF
              </DropdownItem>
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
