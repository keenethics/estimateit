import React from 'react';
import styles from './styles.scss';

const SingleEstimate = (props) => {
  console.log(props.estimate);
  return (
    <a
      href={`/estimate/${props.estimate._id}`}
      className={`${styles.singleEstimate} col-xs-12 col-sm-6 col-md-4 col-lg-3`}
    >
      <div className={styles.card_pf}>
        <div className={styles.card_pf__body}>
          <div className={styles.card_pf__title}>
            Project name: {props.estimate.projectName}
          </div>
          <div className={styles.singleEstimate__text}>
            Client name: {props.estimate.clientName}
          </div>
          <div className={styles.singleEstimate__text}>
            Sprint number: {props.estimate.sprintNumber}
          </div>
          <div className={styles.singleEstimate__text}>
            Date: {props.estimate.data}
          </div>
        </div>
      </div>
    </a>
  );
};
export default SingleEstimate;
