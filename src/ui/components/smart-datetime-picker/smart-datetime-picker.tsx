// components/SmartDatetimePicker.tsx
import { useState, useRef } from "react";
import { DateTimeLocalInput } from "./components/date-time-local-input/datetime-local-input";
import { NaturalLanguageInput } from "./components/natural-language-input/natural-language-input";
import classes from "./smart-datetime-picker.module.css";
import { CalendarIcon } from "@/assets/icons";

type SmartDatetimePickerProps = {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
};

export const SmartDatetimePicker = ({ date, onDateChange }: SmartDatetimePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className={classes.container} ref={containerRef}>
      <NaturalLanguageInput date={date} onDateChange={onDateChange} />
      <button
        type="button"
        className={classes.calendarButton}
        onClick={toggleDatePicker}
        title="Toggle calendar picker"
      >
        <CalendarIcon className={classes.calendarIcon} />
      </button>
      {showDatePicker && (
        <div className={classes.dateTimePickerContainer}>
          <DateTimeLocalInput date={date} onDateChange={onDateChange} />
        </div>
      )}
    </div>
  );
};
