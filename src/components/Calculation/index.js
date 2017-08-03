import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock, Col, Row} from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import styles from './styles.scss';
import PieChart from '../PieChart';
import EstimateOptions from '../EstimateOptions';

const Calculation = ({
  totalHours,
  estimateOptions,
  userCanEditThisEstimate,
}) => (
  <Card className={styles.calculation}>
    <CardBlock className={styles.calculation__wrapper}>
      <Col
        xs="12" lg="9"
        className={styles.calculation__options}
      >
        <EstimateOptions
          totalHours={totalHours}
          estimateOptions={estimateOptions}
          userCanEditThisEstimate={userCanEditThisEstimate}
        />
      </Col>
    </CardBlock>
  </Card>
);

Calculation.propTypes = {
  totalHours: PropTypes.number.isRequired,
  estimateOptions: PropTypes.object.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Calculation);
