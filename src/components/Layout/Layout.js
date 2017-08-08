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
import scrollToItem from '../libs/scroll';
import { ESTIMATE_FORM } from '../../constants';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static handleOnKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

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
              <Form
                form={ESTIMATE_FORM}
                onKeyPress={this.handleOnKeyPress}
              >
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


const LayoutWrapper = reduxForm({
  form: ESTIMATE_FORM,
  enableReinitialize: false,
  onSubmitFail: scrollToItem,
})(Layout);

const initializeValues = () => {
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
)(LayoutWrapper);
