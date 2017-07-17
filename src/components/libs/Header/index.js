import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';

class Header extends React.Component {
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { isAuthenticated } = this.context;
    return (
      <div>
        <Navbar color="faded" light toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">Home</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isAuthenticated ? (
                <NavItem>
                  <NavLink href="/auth/logout">Logout</NavLink>
                </NavItem>
              ) : null}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withStyles(s)(Header);
