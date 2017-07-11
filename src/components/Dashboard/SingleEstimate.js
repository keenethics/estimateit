import React from 'react';
import styles from './styles.scss';

const SingleEstimate = (props) => {

  console.log(props.estimate);

return  (
    <a href={`/estimate/${props.estimate.id}`} className={styles.singleEstimate}>
      <div className={styles.singleEstimate__text}>
        Client name: {props.estimate.header.headerAdditional.clientName}
      </div>
      <div className={styles.singleEstimate__text}>
        Project name: {props.estimate.header.headerAdditional.projectName}
      </div>
      <div className={styles.singleEstimate__text}>
        Sprint number: {props.estimate.header.headerAdditional.sprintNumber}
      </div>
      <div className={styles.singleEstimate__text}>
        Date: {props.estimate.header.headerAdditional.data}
      </div>
    </a>
  );

}
export default SingleEstimate;
