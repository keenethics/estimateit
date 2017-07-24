import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      activeIndex: 0,
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }
  handleItemClick(index) {
    this.state.activeIndex === index
      ? this.setState({ activeIndex: null })
      : this.setState({ activeIndex: index });
  }
  render() {
    const items = [
      {
        text: 'Add User',
        icon: 'fa fa-users',
      },
      {
        text: 'Settings',
        icon: 'fa fa-cog',
      },
    ];
    return (
      <div className={styles.navbar}>
        <div className={styles.navbar__title}>
          <i className={`${styles.navbar__title_btn} fa fa-bars`} />
          <span className={styles.navbar__title_text}>Project</span>
        </div>
        <ul className={styles.navbar__list}>
          {items.map((item, index) => {
            const className = this.state.activeIndex === index ? 'open' : null;
            return (
              <li
                className={`${styles.navbar__item} ${className}`}
                key={index}
                onClick={() => this.handleItemClick(index)}
              >
                <i className={`${styles.navbar__item_icon} ${item.icon}`} />
                {item.text}
                <i
                  className={`${styles.navbar__item_toggle} fa fa-chevron-down`}
                />
                <ul className={`${className ? 'submenu-open' : null} submenu`}>
                  <li>
                    <a href="#">Javascript</a>
                  </li>
                  <li>
                    <a href="#">React</a>
                  </li>
                  <li>
                    <a href="#">Angular.js</a>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
