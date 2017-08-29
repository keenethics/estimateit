import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Card,
  CardBlock,
  CardHeader,
} from 'reactstrap';

import * as styles from './styles.scss';

const SingleEstimate = ({ estimate }) => (
  <a
    href={`/estimate/${estimate._id}`}
    className={`${styles.singleEstimate} col-xs-12 col-sm-12 col-md-6 col-lg-4`}
  >

    <Card>
      <CardHeader className={styles.singleEstimate__header}>
        {estimate.projectName}
      </CardHeader>
      <CardBlock>
        <div className={styles.singleEstimate__text}>
          Client name: {estimate.clientName}
        </div>
        <div className={styles.singleEstimate__text}>
          Sprint number: {estimate.sprintNumber}
        </div>
        <div className={styles.singleEstimate__text}>
          Date: {moment(estimate.date).format('MMM Do YY')}
        </div>
      </CardBlock>
    </Card>
  </a>
);

SingleEstimate.propTypes = {
  estimate: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default SingleEstimate;
