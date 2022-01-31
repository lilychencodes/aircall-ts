import { useCallback } from 'react';
import {
  Button,
  IconButton,
  Typography,
  CallOutboundFilled,
  CallInboundFilled,
  NotesOutlined,
} from '@aircall/tractor';
import moment from 'moment';

import type { Call } from './Calls';

import { CallStatus, CallToFrom } from './Calls';

import './CallView.css';

const humanizeDuration = require('humanize-duration');

interface CallViewProps {
  call: Call | null;
  toggleArchiveCall: (call: Call) => void;
}

function CallView({ call, toggleArchiveCall }: CallViewProps) {
  const toggleArchiveCb = useCallback(
    (_event) => {
      if (call) toggleArchiveCall(call);
    },
    [call, toggleArchiveCall],
  );

  if (!call) {
    return (
      <div className="call-view-panel">
        <Typography>Not currently viewing any call</Typography>
      </div>
    )
  }

  const {
    call_type,
    created_at,
    direction,
    duration,
    from,
    to,
    via,
    notes,
    is_archived,
  } = call;

  const textEl = is_archived ? (<Typography>This call is archived</Typography>) : null;
  const isOutbound = direction === 'outbound';

  const durationInMs = parseInt(duration) * 1000;
  const callTime = humanizeDuration(durationInMs);

  const grayText = 'rgb(112,116,121)';

  return (
    <div className="call-view-panel">
      <div className="call-view-header">
        <div className="call-view-header-text">{textEl}</div>
        <Button variant="destructive" mode="outline" onClick={toggleArchiveCb}>
          {is_archived ? 'Unarchive' : 'Archive'}
        </Button>
      </div>
      <Typography textAlign="center" variant="subheading">
        Summary
      </Typography>
      <div className="calls-view-summary">
        <CallStatus
          showText={true}
          status={call_type} />
        <CallToFrom
          to={to}
          from={from}
          direction={direction}
          via={via} />
        {isOutbound ? <CallOutboundFilled /> : <CallInboundFilled />}
      </div>
      <div className="calls-view-summary">
        <div className="call-time-stat">
          <Typography
            textAlign="center"
            fontSize={12}
            color={grayText}>
            Created on
          </Typography>
          <Typography fontWeight={400}>
            {moment(created_at).format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
        </div>
        <div className="call-time-stat">
          <Typography
            textAlign="center"
            fontSize={12}
            color={grayText}>
            Lasted for
          </Typography>
          <Typography fontWeight={400}>{callTime}</Typography>
        </div>
      </div>
      <div className="notes-container">
        <Typography textAlign="center" variant="subheading">
          Notes
        </Typography>
        {false && <div className="add-note-icon">
          <IconButton
            size={32}
            component={NotesOutlined}
            color="yellow.base"
            onClick={() => {}} />
        </div>}
      </div>
      <div className="call-notes">
        {notes.length < 1 && <Typography textAlign="center" color={grayText}>
          No note created for this call
        </Typography>}
        {notes.map((note) => (
          <div className="call-note" key={note.id}>
            <Typography fontWeight={400}>{note.content}</Typography>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CallView;
