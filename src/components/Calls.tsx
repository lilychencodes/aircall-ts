import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

import moment from 'moment';
import {
  Typography,
  CallOutboundFilled,
  CallInboundFilled,
  VoicemailOutlined,
  WarningFilled,
  TickCircleFilled,
  WarningMarkOutlined,
  CalendarOutlined,
  IconButton,
} from '@aircall/tractor';

import { COLORS } from '../constants';

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
  duration: number;
  from: string;
  to: string;
  via: string;
  is_archived: boolean;
  notes: Note[];
}

type CallsProps = {
  calls: Call[];
  currentlyViewingCallId?: string;
  handleCallClick: (call: Call) => void;
  toggleGroupByDate: () => void;
  isGroupedByDate: boolean;
  handleCallType: (data: { value: string; label: string } | null) => void;
  handleCallDirection: (data: { value: string; label: string } | null) => void;
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

function Calls({
  handleCallClick,
  calls,
  currentlyViewingCallId,
  toggleGroupByDate,
  isGroupedByDate,
  handleCallType,
  handleCallDirection,
}: CallsProps) {
  const callsPerPage = 10;
  const [currentCalls, setCurrentCalls] = useState<Call[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);

  const [itemOffset, setCallOffset] = useState<number>(0);

  useEffect(() => {
    // need to reset offset when props (like filters change).
    // Otherwise, selecting on a page and then selecting a filter will return 0 item
    let offset = itemOffset;
    const endOffset = offset + callsPerPage;

    if (offset > calls.length) {
      offset = 0;
      setCallOffset(offset);
    }

    setCurrentCalls(calls.slice(offset, endOffset));
    setPageCount(Math.ceil(calls.length / callsPerPage));
  }, [itemOffset, callsPerPage, calls]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * callsPerPage) % calls.length;
    setCallOffset(newOffset);
  };

  const callTypeOptions = [
    { value: 'answered', label: 'Answered' },
    { value: 'missed', label: 'Missed' },
    { value: 'voicemail', label: 'Voicemail' },
  ];

  const callDirectionOptions = [
    { value: 'inbound', label: 'Inbound' },
    { value: 'outbound', label: 'Outbound' },
  ];

  return (
    <>
      <div className="calls-list">
        <div className="calls-filters">
          <div className={`calls-filter-date ${isGroupedByDate && 'calls-filter-date-selected'}`}>
            <IconButton
              onClick={toggleGroupByDate}
              size={32}
              component={CalendarOutlined}
              discColor={COLORS.gray}
              color={COLORS.yellow} />
            </div>
            <Select
              placeholder='Call type'
              className='calls-select'
              options={callTypeOptions}
              isClearable={true}
              onChange={handleCallType} />
            <Select
              placeholder='Direction'
              className='calls-select'
              options={callDirectionOptions}
              isClearable={true}
              onChange={handleCallDirection} />
        </div>
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
    </>
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
          {moment(created_at).format('MMMM Do YYYY')}
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
    statusColor = COLORS.yellow;
    statusEl = <VoicemailOutlined color={statusColor} />;
  } else if (status === 'missed') {
    statusColor = COLORS.red;
    statusEl = <WarningFilled color={statusColor} />;
  } else if (status === 'answered') {
    statusColor = COLORS.green;
    statusEl = <TickCircleFilled color={statusColor} />;
  } else {
    statusColor = COLORS.yellow;
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
      <Typography fontWeight={400} fontSize={12} color={COLORS.gray}>
        {bottomCallNumber}
      </Typography>
      {via && <Typography fontWeight={400} fontSize={12} color={COLORS.gray}>Via: {via}</Typography>}
    </div>
  );
}

export default Calls;
