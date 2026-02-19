import { google } from "googleapis";
import { CalendarEvent } from "./types";

export async function fetchCalendarEvents(
  accessToken: string,
  startDate: string,
  endDate: string,
  timezone: string
): Promise<CalendarEvent[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  // Expand the query window by 1 day on each side to avoid missing events
  // near midnight when the user's timezone differs significantly from UTC.
  const timeMinDate = new Date(startDate + "T00:00:00Z");
  timeMinDate.setDate(timeMinDate.getDate() - 1);
  const timeMaxDate = new Date(endDate + "T23:59:59Z");
  timeMaxDate.setDate(timeMaxDate.getDate() + 1);

  const dateFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Get all calendars the user has access to
  const calendarList = await calendar.calendarList.list();
  const calendarIds = (calendarList.data.items || []).map((c) => c.id!).filter(Boolean);

  const events: CalendarEvent[] = [];

  // Fetch events from every calendar in parallel
  const responses = await Promise.all(
    calendarIds.map((calendarId) =>
      calendar.events.list({
        calendarId,
        timeMin: timeMinDate.toISOString(),
        timeMax: timeMaxDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 2500,
      }).catch(() => null) // skip calendars we can't read
    )
  );

  for (const response of responses) {
    if (!response) continue;
    for (const item of response.data.items || []) {
      // Skip all-day events (they have date instead of dateTime)
      if (!item.start?.dateTime || !item.end?.dateTime) continue;
      // Skip cancelled/declined events
      if (item.status === "cancelled") continue;

      const start = new Date(item.start.dateTime);
      const end = new Date(item.end.dateTime);

      // Format dates/times in the user's selected timezone so that
      // computeFreeSlots and working hours all operate in the same timezone.
      events.push({
        date: dateFmt.format(start),
        startTime: timeFmt.format(start),
        endTime: timeFmt.format(end),
        title: item.summary || undefined,
      });
    }
  }

  return events;
}
