import React, { Component } from 'react';
import '../App.css';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from  'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      pass: 'apples and more apples',
      user: 'peter.kim@groupbyinc.com'
    };
  }

  _getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  }

  render() {
    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col xsOffset={3} xs={6} mdOffset={3} md={6}>
              <form>
                <FormGroup
                  controlId="formBasicText"
                  validationState={this._getValidationState()}>
                  <ControlLabel>
                    Welcom please login
                  </ControlLabel>

                  <FormControl
                    type="text"
                    value={this.state.user}
                    placeholder="Enter text"
                    onChange={(e) => {
                      this.setState({
                        value: e.target.value
                      });
                    }}
                  />

                  <br/>

                  <FormControl
                    type="text"
                    value={this.state.pass}
                    placeholder="Enter text"
                    onChange={(e) => {
                      this.setState({
                        value: e.target.value
                      });
                    }}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </form>
              <Button bsStyle="primary" bsSize="large" block>Login</Button>
            </Col>
          </Row>
          <br/>
        </Grid>
      </div>
    );
  }
}

export default App;
