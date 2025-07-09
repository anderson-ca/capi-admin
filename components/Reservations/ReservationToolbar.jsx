import React, { useState, useEffect } from "react";
import { usePopUpContext } from "@/context/PopUp";
import NewReservation from "@/components/Reservations/NewReservation";

const ReservationToolbar = ({ view, setView }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { openPopUp, closePopU, isPopUpOpen } = usePopUpContext();

  const handleViewChange = (newView) => {
    setView(newView);
    setDropdownOpen(false);
  };

  useEffect(() => {
    console.log(isPopUpOpen);
  }, [isPopUpOpen]);

  return (
    <div className="flex items-center justify-between space-x-4 w-full relative z-10">
      {isPopUpOpen && <NewReservation />}
      <div className="flex flex-row items-center space-x-4">
        <button
          onClick={openPopUp}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded shadow"
        >
          + New
        </button>

        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)} // 👈 toggle
            className="inline-flex justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded"
          >
            {view}
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-44 rounded shadow bg-white ring-1 ring-black ring-opacity-5">
              {["List View", "Calendar View", "Floor Plan View"].map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    v === view ? "text-orange-600 font-semibold" : ""
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search by name, guest, date..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
        />
        <svg
          className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ReservationToolbar;
