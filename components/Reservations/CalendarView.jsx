"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const STATUS_COLORS = {
  confirmed: "#2563eb",
  pending: "#eab308",
  noStatus: "#6b7280",
};

export default function CalendarView() {
  const { status } = useSession(); // <-- auth state
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (status === "loading") return; // wait for auth to resolve

    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/reservations"); // adjust path
      return;
    }

    // authenticated → fetch
    (async () => {
      try {
        const res = await fetch("/api/reservation", { credentials: "include" });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const { success, reservations } = await res.json();
        if (!success) throw new Error("API failure");

        const mapped = reservations.map((r) => {
          const start = new Date(r.date);
          const [h, m] = r.time.split(":");
          start.setHours(+h, +m);

          const end = new Date(start);
          end.setMinutes(end.getMinutes() + 30);

          return {
            title: `${r.firstName} ${r.lastName} (${r.tableName}, ${r.guestNumber} guests)`,
            start,
            end,
            status: r.status ?? "noStatus",
            resource: r,
          };
        });

        setEvents(mapped);
      } catch (err) {
        console.error("Failed to load calendar events:", err);
      }
    })();
  }, [status, router]);

  const eventPropGetter = useMemo(
    () => (event) => {
      const bg = STATUS_COLORS[event.status] ?? STATUS_COLORS.noStatus;
      return {
        style: {
          backgroundColor: bg,
          borderRadius: 6,
          border: "none",
          color: "#fff",
          padding: "2px 6px",
        },
      };
    },
    []
  );

  // While we’re figuring auth out, render nothing or a spinner
  if (status === "loading") {
    return <div className="p-4 text-sm text-gray-500">Loading…</div>;
  }
  if (status === "unauthenticated") {
    // we already redirected, but return null to avoid flashing
    return null;
  }

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month", "week", "day"]}
        onSelectEvent={setSelectedEvent}
        eventPropGetter={eventPropGetter}
        style={{ height: "100%" }}
      />

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Reservation Details
            </h2>

            <div className="text-sm space-y-2">
              <p>
                <strong>Name:</strong> {selectedEvent.resource.firstName}{" "}
                {selectedEvent.resource.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedEvent.resource.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedEvent.resource.phone}
              </p>
              <p>
                <strong>Guests:</strong> {selectedEvent.resource.guestNumber}
              </p>
              <p>
                <strong>Table:</strong> {selectedEvent.resource.tableName}
              </p>
              <p>
                <strong>Restaurant:</strong> {selectedEvent.resource.restaurant}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.resource.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {selectedEvent.resource.time}
              </p>
              {selectedEvent.resource.comment && (
                <p>
                  <strong>Comment:</strong> {selectedEvent.resource.comment}
                </p>
              )}
              <p>
                <strong>Status:</strong> {selectedEvent.resource.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
