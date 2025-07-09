import React, { useState } from "react";
// import Floorplan from "../components/floorplan/Floorplan";
import ReservationToolbar from "../components/Reservations/ReservationToolbar";
import ReservationTable from "../components/Reservations/TableView";
import CalendarView from "../components/Reservations/CalendarView";

const reservations = () => {
  const [view, setView] = useState("Calendar View");
  const data = [];

  return (
    <div className="">
      <div className="flex flex-col items-center justify-between mb-4">
        <ReservationToolbar view={view} setView={setView} />

        {view === "Calendar View" && (
          <div className="p-4 border border-dashed border-gray-300 w-full">
            <CalendarView events={data} />
          </div>
        )}
        {view === "List View" && (
          <div className="p-4 border-gray-300 w-full">
            <ReservationTable data={data} />
          </div>
        )}
        {view === "Floor Plan View" && "🚧 im working on it folks 🚧"}
      </div>
    </div>
  );
};

export default reservations;
