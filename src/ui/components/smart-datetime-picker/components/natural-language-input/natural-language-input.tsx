// components/NaturalLanguageInput.tsx
import React, { useRef, useState, useEffect } from "react";
import { formatDateTime, parseDateTime } from "@/lib/helpers";
import { DateSuggestions } from "../date-suggestions/date-suggestions";
import classes from "./natural-language-input.module.css";

interface NaturalLanguageInputProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
}

export const NaturalLanguageInput = ({ date, onDateChange }: NaturalLanguageInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(date ? formatDateTime(date) : "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<Array<{ text: string; date: Date }>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setSelectedIndex(-1);

    // Try to parse date as user types
    const parsedDate = parseDateTime(value);
    onDateChange(parsedDate);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding suggestions to allow clicking them
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 500);

    if (e.target.value.length > 0) {
      const parsedDate = parseDateTime(e.target.value);
      if (parsedDate) {
        onDateChange(parsedDate);
        setInputValue(formatDateTime(parsedDate));
      }
    }
  };

  const handleShowSuggestions = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (selectedDate: Date) => {
    onDateChange(selectedDate);
    setInputValue(formatDateTime(selectedDate));
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex].date);
        } else if (inputValue) {
          const parsedDate = parseDateTime(inputValue);
          if (parsedDate) {
            onDateChange(parsedDate);
            setInputValue(formatDateTime(parsedDate));
            setShowSuggestions(false);
          }
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={classes.container}>
      <input
        ref={inputRef}
        type="text"
        placeholder='e.g. "tomorrow at 5pm", "next Friday 3pm"'
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleShowSuggestions}
        onClick={handleShowSuggestions}
        className={classes.input}
      />
      {showSuggestions && (
        <DateSuggestions
          input={inputValue}
          onSelect={handleSuggestionSelect}
          selectedIndex={selectedIndex}
          onSuggestionsChange={setSuggestions}
        />
      )}
    </div>
  );
};
