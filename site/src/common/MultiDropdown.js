/* eslint-disable react/prop-types */

import React from 'react';
import Select from 'react-select';


class MultiDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.items = [];
  }

  state = {
    data: null,
  };

  handleChange = name => value => {
    this.props.onMultiDropdownChange(value);

    this.setState({
      data: value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
          <Select
            classes={classes}
            options={this.props.items}
            value={this.state.multi}
            onChange={this.handleChange('multi')}
            placeholder="Recipes"
            isMulti
          />
      </div>
    );
  }
}

export default (MultiDropdown);