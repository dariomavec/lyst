import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
	
	this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  static defaultProps = {
    // Takes a list of links values and turns them into NavItems
      links: []
   };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="dark" expand="md" className="navbar-dark">
          <NavbarBrand href="/" className="nav-name"><h1>{this.props.brand}</h1></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>				
				  {this.props.links.map(function(listValue, i){
					return <NavItem key={i}> <NavLink href={listValue[1].toString()} className="nav-item"><h4>{listValue[0]}</h4></NavLink></NavItem>;
				  })}          
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}