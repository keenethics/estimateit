import React from 'react';
import styles from './styles.scss';

const SingleEstimate = (props) => {
  console.log(props.estimate);
  return (
    <a href={`/estimate/${props.estimate._id}`} className={styles.singleEstimate}>
      <div className={styles.singleEstimate__text}>
        Client name: {props.estimate.clientName}
      </div>
      <div className={styles.singleEstimate__text}>
        Project name: {props.estimate.projectName}
      </div>
      <div className={styles.singleEstimate__text}>
        Sprint number: {props.estimate.sprintNumber}
      </div>
      <div className={styles.singleEstimate__text}>
        Date: {props.estimate.data}
      </div>
    </a>
  );
};
export default SingleEstimate;
