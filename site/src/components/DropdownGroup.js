import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupDropdown,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const { title, items } = this.props;

    let dropdowns;
    dropdowns = [1,2,3,4].map(() => {
          return <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
          <DropdownToggle caret>
            {title ? title : 'Dropdown'}
          </DropdownToggle>
          <DropdownMenu>
          {title ? <DropdownItem header>{title}</DropdownItem> : null}
          {items.map((val, key) =>
            <DropdownItem key={key}>
                {val}
            </DropdownItem>
          )}
          </DropdownMenu>
          </Dropdown>
    })

    return (
      <div>
        <InputGroup>
          <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
            <Button>
             Submit
            </Button>
            {dropdowns}
          </InputGroupButtonDropdown>
        </InputGroup>
      </div>
    );
  }
}