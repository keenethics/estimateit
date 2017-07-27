import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class Item extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      activeIndex: false,
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick() {
    this.setState({ activeIndex: !this.state.activeIndex });
  }

  render() {
    const { text, icon, link, linkText } = this.props;
    const className = this.state.activeIndex ? 'open' : null;
    return (
      <li className={`${styles.navbar__item} ${className}`}>
        <i className={`${styles.navbar__item_icon} fa fa-${icon}`} />
        {link
          ? <a href={link}>{text}</a>
          : <div>
            {text}
              <i
                onClick={this.handleItemClick}
                className={`${styles.navbar__item_toggle} fa fa-chevron-down`}
              />
              <div className={`${className ? 'submenu-open' : null} submenu`}>
                {this.props.children}
              </div>
            </div>}
      </li>
    );
  }
}

export default withStyles(styles)(Item);
