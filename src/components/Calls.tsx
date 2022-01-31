import moment from 'moment';
import {
  Typography,
  CallOutboundFilled,
  CallInboundFilled,
  VoicemailOutlined,
  WarningFilled,
  TickCircleFilled,
  WarningMarkOutlined,
} from '@aircall/tractor';

import './Calls.css';

type Note = {
  id: string;
  content: string;
}

export type Call = {
  id: string;
  call_type: string;
  created_at: string;
  direction: string;
  duration: string;
  from: string;
  to: string;
  via: string;
  is_archived: string;
  notes: Note[];
}

type CallsProps = {
  calls: {
    nodes: Call[];
    hasNextPage: boolean;
    totalCount: number;
  };
  currentlyViewingCallId?: string;
  handleCallClick: (call: Call) => void;
}

type CallListViewProps = {
  call: Call;
  handleCallClick: (call: Call) => void;
  currentlyViewingCallId?: string;
}

function Calls({ handleCallClick, calls, currentlyViewingCallId }: CallsProps) {

  return (
    <div className="calls-list">
      {calls.nodes.map((call) => (
        <CallListView
          key={call.id}
          call={call}
          currentlyViewingCallId={currentlyViewingCallId}
          handleCallClick={handleCallClick} />
      ))}
    </div>
  );
}

function CallListView({ call, handleCallClick, currentlyViewingCallId }: CallListViewProps) {
  const {
    call_type,
    created_at,
    direction,
    duration,
    from,
    to,
    is_archived,
  } = call;

  const isOutbound = direction === 'outbound';
  const isViewing = call.id === currentlyViewingCallId;

  return (
    <div
      className={`call-list-view ${isViewing && 'call-list-view-viewing'}`}
      onClick={() => handleCallClick(call)}>
      <div className="call-info">
        <CallStatus
          status={call_type}
          showText={false} />
        <CallToFrom
          from={from}
          to={to}
          direction={direction} />
        <Typography fontWeight={400}>
          {moment(created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Typography>
        {isOutbound ? <CallOutboundFilled /> : <CallInboundFilled />}
        {is_archived && <div className="archived">archived</div>}
      </div>
    </div>
  );
}

export function CallStatus({ status, showText }: { status: string, showText: boolean }) {
  let statusEl;
  let statusColor;
  if (status === 'voicemail') {
    statusColor = 'rgb(252, 187, 38)';
    statusEl = <VoicemailOutlined color={statusColor} />;
  } else if (status === 'missed') {
    statusColor = 'rgb(255, 92, 57)';
    statusEl = <WarningFilled color={statusColor} />;
  } else if (status === 'answered') {
    statusColor = 'rgb(0, 179, 136)';
    statusEl = <TickCircleFilled color={statusColor} />;
  } else {
    statusColor = 'rgb(252, 187, 38)';
    statusEl = <WarningMarkOutlined color={statusColor} />;
  }

  return (
    <div className="call-status">
      {statusEl}
      {showText && <Typography fontWeight={400} fontSize={11} color={statusColor}>{status}</Typography>}
    </div>
  )
}

export function CallToFrom({ to, from, via, direction }: { to: string; from: string; via?: string; direction: string }) {
  const isOutbound = direction === 'outbound';

  const topCallNumber = isOutbound ? `To: ${to}` : `From: ${from}`;
  const bottomCallNumber = isOutbound ? `From: ${from}` : `To: ${to}`;

  return (
    <div className="call-to-from">
      <Typography fontWeight={500}>
        {topCallNumber}
      </Typography>
      <Typography fontWeight={400} fontSize={12} color='rgb(112, 116, 121)'>
        {bottomCallNumber}
      </Typography>
      {via && <Typography fontWeight={400} fontSize={12} color='rgb(112, 116, 121)'>Via: {via}</Typography>}
    </div>
  );
}

export default Calls;
