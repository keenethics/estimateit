import React from 'react';

export default class LoginPage extends React.Component {
  constructor() {
    super();
    this.handleFocus = this.handleFocus.bind(this);
    this.state = {
      focus: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const login = e.target.nameOrEmail.value;
    const password = e.target.password.value;

    // if (login && password) {
    //   Meteor.loginWithPassword(login, password, (err) => {
    //     if (err) {
    //       alert('Password incorrect', err.message);
    //     }
    //   });
    // } else {
    //   alert('Enter usename and/or email to authorize');
    // }
  }


  render() {
    return (
      <div className="wrapper">
        <form className="form-signin">
          <h2 className="form-signin-heading">Please login</h2>
          <input type="text" className="form-control" name="username" placeholder="Email Address" />
          <input type="password" className="form-control" name="password" placeholder="Password" />
          <label className="checkbox">
            <input type="checkbox" value="remember-me" id="rememberMe" name="rememberMe"> Remember me</input>
          </label>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
        </form>
      </div>
    );
  }
}
