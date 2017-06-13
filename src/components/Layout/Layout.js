import React from 'react';
import PropTypes from 'prop-types';
import normalizeCss from 'normalize.css';
import { Container, Col, Card } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return   (
      <Container className={s.estimator}>
        <Card id="screen">
          <Col
            xs="12"
            md="12"
            lg="10"
            className={s.estimator__container}
          >
            {this.props.children}
          </Col>
        </Card>
      </Container>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
