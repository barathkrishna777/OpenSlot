export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  title?: string;
}

export interface FreeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
}

export interface FreeSlotsRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  timezone: string; // IANA timezone for display
  workingHoursStart: string; // HH:mm
  workingHoursEnd: string; // HH:mm
  includeWeekends: boolean;
}

export interface FreeSlotsResponse {
  slots: FreeSlot[];
  eventsFound: number;
}
