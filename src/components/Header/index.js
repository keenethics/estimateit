/* eslint global-require:  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  FormGroup,
  CardTitle,
} from 'reactstrap';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import { Field, FieldArray } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import datepicker from 'react-datepicker/dist/react-datepicker.css';

import Task from './Task';
import * as styles from './styles.scss';
import MultiSelect from '../libs/MultiSelect';
import technologiesList from '../../constants/technologies';
import { renderField, renderDateField } from '../libs/helpers';
import {
  required,
  currency,
  maxLength,
  arrayItemMaxLength,
} from '../libs/validation';

class Header extends Component {
  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
  }

  renderHeader() {
    const { userCanEditThisEstimate = false } = this.props;

    return (
      <div className={styles.right}>
        <Field
          id="date"
          name="date"
          component={renderDateField}
          disabled={!userCanEditThisEstimate}
          fieldClassName={styles.right__group_item}
          wrapperClassName={styles.right__group_item}
        />
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="clientName"
            name="clientName"
            label="Client name:"
            component={renderField}
            disabled={!userCanEditThisEstimate}
            validate={[maxLength(30)]}
            className={styles.right__group_item}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="projectName"
            name="projectName"
            label="Project name:"
            component={renderField}
            disabled={!userCanEditThisEstimate}
            validate={[required, maxLength(30)]}
            className={styles.right__group_item}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            label="Sprint:"
            id="sprintNumber"
            name="sprintNumber"
            component={renderField}
            disabled={!userCanEditThisEstimate}
            validate={[currency, maxLength(30)]}
            className={styles.right__group_item}
          />
        </FormGroup>
      </div>
    );
  }

  render() {
    const options = technologiesList.map(element => ({
      value: element,
      label: element,
    }));
    const { userCanEditThisEstimate = false } = this.props;

    return (
      <div>
        <Row className={styles.header}>
          <Col xs="12">
            <img src={require('../../../public/logo_black.jpg')} height={30} alt="" />
            <CardTitle>ESTIMATE</CardTitle>
          </Col>
          <Col
            xs="12"
            md="5"
            className={`${styles.header__left} ${styles.left}`}
          >
            <div className={styles.left__contacts}>
              <p>3, Lytvynenka street, Lviv</p>
              <p>Keenethics Phone: [+38 096 814 72 66]</p>
              <p>
                e-mail:
                {' '}
                <a href="mailto:founders@keenethics.com">
                  founders@keenethics.com
                </a>
              </p>
              <p><a href="https://keenethics.com/" target="_blank" rel="noopener noreferrer">keenethics.com</a></p>
            </div>
          </Col>
          <Col xs="12" md="7" className={styles.header__right}>
            {this.renderHeader()}
          </Col>
        </Row>
        <FormGroup className={styles.right__group}>
          <Field
            multi
            creatable
            searchable
            options={options}
            name="technologies"
            component={MultiSelect}
            placeholder="Technologies"
            disabled={!userCanEditThisEstimate}
            validate={[arrayItemMaxLength(30)]}
          />
        </FormGroup>
        <FieldArray
          level={0}
          name="tasks"
          component={Task}
          userCanEditThisEstimate={userCanEditThisEstimate}
        />
        <FormGroup className={styles.right__group}>
          <Field
            name="comments"
            type="textarea"
            label="Comments"
            component={renderField}
            disabled={!userCanEditThisEstimate}
            validate={[maxLength(5000)]}
          />
        </FormGroup>
      </div>
    );
  }
}

Header.propTypes = {
  userCanEditThisEstimate: PropTypes.bool.isRequired,
};


function mapStateToProps({ estimate: { userCanEditThisEstimate = false } }) {
  return { userCanEditThisEstimate };
}


export default connect(mapStateToProps)(
  withStyles(styles, datepicker)(Header),
);
