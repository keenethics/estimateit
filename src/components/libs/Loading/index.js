import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as styles from './styles.scss';


class Loading extends Component {
  render() {
    return (
      <div className={styles.spinner__wrapper}>
        <div className={styles.spinner__body}>
          <div className={styles.spinner__loader}>
            <div className={styles.loader}>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Loading);
