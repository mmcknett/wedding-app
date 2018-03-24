import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">RSVP system</h1>
        </header>
        <p className="App-intro">
          Enter your RSVP code:
        </p>
        <form method="post">
          <input type="text" />
          <input type="submit" value="Use" />
        </form>
      </div>
    );
  }
}

export default App;
