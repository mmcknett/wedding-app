import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import './App.css';
import RsvpClient from './rsvp-client';

const AppHeader = (props) => {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <header className="App-header" style={{ alignSelf: 'stretch' }}>
          { /*<img src={logo} className="App-logo" alt="logo" />*/ }
          <h1 className="App-title">RSVP for Matt and Amy's Wedding Celebration</h1>
        </header>
        { props.children }
      </div>
  );
};

class InviteCodeForm extends Component {
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
    <div style={{ 
      display: 'flex',
      flexBasis: 'auto',
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '4px'
    }}>
      { guest.name }:&nbsp;
      <select value={ guest.status } onChange={ updateGuest } style={{ fontSize: 14 }}>
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
      inviteCode: '',
      loading: false
    }

    const cookies = new Cookies();
    const inviteCode = cookies.get('inviteCode');

    setTimeout(this.useCode.bind(this, inviteCode));
  }

  useCode(inviteCode) {
    this.setState({
      inviteCode
    });

    this.loadGuests(inviteCode);
  }

  async loadGuests(inviteCode) {
    if (inviteCode && inviteCode.length > 0) {
      this.setState({ loading: true });

      this.rsvpClient = new RsvpClient(inviteCode);
      const data = await this.rsvpClient.getRsvpData();

      if (data && data.guests) {
        const cookies = new Cookies();
        cookies.set('inviteCode', inviteCode, { path: '/' });
      }

      const newState = { 
        loading: false,
        ...data
      };

      this.setState(newState);
    }
  }

  updateGuest(index, event) {
    const status = event.target.value;

    if (status === 'no-reply') {
      return; // Force user to reply.
    }

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

  getInvitePage = () => {
    return (
      <InviteCodeForm useCode={ this.useCode.bind(this) } />
    );
  }

  getGuestListPage = () => {
    return (
      <div className="App" style={{ maxWidth: '600px', flexBasis: '60%' }}>
        <p className="App-intro">
          Your code: <code>{ this.state.inviteCode }</code>
        </p>
        {
          this.state.guests && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p>
                Please accept or decline. It is important to us to make sure we have enough seats and food for everyone.  Thanks!
              </p>
              <p>
                If you have trouble, call/text us at { this.state.contactUs.phone } or email us at <a
                href={`mailto:${ this.state.contactUs.email }`}>{ this.state.contactUs.email }</a>.
              </p>
              <p>
                Please email us about any food allergies or if we missed someone in your party.
              </p>
              <hr style={{ width: '100%' }}/>
              <form
                onSubmit={ this.submitRsvp.bind(this) }
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                {
                  this.state.guests.map((guest, index) =>
                    (<GuestBlock guest={guest} key={index} updateGuest={ this.updateGuest.bind(this, index) } />))
                }
                <input type="submit" value="Update RSVP" style={{ alignSelf: 'flex-end', marginTop: '10px' }} />
              </form>
            </div>
          )
        }
        {
          !this.state.guests && !this.state.loading && (
            <CodeError onReset={ this.useCode.bind(this, "") } />
          )
        }
        {
          this.state.loading && (
            <p>Loading guests...</p>
          )
        }
        {
          this.state.message && (
            <div style={{ marginTop: '10px' }}>{ this.state.message }</div>
          )
        }
        <hr />
        <p>
          Want us to email you if there are changes?&nbsp;
          <a
            href="http://gem.godaddy.com/signups/0bfd1c69e158471883f0e5b70d04bbbf/join"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up for updates.
          </a>
        </p>
      </div>
    );
  }

  render() {
    let body;

    console.log('Guests:', this.state.guests);

    if (!this.state.inviteCode) {
      body = this.getInvitePage();
    } else {
      body = this.getGuestListPage();
    }

    return (
      <AppHeader>
        { body }
      </AppHeader>
    );
  }
}

export default App;
