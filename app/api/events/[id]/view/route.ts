import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { incrementClickCount } from "@/lib/data/events";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  
  // Get existing viewed events from cookie
  const viewedEventsCookie = cookieStore.get("viewed_events");
  const viewedEvents = viewedEventsCookie ? viewedEventsCookie.value.split(",") : [];

  if (viewedEvents.includes(id)) {
    // Already viewed, no need to increment
    return NextResponse.json({ success: true, incremented: false });
  }

  // Increment the count in DB
  try {
    await incrementClickCount(id);
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }

  // Add the new id to the cookie
  // Keep last 20 to avoid large cookies
  const newViewedEvents = [...viewedEvents, id].slice(-20); 
  cookieStore.set("viewed_events", newViewedEvents.join(","), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ success: true, incremented: true });
}
