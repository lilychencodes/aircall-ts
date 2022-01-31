import React from 'react';
import { Tractor } from '@aircall/tractor';
import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';

import Calls from './components/Calls';
import CallView from './components/CallView';

import type { Call } from './components/Calls';

import './App.css';

const BASE_URL = 'https://frontend-test-api.aircall.io';
const ENDPOINTS = {
  auth: '/auth/login',
  calls: '/calls',
  refresh_token: '/auth/refresh-token-v2',
  pusher: '/pusher/auth',
}

const PUSHER_APP_KEY = 'd44e3d910d38a928e0be';
const PUSHER_APP_CLUSTER = 'eu';

interface AppProps {};
interface AppState {
  currentlyViewingCall: Call | null;
  calls: Call[];
}

type Auth = {
  access_token: string | null;
};

class App extends React.Component<AppProps, AppState> {

  private auth: Auth;
  // private pusher: Pusher;

  constructor(props: AppProps) {
    super(props);

    this.auth = {
      access_token: null
    };

    // this.pusher = this.createPusherAndSubscribe();

    this.state = {
      calls: [],
      currentlyViewingCall: null,
    };
  }

  componentDidMount() {
    this.authenticate().then(async (auth) => {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.refresh_token}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.refresh_token}`
        }
      });
      const authData = await response.json();
      this.auth = { access_token: authData.access_token };
      this.fetchPhoneCalls();
    });
  }

  componentWillUnmount() {
    // this.pusher.disconnect();
  }

  createPusherAndSubscribe() {
    const pusher = new Pusher(PUSHER_APP_KEY, {
      authEndpoint: `${BASE_URL}${ENDPOINTS.pusher}`,
      cluster: PUSHER_APP_CLUSTER
    });

    pusher.connection.bind( 'error', (error: any) => {
      console.log('error binding pusher:', error);
    });

    const channel = pusher.subscribe('private-aircall');

    console.log('channel:', channel)
    channel.bind('update-call', (callData: Call) => {
      console.log('Update call event received:', callData);
    });

    return pusher;
  }

  authenticate = async () => {
    const creds = {
      username: 'lily',
      password: '123',
    };
    const response = await fetch(`${BASE_URL}${ENDPOINTS.auth}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds),
    });
    const auth = await response.json();
    return auth;
  }

  fetchPhoneCalls = async () => {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.calls}?limit=200`, {
      headers: {
        Authorization: `Bearer ${this.auth.access_token}`
      }
    });
    const callsData = await response.json();

    this.setState({ calls: callsData.nodes });
  }

  handleCallClick = (call: Call) => {
    this.setState({
      currentlyViewingCall: call
    });
  }

  toggleArchiveCall = async (call: Call) => {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.calls}/${call.id}/archive`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.auth.access_token}`
      }
    });
    const callData = await response.json();

    const { calls } = this.state;

    // NOTE: this is too inefficient to use for a real production application.
    const idx = calls.findIndex((c) => c.id === call.id);

    const newCalls = [
      ...calls.slice(0, idx),
      callData,
      ...calls.slice(idx + 1),
    ];

    this.setState({
      calls: newCalls, currentlyViewingCall: callData
    });
  }

  render() {
    const { calls, currentlyViewingCall } = this.state;

    return (
      <Tractor injectStyle>
        <div className="calls-main-container">
          <Calls
            calls={calls}
            handleCallClick={this.handleCallClick}
            currentlyViewingCallId={currentlyViewingCall?.id}
          />
          <CallView
            call={currentlyViewingCall}
            toggleArchiveCall={this.toggleArchiveCall} />
        </div>
      </Tractor>
    )
  }
}

export default App;
