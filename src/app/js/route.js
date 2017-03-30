import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import App from './App';
import About from './About';
import Vote from './Vote';

class AppRouter extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/vote">Vote</Link></li>
          </ul>

          <hr/>
          <Route exact path="/" component={App}/>
          <Route path="/about" component={About}/>
          <Route path="/vote" component={Vote}/>
        </div>
      </Router>
    );
  }
}

export default AppRouter;
