import React, { useEffect, useMemo } from "react";
import * as chrono from "chrono-node";
import { formatDateTime } from "@/lib/helpers";
import classes from "./date-suggestions.module.css";

interface DateSuggestionsProps {
  input: string;
  onSelect: (date: Date) => void;
  selectedIndex: number;
  onSuggestionsChange: (suggestions: Array<{ text: string; date: Date }>) => void;
}

export const DateSuggestions = ({ input, onSelect, selectedIndex, onSuggestionsChange }: DateSuggestionsProps) => {
  const defaultSuggestions = [
    "today",
    "tomorrow",
    "next week",
    "in 2 hours",
    "in 30 minutes",
    "next Friday at 3pm",
    "2 days from now",
    "next month",
    "end of week",
    "next Monday at 9am",
  ];

  // Memoize filtered suggestions to prevent infinite loops
  const filteredSuggestions = useMemo(() => {
    const suggestions = [
      input,
      ...defaultSuggestions.filter((text) => text.toLowerCase().includes(input.toLowerCase())),
    ]
      .map((text) => {
        const parsed = chrono.parseDate(text);
        return parsed ? { text, date: parsed } : null;
      })
      .filter((item): item is { text: string; date: Date } => item !== null);

    return suggestions;
  }, [input]);

  useEffect(() => {
    onSuggestionsChange(filteredSuggestions);
  }, [filteredSuggestions, onSuggestionsChange]);

  if (filteredSuggestions.length === 0) return null;

  return (
    <div className={classes.suggestionsContainer}>
      {filteredSuggestions.map(({ text, date }, index) => (
        <span
          key={index}
          onClick={() => onSelect(date)}
          className={`${classes.suggestionItem} ${selectedIndex === index ? classes.selected : ""}`}
        >
          <span>{text}</span>
          <span className={classes.datePreview}>{formatDateTime(date)}</span>
        </span>
      ))}
    </div>
  );
};
