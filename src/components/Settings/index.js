import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  render() {
    return (
      <div className={styles.form_signin}>
        <div className={styles.wrapper}>
          <h2 className={styles.form_signin_heading}>Settings</h2>
          <form action="">
            <input
              type="password"
              className="form-control"
              name="passwordOld"
              placeholder="Old Password"
            />
            <input
              type="password"
              className="form-control"
              name="passwordNew"
              placeholder="New Password"
            />
            <button className="btn btn-xs btn-danger btn-block" type="submit">
              Change password
            </button>
            <span className="text-warning">{this.state.error}</span>
          </form>
          <a className="btn btn-xs btn-primary btn-block" href="/auth/google">Sign In with Google</a>
          <a className="btn btn-xs btn-primary btn-block" href="/auth/logout">Logout</a>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Settings);
