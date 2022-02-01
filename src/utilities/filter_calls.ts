import moment from 'moment';
import type { Call } from '../components/Calls';

type FilterProps = {
  calls: Call[];
  callsByDate: { [key: string]: Call[] };
  isGroupedByDate: boolean;
  selectedDate: string | null;
  filters: {
    call_type?: string | null;
    direction?: string | null;
  };
}

export function getCallsForFilter({ selectedDate, calls, callsByDate, filters, isGroupedByDate }: FilterProps) {
  const callsForDate = isGroupedByDate && selectedDate ? callsByDate[selectedDate] : calls;

  const filteredCalls = callsForDate.filter((call) => {
    if (filters.call_type && call.call_type !== filters.call_type) {
      return false;
    }
    if (filters.direction && call.direction !== filters.direction) {
      return false;
    }
    return true;
  });

  return filteredCalls;
}

export function groupCallsByDate(calls: Call[]) {
  const callsByDate: { [key: string]: Call[] } = {};

  calls.forEach((call) => {
    const callDay = moment(call.created_at).format('YYYY-MM-DD');
    if (callsByDate[callDay]) {
      callsByDate[callDay].push(call);
    } else {
      callsByDate[callDay] = [call];
    }
  });

  return callsByDate;
}
