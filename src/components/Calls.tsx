import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

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
  calls: Call[];
  currentlyViewingCallId?: string;
  handleCallClick: (call: Call) => void;
}

type CallListProps = {
  currentCalls: Call[];
  handleCallClick: (call: Call) => void;
  currentlyViewingCallId?: string;
}

type CallListViewProps = {
  call: Call;
  handleCallClick: (call: Call) => void;
  currentlyViewingCallId?: string;
}

function Calls({ handleCallClick, calls, currentlyViewingCallId }: CallsProps) {
  const callsPerPage = 10;
  const [currentCalls, setCurrentCalls] = useState<Call[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setCallOffset] = useState<number>(0);

  useEffect(() => {
    // Fetch calls from another resources.
    const endOffset = itemOffset + callsPerPage;
    setCurrentCalls(calls.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(calls.length / callsPerPage));
  }, [itemOffset, callsPerPage, calls]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * callsPerPage) % calls.length;
    setCallOffset(newOffset);
  };

  return (
    <div className="calls-list">
      <ReactPaginate
        containerClassName="calls-pagination"
        pageClassName="calls-pagination-li"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={() => null}
      />
      <CallList
        currentCalls={currentCalls}
        handleCallClick={handleCallClick}
        currentlyViewingCallId={currentlyViewingCallId} />
    </div>
  );
}

function CallList({ currentCalls, handleCallClick, currentlyViewingCallId }: CallListProps) {
  return (
    <>
      {currentCalls.map((call) => (
        <CallListView
          key={call.id}
          call={call}
          handleCallClick={handleCallClick}
          currentlyViewingCallId={currentlyViewingCallId} />
      ))}
    </>
  )
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
