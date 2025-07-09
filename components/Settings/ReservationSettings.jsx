"use client";

import { useState } from "react";

export default function ReservationSettings() {
  const [emailAlerts, setEmailAlerts] = useState({
    customer: true,
    restaurant: true,
    location: true,
  });

  const [statuses, setStatuses] = useState({
    default: "Pending",
    confirmed: "Confirmed",
    canceled: "Canceled",
  });

  const reservationStatusOptions = ["Pending", "Confirmed", "Canceled"];

  const toggleEmail = (key) => {
    setEmailAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStatusChange = (key, value) => {
    setStatuses((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log({ emailAlerts, statuses });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow-md space-y-6"
    >
      <h2 className="text-lg font-semibold">
        Send Reservation Confirmation/Alert Email
      </h2>
      <div className="flex flex-wrap gap-2">
        {["customer", "restaurant", "location"].map((key) => (
          <button
            type="button"
            key={key}
            className={`px-4 py-1 rounded border text-sm font-medium ${
              emailAlerts[key]
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            onClick={() => toggleEmail(key)}
          >
            To {key}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Send a confirmation mail to the customer, admin and/or location email
        when a new reservation is received
      </p>

      <div className="space-y-4">
        <div>
          <label className="block font-medium text-sm mb-1">
            Default Reservation Status
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={statuses.default}
            onChange={(e) => handleStatusChange("default", e.target.value)}
          >
            {reservationStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the default reservation status when a new reservation is
            received
          </p>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">
            Confirmed Reservation Status
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={statuses.confirmed}
            onChange={(e) => handleStatusChange("confirmed", e.target.value)}
          >
            {reservationStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the reservation status when a reservation is confirmed and
            table marked as reserved
          </p>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">
            Canceled Reservation Status
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={statuses.canceled}
            onChange={(e) => handleStatusChange("canceled", e.target.value)}
          >
            {reservationStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the reservation status when a reservation is marked as
            canceled or suspected of fraudulent activity
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600"
      >
        Save
      </button>
    </form>
  );
}
