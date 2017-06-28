import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class RegistrationPage extends React.Component {
  handleSubmit(e) {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

/*    if (username && password && email) {
      Accounts.createUser({ username, password, email }, (err, res) => {
        if (err) alert(err.reason);
      });
    } else {
      alert('Enter credentials to register');
    }*/
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <form className={styles.form_signin}>
          <h2 className={styles.form_signin_heading}>Registration</h2>
          <input type="text" className="form-control" name="username" placeholder="Username" />
          <input type="text" className="form-control" name="email" placeholder="Email Address" />
          <input type="password" className="form-control" name="password" placeholder="Password" />
          <button className="btn btn-xs btn-danger btn-block" type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default (withStyles(styles)(RegistrationPage));
