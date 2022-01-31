import React from 'react';
import { Tractor } from '@aircall/tractor';

import Calls from './components/Calls';
import CallView from './components/CallView';

import type { Call } from './components/Calls';

import './App.css';

const BASE_URL = 'https://frontend-test-api.aircall.io';
const ENDPOINTS = {
  auth: '/auth/login',
  calls: '/calls',
  refresh_token: '/auth/refresh-token-v2',
}

interface AppProps {};
interface AppState {
  currentlyViewingCall: Call | null;
  calls: {
    nodes: Call[];
    totalCount: number;
    hasNextPage: boolean;
  }
}

type Auth = {
  access_token: string | null;
};

class App extends React.Component<AppProps, AppState> {

  private auth: Auth;

  constructor(props: AppProps) {
    super(props);

    this.auth = {
      access_token: null
    };

    this.state = {
      calls: { nodes: [], totalCount: 0, hasNextPage: false },
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

    this.setState({ calls: callsData });
  }

  handleCallClick = (call: Call) => {
    this.setState({
      currentlyViewingCall: call
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
            call={currentlyViewingCall} />
        </div>
      </Tractor>
    )
  }
}

export default App;
