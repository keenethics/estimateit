import React from 'react';
import PropTypes from 'prop-types';
import normalizeCss from 'normalize.css';
import { Form, reduxForm } from 'redux-form';
// import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Container, Col, Card } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';

import Header from '../libs/Header';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    id: null,
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
            <Col xs="12" md="12" lg="10" className={s.estimator__container}>
              <Form
                form="contact"
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

Layout = reduxForm({
  form: 'contact',
})(Layout);

const initializeValues = (state) => {
  const initialValues = {
    moneyRate: '25',
  };

  return { initialValues };
};
const graphhh = graphql(gql`
    query estimate (id: "${this.props.id}"){
            owner,
            date,
            clientName,
            projectName,
            sprintNumber,
            comments,
            pm,
            skype,
            email,
            position,
            moneyRate,
            technologies,
            estimateOptions{
              qa,
              pm,
              risks,
              bugFixes,
              completing
            },
            devHours{
              minHours,
              maxHours
            },
            tasks{
              id,
              taskName,
              isChecked,
              minimumHours,
              maximumHours,
              tasks{
                id,
                taskName,
                isChecked,
                minimumHours,
                maximumHours,
                tasks{
                  id,
                  taskName,
                  isChecked,
                  minimumHours,
                  maximumHours,
                },
              },
            }
          }
       }
    },
  `);
export default compose(initializeValues)(withStyles(normalizeCss, s)(Layout));
