import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class SimpleDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  static defaultProps = {
      items: []
   };

  handleDropdown(e) {
    this.props.onDropdownChange(e.target.textContent);
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const { title, items } = this.props;
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {title ? title : 'Dropdown'}
        </DropdownToggle>
        <DropdownMenu>
          {title ? <DropdownItem header>{title}</DropdownItem> : null}
          {items.map((val, key) =>
            <DropdownItem key={key} onClick={this.handleDropdown}>
                {val}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}