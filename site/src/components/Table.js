import React from 'react';
import { Table } from 'reactstrap';

export default class SimpleTable extends React.Component {
  render() {
    return (
      <Table light className='table-sm table-hover'>
        <thead>
          <tr key='header'>
            {this.props.header.map((val, key) => <th key={key}>{val}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.props.rows.map((row, key) => <tr key={key}>{row.map((val, key) => <td key={key}>{val}</td>)}</tr>)}
        </tbody>
      </Table>
    );
  }
}