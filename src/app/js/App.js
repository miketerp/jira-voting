import React, { Component } from 'react';
import '../App.css';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'helloes!'
    };
  }

  _handleChange() {
    return 'derp';
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">

          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <form>
            <FormGroup controlId="formBasicText" >
              <ControlLabel>Working example with validation</ControlLabel>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="Enter text"
                onChange={this._handleChange}
              />
              <FormControl.Feedback />
              <HelpBlock>Validation is based on string length.</HelpBlock>
            </FormGroup>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
