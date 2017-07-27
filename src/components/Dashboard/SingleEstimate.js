import React from 'react';
import moment from 'moment';
import styles from './styles.scss';

const SingleEstimate = (props) => {
  return (
    <a
      href={`/estimate/${props.estimate._id}`}
      className={`${styles.singleEstimate} col-xs-12 col-sm-12 col-md-6 col-lg-4`}
    >
      <div className={styles.card_pf}>
        <div className={styles.card_pf__body}>
          <div className={styles.card_pf__title}>
            {props.estimate.projectName}
          </div>
          <div className={styles.singleEstimate__text}>
            Client name: {props.estimate.clientName}
          </div>
          <div className={styles.singleEstimate__text}>
            Sprint number: {props.estimate.sprintNumber}
          </div>
          <div className={styles.singleEstimate__text}>
            Date: {moment(props.estimate.date).format("MMM Do YY")}
          </div>
        </div>
      </div>
    </a>
  );
};
export default SingleEstimate;
