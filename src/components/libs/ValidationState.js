/* eslint-disable */
import React from 'react';
import * as styles from './ValidationState.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const ValidationState = ({ touched, error, warning }) => (
  <div className={styles.wrapper}>
    {/*}
    <span
      className={touched &&
        (error && "text-danger" || warning &&  "text-warning") ||
        styles.hidden}
    >
      {error || warning || ''}
    </span>
    {*/}
  </div>
);

export default withStyles(styles)(ValidationState);

export const hintClass = ({ touched, error, warning }) => (
  touched &&
  (error && "error-hint" || warning &&  "warning-hint") ||
  "hidden-hint"
);
