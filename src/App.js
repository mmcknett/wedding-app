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

const CodeError = (props) => {
  return (
    <div>
      <p className="App-intro">
        There are no guests for this code.
      </p>
      <button onClick={ props.onReset }>Try Again</button>
    </div>
  );
};

const GuestBlock = (props) => {
  const { guest, updateGuest } = props;

  return (
    <div>
      { guest.name }:
      <select value={ guest.status } onChange={ updateGuest }>
        <option value='attending'>Attending</option>
        <option value='declined'>Unable to attend</option>
        <option value='no-reply'>Not yet replied</option>
      </select>
    </div>
  );
};

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
    if (inviteCode && inviteCode.length > 0) {
      this.rsvpClient = new RsvpClient(inviteCode);
      const guests = await this.rsvpClient.getGuests();
      this.setState({
        guests
      });
    }
  }

  updateGuest(index, event) {
    const status = event.target.value;
    const guests = this.state.guests.slice();
    guests[index].status = status;
    this.setState({
      guests
    });
  }

  submitRsvp(event) {
    if (this.rsvpClient && this.state.guests) {
      this.rsvpClient.rsvp(this.state.guests);
      this.setState({
        message: 'RSVP submitted!'
      })
    }
    event.preventDefault();
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
            Guests (invitation code <code>{ this.state.inviteCode }</code>)
          </p>
          <form onSubmit={ this.submitRsvp.bind(this) }>
          {
            this.state.guests && this.state.guests.map((guest, index) =>
              (<GuestBlock guest={guest} key={index} updateGuest={ this.updateGuest.bind(this, index) } />))
          }
          <input type="submit" value="Update RSVP" />
          </form>
          {
            !this.state.guests && (
              <CodeError onReset={ this.useCode.bind(this, "") } />
            )
          }
          {
            this.state.message && (
              <div>{ this.state.message }</div>
            )
          }
        </div>
      )
    }

    return (
      <AppHeader>
        { body }
      </AppHeader>
    );
    
    
  }
}

export default App;
