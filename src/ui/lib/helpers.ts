import { format } from "date-fns";
import * as chrono from "chrono-node";

export const formatDateTime = (date: Date): string => format(date, "MMM d, yyyy h:mm aaa");

export const getDateTimeLocal = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm");

export const parseDateTime = (input: string | Date): Date | null => {
  if (input instanceof Date) return input;
  const parsed = chrono.parseDate(input);
  return parsed || null;
};
