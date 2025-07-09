import React from "react";
import React, { useState } from "react";
import Image from "next/image";
import { DateRange } from "react-date-range";
import {
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateSelection = () => {
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const predefinedRanges = [
    {
      label: "Today",
      range: () => ({ startDate: new Date(), endDate: new Date() }),
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: subDays(new Date(), 1),
        endDate: subDays(new Date(), 1),
      }),
    },
    {
      label: "Last 7 Days",
      range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }),
    },
    {
      label: "Last 30 Days",
      range: () => ({
        startDate: subDays(new Date(), 29),
        endDate: new Date(),
      }),
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last Month",
      range: () => {
        const lastMonth = new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        );
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
      },
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-40 mr-4">
        {predefinedRanges.map(({ label, range }) => (
          <div key={label}>
            <button
              onClick={() => setDate([{ ...range(), key: "selection" }])}
              className="block w-full text-left px-4 py-2 hover:bg-orange-100 text-sm text-gray-800"
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setDate([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={date}
      />
    </div>
  );
};

export default DateSelection;
