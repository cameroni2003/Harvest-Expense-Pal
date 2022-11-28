import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import dateFormat from 'date-fns/format';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  name: string;
  label: string;
}

function DateComponent({name, label}: Props) {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div className="my-4">
      <label className="mb-1 block text-2xl font-bold text-slate-200">{label}</label>
      <DatePicker
        selected={date}
        onChange={date => setDate(date ?? new Date())}
        maxDate={new Date()}
      />
      <input name={name} type="hidden" value={dateFormat(date, 'yyyy-MM-dd')} />
    </div>
  );
}

export default DateComponent;
