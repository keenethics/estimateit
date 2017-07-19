import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  FormGroup,
  CardTitle,
} from 'reactstrap';
import { Field, FieldArray } from 'redux-form';
import 'react-select/dist/react-select.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import datepicker from 'react-datepicker/dist/react-datepicker.css';

import Task from './Task';
import styles from './styles.scss';
import MultiSelect from '../libs/MultiSelect';
import technologiesList from '../../constants/technologies';
import { renderField, renderDateField } from '../libs/helpers';
import { required, currency, requiredArray } from '../libs/validation';

class Header extends Component {
  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
  }

  renderHeader() {
    return (
      <div className={styles.right}>
        <Field
          id="date"
          name="date"
          validate={[required]}
          component={renderDateField}
          fieldClassName={styles.right__group_item}
          wrapperClassName={styles.right__group_item}
        />
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="clientName"
            name="clientName"
            label="Client name:"
            validate={[required]}
            component={renderField}
            className={styles.right__group_item}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="projectName"
            name="projectName"
            label="Project name:"
            validate={[required]}
            component={renderField}
            className={styles.right__group_item}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="number"
            label="Sprint:"
            id="sprintNumber"
            name="sprintNumber"
            component={renderField}
            validate={[required, currency]}
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

    return (
      <div>
        <Row className={styles.header}>
          <Col xs="12">
            <img src={require('../../../public/logo_black.jpg')} height={30} />
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
              <p><a href="https://keenethics.com/" target="_blank" rel="noreferrer">keenethics.com</a></p>
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
            validate={[requiredArray]}
            placeholder="Technologies"
          />
        </FormGroup>
        <FieldArray
          level={0}
          name="tasks"
          component={Task}
        />
        <FormGroup className={styles.right__group}>
          <Field
            name="comments"
            type="textarea"
            label="Comments"
            validate={[required]}
            component={renderField}
          />
        </FormGroup>
      </div>
    );
  }
}

Header.propTypes = {
  fields: PropTypes.array,
};

export default withStyles(styles, datepicker)(Header);
