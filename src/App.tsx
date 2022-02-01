import React from 'react';
import { Tractor } from '@aircall/tractor';
import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';

import Calls from './components/Calls';
import CallView from './components/CallView';
import DateSelector from './components/DateSelector';

import type { Call } from './components/Calls';

import { groupCallsByDate, getCallsForFilter } from './utilities/filter_calls';

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
  isGroupedByDate: boolean;
  selectedDate: string | null;
  callsByDate: { [key: string]: Call[] };
  filters: {
    call_type?: string | null;
    direction?: string | null;
  };
}

type Auth = {
  access_token: string | null;
};

class App extends React.Component<AppProps, AppState> {

  private auth: Auth;
  private pusher: Pusher | null;

  constructor(props: AppProps) {
    super(props);

    this.auth = {
      access_token: null
    };

    this.pusher = null;

    this.state = {
      calls: [],
      currentlyViewingCall: null,
      isGroupedByDate: true,
      selectedDate: null,
      callsByDate: {},
      filters: {
        call_type: null,
        direction: null,
      },
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
      this.createPusherAndSubscribe();
    });
  }

  componentWillUnmount() {
    this.pusher?.disconnect();
  }

  createPusherAndSubscribe() {
    const pusher = new Pusher(PUSHER_APP_KEY, {
      authEndpoint: `${BASE_URL}${ENDPOINTS.pusher}`,
      cluster: PUSHER_APP_CLUSTER,
      auth: {
        headers: {
          Authorization: `Bearer ${this.auth.access_token}`,
        },
      },
    });

    pusher.connection.bind( 'error', (error: any) => {
      console.log('error binding pusher:', error);
    });

    const channel = pusher.subscribe('private-aircall');

    channel.bind('update-call', (callData: Call) => {
      console.log('Update call event received:', callData);

      // this.updateCallsState(callData);
    });

    this.pusher = pusher;

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

    const callsByDate = groupCallsByDate(callsData.nodes);

    this.setState({
      calls: callsData.nodes,
      callsByDate,
    });
  }

  updateCallsState(callData: Call) {
    const { calls } = this.state;

    const idx = calls.findIndex((c) => c.id === callData.id);

    const newCalls = [
      ...calls.slice(0, idx),
      callData,
      ...calls.slice(idx + 1),
    ];

    this.setState({
      calls: newCalls, currentlyViewingCall: callData,
      callsByDate: groupCallsByDate(newCalls),
    });
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
    this.updateCallsState(callData);
  }

  addNote = async (content: string, callId: string) => {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.calls}/${callId}/note`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.auth.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    const callData = await response.json();
    this.updateCallsState(callData);
  }

  toggleGroupByDate = () => {
    const { isGroupedByDate } = this.state;

    this.setState({
      isGroupedByDate: !isGroupedByDate
    });
  }

  selectDate = (date: string) => {
    // if we're selecting the same, toggle filter off
    const selectedDate = date === this.state.selectedDate ? null : date;

    this.setState({
      selectedDate
    });
  }

  handleCallType = (callType: { value: string; label: string } | null) => {
    const { filters } = this.state;

    const newFilters = {
      ...filters,
      call_type: callType?.value,
    }
    this.setState({
      filters: newFilters
    });
  }

  handleCallDirection = (direction: { value: string; label: string } | null) => {
    const { filters } = this.state;

    const newFilters = {
      ...filters,
      direction: direction?.value,
    }
    this.setState({
      filters: newFilters
    });
  }

  render() {
    const {
      calls,
      currentlyViewingCall,
      isGroupedByDate,
      selectedDate,
      callsByDate,
      filters,
    } = this.state;

    const callList = getCallsForFilter({
      selectedDate,
      calls,
      callsByDate,
      filters,
      isGroupedByDate
    });
    const dates = Object.keys(callsByDate);

    return (
      <Tractor injectStyle>
        <div className="calls-main-container">
          {isGroupedByDate && <DateSelector
            dates={dates}
            selectDate={this.selectDate}
            selectedDate={selectedDate} />}
          <Calls
            calls={callList}
            handleCallClick={this.handleCallClick}
            currentlyViewingCallId={currentlyViewingCall?.id}
            toggleGroupByDate={this.toggleGroupByDate}
            isGroupedByDate={isGroupedByDate}
            handleCallType={this.handleCallType}
            handleCallDirection={this.handleCallDirection}
          />
          <CallView
            call={currentlyViewingCall}
            toggleArchiveCall={this.toggleArchiveCall}
            addNote={this.addNote} />
        </div>
      </Tractor>
    )
  }
}

export default App;
