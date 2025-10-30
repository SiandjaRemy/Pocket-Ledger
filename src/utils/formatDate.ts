export type DateFormatStyle =
  | "short"
  | "medium"
  | "long"
  | "numeric"
  | "custom";
export type TimeFormatStyle =
  | "short"
  | "medium"
  | "long"
  | "withSeconds"
  | "12h"
  | "24h";

export const formatDate = (
  dateString: string,
  style: DateFormatStyle = "medium"
) => {
  const date = new Date(dateString);

  const optionsMap: Record<DateFormatStyle, Intl.DateTimeFormatOptions> = {
    short: { month: "short", day: "numeric", year: "numeric" },
    medium: {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
    long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    numeric: { day: "2-digit", month: "2-digit", year: "numeric" },
    custom: { month: "short", day: "2-digit" },
  };

  return date.toLocaleDateString("en-US", optionsMap[style]);
};

export const formatTime = (
  dateString: string,
  style: TimeFormatStyle = "medium"
) => {
  const date = new Date(dateString);

  const optionsMap: Record<TimeFormatStyle, Intl.DateTimeFormatOptions> = {
    short: { hour: "2-digit", minute: "2-digit" },
    medium: { hour: "2-digit", minute: "2-digit", hour12: true },
    long: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
    withSeconds: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    },
    "12h": { hour: "numeric", minute: "2-digit", hour12: true },
    "24h": { hour: "2-digit", minute: "2-digit", hour12: false },
  };

  return date.toLocaleTimeString("en-US", optionsMap[style]);
};
