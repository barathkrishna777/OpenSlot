import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { fetchCalendarEvents } from "@/lib/google-calendar";
import { computeFreeSlots } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const timezone = params.get("timezone") || "America/New_York";
  const workingHoursStart = params.get("workingHoursStart") || "09:00";
  const workingHoursEnd = params.get("workingHoursEnd") || "17:00";
  const includeWeekends = params.get("includeWeekends") === "true";

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  try {
    // Get Google OAuth token from Clerk
    const client = await clerkClient();
    const tokens = await client.users.getUserOauthAccessToken(
      userId,
      "google"
    );
    const accessToken = tokens.data[0]?.token;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Google Calendar not connected. Please sign out and sign back in with Google Calendar access.",
        },
        { status: 403 }
      );
    }

    // Fetch events normalized to the user's selected timezone so that
    // event times, working hours, and free slots are all in the same timezone.
    const events = await fetchCalendarEvents(
      accessToken,
      startDate,
      endDate,
      timezone
    );

    const freeSlots = computeFreeSlots(
      events,
      { start: startDate, end: endDate },
      includeWeekends,
      workingHoursStart,
      workingHoursEnd
    );

    return NextResponse.json({
      slots: freeSlots,
      eventsFound: events.length,
    });
  } catch (err) {
    console.error("Failed to fetch calendar:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch calendar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
