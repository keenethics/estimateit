import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Item from './Item';
import styles from './styles.scss';
import AddUsers from '../Header/addUsersComponent';

class NavBar extends Component {
  render() {
    return (
      <div className={styles.navbar}>
        <div className={styles.navbar__title}>
          <i className={`${styles.navbar__title_btn} fa fa-bars`} />
          <span className={styles.navbar__title_text}>Project</span>
        </div>
        <ul className={styles.navbar__list}>
          <Item text="Users" icon="users">
            <AddUsers />
          </Item>
          <Item text="Settings" icon="cog" link="/settings" />
        </ul>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
