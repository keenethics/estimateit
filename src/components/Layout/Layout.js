import React from 'react';
import PropTypes from 'prop-types';
import normalizeCss from 'normalize.css';
import { Form, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Container, Col, Card } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Header from '../libs/Header';
import s from './Layout.scss';

import { ESTIMATE_FORM } from '../../constants';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  getChildContext() {
    const { handleSubmit } = this.props;
    return { handleSubmit };
  }
  render() {
    return (
      <div>
            <Header />
            <Container className={s.estimator}>
              <Card id="screen">
                <Col
                  xs="12"
                  md="12"
                  lg="10"
                  className={s.estimator__container}
                >
                  <Form form="contact">
                    {this.props.children}
                  </Form>
                </Col>
              </Card>
            </Container>
      </div>
    );
  }
}

Layout.childContextTypes = {
  handleSubmit: PropTypes.func,
};

Layout = reduxForm({
  form: ESTIMATE_FORM,
  enableReinitialize: false,
})(Layout);

const initializeValues = (state) => {
  const initialValues = {
    moneyRate: '25',
    estimateOptions: {
      qa: 10,
      pm: 10,
      risks: 10,
      bugFixes: 10,
      completing: 100,
    },
  };

  return { initialValues };
};

export default compose(
  connect(initializeValues),
  withStyles(normalizeCss, s),
)(Layout);
