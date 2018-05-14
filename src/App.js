import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RsvpClient from './rsvp-client';

const AppHeader = (props) => {
  return (
    <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">RSVP system</h1>
        </header>
        { props.children }
      </div>
  );
};

class RsvpForm extends Component {
  constructor() {
    super();
    this.state = {
      inviteCode: ''
    };
  }

  handleCodeTextboxChange(evt) {
    this.setState({
      inviteCode: evt.target.value
    });
  }

  handleSubmit(evt) {
    this.props.useCode(this.state.inviteCode);
    evt.preventDefault();
  }

  render() {
    return (
      <div>
        <p className="App-intro">
          Enter your RSVP code:
        </p>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <input type="text" value={ this.state.inviteCode } onChange={ this.handleCodeTextboxChange.bind(this) } />
          <input type="submit" value="Use Code" />
        </form>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      inviteCode: ''
    }
  }

  useCode(inviteCode) {
    this.setState({
      inviteCode
    });

    this.loadGuests(inviteCode);
  }

  async loadGuests(inviteCode) {
    this.rsvpClient = new RsvpClient(inviteCode);
    const guests = await this.rsvpClient.getGuests();
    this.setState({
      guests
    });
  }

  render() {
    let body;

    console.log('Guests:', this.state.guests);

    if (!this.state.inviteCode) {
      body = (
        <RsvpForm useCode={ this.useCode.bind(this) } />
      );
    } else {
      body = (
        <div className="App">
          <p className="App-intro">
            Showing guests for invitation code <code>{ this.state.inviteCode }</code>
          </p>
          {
            this.state.guests && this.state.guests.map(guest =>
              (<span>{ guest.name }: { guest.status }</span>))
          }
        </div>
      )
    }

    return(
      <AppHeader>
        { body }
      </AppHeader>
    );
    
    
  }
}

export default App;
