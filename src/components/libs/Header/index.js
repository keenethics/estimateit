import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as s from './styles.scss';


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
                <Nav>
                  <NavItem>
                    <NavLink href="/policy">Policy</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/auth/logout">Logout</NavLink>
                  </NavItem>
                </Nav>
                ) :
                <Nav>
                  <NavItem>
                    <NavLink href="/policy">Policy</NavLink>
                  </NavItem>
                </Nav>
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withStyles(s)(Header);
