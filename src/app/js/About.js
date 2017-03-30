import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  Button
} from  'react-bootstrap';

class NumberList extends Component {
  render() {
    const numbers = [
      'Wisdom',
      'Searchandiser',
      'Site Reliability Engineering',
      'Finance',
      'Services',
      'Storefront'
    ];

    const listItems = numbers.map((number) => {
      return (
        <li key={number.toString()} style={{ padding: 5 }}>
          <Button>{number}</Button>
        </li>
      );
    });

    return (
      <ul style={{ listStyle: 'none' }}>
        {listItems}
      </ul>
    );
  }
}

class About extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col xsOffset={3} xs={6} mdOffset={3} md={6}>
              <NumberList />
            </Col>
          </Row>
          <br/>
        </Grid>
      </div>
    );
  }
}

export default About;
