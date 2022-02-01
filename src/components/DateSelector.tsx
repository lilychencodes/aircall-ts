import moment from 'moment';
import { Typography } from '@aircall/tractor';

import './DateSelector.css';

type DateSelectorProps = {
  selectDate: (date: string) => void;
  dates: string[];
  selectedDate: string | null;
}

function DateSelector({ selectDate, dates, selectedDate }: DateSelectorProps) {
  const sortedDate = dates.sort();
  return (
    <div className="date-selector">
      <Typography>Call Dates</Typography>
      {sortedDate.map((date) => {
        const isSelected = moment(date).isSame(selectedDate, 'day');
        return (
          <div
            key={date}
            className={`date-item ${isSelected && 'date-item-selected'}`}
            onClick={() => selectDate(date)}>
            {moment(date).format('DD MM YY')}
          </div>
        )
      })}
    </div>
  )
}

export default DateSelector;
