import React, { useState } from "react";
import DatePicker from "react-datepicker";
import dateFormat from "date-fns/format";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    name: string
}

function DateComponent({ name }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div>
      <DatePicker
        selected={date}
              onChange={(date) => setDate(date ?? new Date())}
              maxDate={new Date()}
      />
      <input
        name={name}
        type="hidden"
        value={dateFormat(date, "yyyy-MM-dd")}
          />
    </div>
  );
}

export default DateComponent;
