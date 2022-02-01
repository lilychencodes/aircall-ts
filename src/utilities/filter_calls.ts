import moment from 'moment';
import type { Call } from '../components/Calls';

type FilterProps = {
  filterKey: 'call_type' | 'is_archived';
  filterVal: string | boolean;
  calls: Call[];
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

export function filterCalls({ filterKey, filterVal, calls }: FilterProps) {
  return calls.filter((call) => call[filterKey] === filterVal);
}
