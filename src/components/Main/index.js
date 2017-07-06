import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Card, CardBlock, Row, Col } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Reports from '../Reports';
import styles from './styles.scss';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import Calculation from '../Calculation';
import FinalEstimate from '../FinalEstimate';
import * as actionsMain from '../../actions/Main';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalHours: 0,
    };

    this.labels = [];
    this.transformToVector = this.transformToVector.bind(this);
  }

  componentDidMount() {
    this.transformToVector();
  }

  componentDidUpdate() {
    this.transformToVector();
  }

  transformToVector() {
    const { time: developmentTime } = this.props.headerState.developmentTime;
    this.labels = developmentTime.map(item => Math.round(item));
  }


  render() {
    const {
      mainState: {
        contacts,
        estimateOptions,
      },
      headerState: {
        developmentTime: {
          percent,
          totalHours,
          devHours: {
            minHours,
            maxHours,
          },
        }
      },
      addClientData,
      changeMoneyRate,
      addEstimateOptions,
      moneyRate,
    } = this.props;

    this.transformToVector();
    return (
      <Row className={styles.main}>
        <Col xs="12">
          {
            // <LineChart labels={totalHours} data={percent} />
          }
        </Col>
        <Col xs="12">
          <Card className={styles.final}>
            <CardBlock className={styles.final__wrapper}>
              <div className={styles.final__result}>
                <div className={styles.final__result_info}>
                  Total developer min hours: {minHours}
                </div>
              </div>
              <div className={styles.final__result}>
                <div
                  className={styles.final__result_info}
                >
                  Total developer max hours: {maxHours}
                </div>
              </div>
            </CardBlock>
          </Card>
        </Col>
        <Col xs="12">
          <Calculation
            rate={moneyRate}
            onRateChange={changeMoneyRate}
            estimateOptions={estimateOptions}
            totalHours={totalHours}
            addEstimateOptions={addEstimateOptions}
          />
        </Col>
        <Col xs="12">
          <FinalEstimate
            mainState={this.props.mainState}
            totalHours={totalHours}
            headerState={this.props.headerState}
          />
        </Col>
        <Col xs="12">
          <Contacts
            contacts={contacts}
            addClientData={addClientData}
          />
        </Col>
        <Col xs="12">
          <Reports
            headerState={this.props.headerState}
            mainState={this.props.mainState}
          />
        </Col>
      </Row>
    );
  }
}

Main.propTypes = {
  mainState: PropTypes.object.isRequired,
  headerState: PropTypes.object.isRequired,
  addClientData: PropTypes.func.isRequired,
  changeMoneyRate: PropTypes.func.isRequired,
  addEstimateOptions: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    mainState: state.Main,
    headerState: state.Header,
    moneyRate: state.form.contact.values.moneyRate,
  };
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsMain, dispatch) }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main));
