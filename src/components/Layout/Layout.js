import React from 'react';
import PropTypes from 'prop-types';
import normalizeCss from 'normalize.css';
import { Form, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Container, Col, Card } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  getChildContext() {
    const { handleSubmit } = this.props;
    return { handleSubmit };
  }

  onSubmit(props) {
    console.log('submit form --> clicked', props);
  }

  render() {
    return (
      <Container className={s.estimator}>
        <Card id="screen">
          <Col xs="12" md="12" lg="10" className={s.estimator__container}>
            <Form
              form="contact"
            >
              {this.props.children}
            </Form>
          </Col>
        </Card>
      </Container>
    );
  }
}

Layout.childContextTypes = {
  handleSubmit: PropTypes.func,
};

Layout = reduxForm({
  form: 'contact',
})(Layout);

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(withStyles(normalizeCss, s)(Layout));
