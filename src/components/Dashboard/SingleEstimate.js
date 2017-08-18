import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import * as styles from './styles.scss';

const SingleEstimate = ({ estimate }) => (
  <a
    href={`/estimate/${estimate._id}`}
    className={`${styles.singleEstimate} col-xs-12 col-sm-12 col-md-6 col-lg-4`}
  >
    <div className={styles.card_pf}>
      <div className={styles.card_pf__body}>
        <div className={styles.card_pf__title}>
          {estimate.projectName}
        </div>
        <div className={styles.singleEstimate__text}>
          Client name: {estimate.clientName}
        </div>
        <div className={styles.singleEstimate__text}>
          Sprint number: {estimate.sprintNumber}
        </div>
        <div className={styles.singleEstimate__text}>
          Date: {moment(estimate.date).format('MMM Do YY')}
        </div>
      </div>
    </div>
  </a>
);

SingleEstimate.propTypes = {
  estimate: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default SingleEstimate;
