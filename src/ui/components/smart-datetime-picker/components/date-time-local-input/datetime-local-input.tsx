import { ChangeEvent, useEffect, useRef } from "react";
import { getDateTimeLocal } from "@/lib/helpers";
import classes from "./datetime-local-input.module.css";

interface DateTimeLocalInputProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
}

export const DateTimeLocalInput = ({ date, onDateChange }: DateTimeLocalInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the input when it appears
    inputRef.current?.focus();

    // Add click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".calendarButton") // Don't close if clicking the calendar button
      ) {
        onDateChange(date); // Keep the current date
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [date, onDateChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate);
      }
    }
  };

  return (
    <div className={classes.popover} ref={popoverRef}>
      <input
        ref={inputRef}
        type="datetime-local"
        value={date ? getDateTimeLocal(date) : ""}
        onChange={handleChange}
        className={classes.input}
        min={getDateTimeLocal(new Date())}
      />
    </div>
  );
};
