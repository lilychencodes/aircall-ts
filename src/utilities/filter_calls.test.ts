import moment from 'moment';

import { getCallsForFilter, groupCallsByDate } from './filter_calls';
import type { Call } from '../components/Calls';

const date1 = new Date('December 31, 2021 19:15:40').toISOString();
const date2 = new Date('January 2, 2022 22:15:54').toISOString();
const date3 = new Date('January 5, 2022 09:15:20').toISOString();

function makeCallObject(date: string, params: any): Call {
  return {
    id: params.id || '1a',
    call_type: params.call_type || 'answered',
    created_at: date,
    direction: params.direction || 'inbound',
    duration: 123,
    from: '+1 000 000 000',
    to: '+1 000 000 000',
    via: '+1 000 000 000',
    is_archived: false,
    notes: [],
  }
}

function mockCalls() {
  const calls = [];

  calls.push(makeCallObject(date1, { call_type: 'answered', direction: 'outbound' }));
  calls.push(makeCallObject(date1, { call_type: 'missed', direction: 'inbound' }));
  calls.push(makeCallObject(date2, { call_type: 'answered', direction: 'inbound' }));
  calls.push(makeCallObject(date3, { call_type: 'missed', direction: 'inbound' }));

  return calls;
}

const calls = mockCalls();
const callsByDate = groupCallsByDate(calls);

describe('groupCallsByDate', () => {
  it('group calls as a list by date with date as key', () => {
    const result = groupCallsByDate(calls);
    expect(Object.keys(result).length).toBe(3);
  });
});

describe('getCallsForFilter', () => {
  const params = {
    calls,
    callsByDate,
    filters: {},
    isGroupedByDate: false,
    selectedDate: null,
  }

  it('works when there are no filters', () => {
    const result = getCallsForFilter(params);
    expect(result.length).toBe(4);
  });

  it('works for date as a filter', () => {
    const isGroupedByDate = true;
    const selectedDate = moment(date1).format('YYYY-MM-DD');

    const filters = {
      ...params,
      isGroupedByDate,
      selectedDate,
    };

    const result = getCallsForFilter(filters);

    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('created_at', date1);
    expect(result[1]).toHaveProperty('created_at', date1);
  });

  it('works for date and non date filters', () => {
    const isGroupedByDate = true;
    const selectedDate = moment(date1).format('YYYY-MM-DD');

    const filters = {
      ...params,
      isGroupedByDate,
      selectedDate,
      filters: {
        call_type: 'missed',
        direction: 'inbound',
      }
    };

    const result = getCallsForFilter(filters);

    expect(result.length).toBe(1);
  });

  it('works for non date filters only', () => {
    const filters = {
      ...params,
      filters: {
        call_type: 'missed',
        direction: 'inbound',
      }
    };

    const result = getCallsForFilter(filters);

    expect(result.length).toBe(2);
  });
});
