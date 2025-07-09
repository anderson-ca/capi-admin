import React, { useEffect, useState } from "react";
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

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/reservation");
        const { success, reservations } = await res.json();

        if (!success) throw new Error("API failure");

        const mappedEvents = reservations.map((r) => {
          const startDate = new Date(r.date);
          const [hour, minute] = r.time.split(":");
          startDate.setHours(Number(hour));
          startDate.setMinutes(Number(minute));

          const endDate = new Date(startDate);
          endDate.setMinutes(endDate.getMinutes() + 30); // You can make this dynamic

          return {
            title: `${r.firstName} ${r.lastName} (${r.tableName}, ${r.guestNumber} guests)`,
            start: startDate,
            end: endDate,
            resource: r, // Keep full reservation data
          };
        });

        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to load calendar events:", err);
      }
    }

    fetchReservations();
  }, []);

  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        defaultView="month"
        onSelectEvent={(event) => setSelectedEvent(event)}
        style={{ height: "100%" }}
      />

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl font-bold"
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Reservation Details
            </h2>
            <div className="text-sm space-y-2">
              <p><strong>Name:</strong> {selectedEvent.resource.firstName} {selectedEvent.resource.lastName}</p>
              <p><strong>Email:</strong> {selectedEvent.resource.email}</p>
              <p><strong>Phone:</strong> {selectedEvent.resource.phone}</p>
              <p><strong>Guests:</strong> {selectedEvent.resource.guestNumber}</p>
              <p><strong>Table:</strong> {selectedEvent.resource.tableName}</p>
              <p><strong>Restaurant:</strong> {selectedEvent.resource.restaurant}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.resource.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedEvent.resource.time}</p>
              {selectedEvent.resource.comment && (
                <p><strong>Comment:</strong> {selectedEvent.resource.comment}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
