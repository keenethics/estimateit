import React from 'react';
import Header from './Header.jsx';
import styles from './style.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <Header />
      </div>
    );
  }
}
