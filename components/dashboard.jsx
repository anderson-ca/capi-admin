import React, { useState } from "react";
import Image from "next/image";
import { DateRange } from "react-date-range";
import { usePopUpContext } from "../context/PopUp";
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

const dashboard = () => {
  const { openPopUp, isPopUpOpen, closePopUp } = usePopUpContext();

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
    <div className="">
      <div className="flex flex-row items-center justify-between">
        <button className="flex flex-row items-center justify-center gap-[0.8rem] bg-[#FE4901] hover:bg-[#FE4901]/80 w-[144px] h-[44px] rounded-[5px]">
          <Image src="/plus.png" alt="plus" width={12} height={12} />
          <p className="text-white text-[1rem] font-[600]">Add Widget</p>
        </button>
        <button
          onClick={() => openPopUp(true)}
          className="w-[144px] h-[44px] rounded-[5px]"
        >
          <p className="text-[#81819a] text-[1rem] font-[600]">Open Calendar</p>
        </button>

        <div
          className={`border border-[#DDDDDD] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${
            isPopUpOpen ? "absolute" : "hidden"
          }`}
        >
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

          <section className="border-t border-[#DDDDDD] flex flex-row items-center justify-end gap-[0.8rem] p-[0.5rem]">
            <button
              onClick={() => closePopUp(false)}
              className="w-[57px] h-[29px] border border-[#DDDDDD] rounded-[3px]"
            >
              <p className="text-[12px] font-[600] text-[#000000]">Cancel</p>
            </button>
            <button className="w-[57px] h-[29px] bg-[#FE4901] rounded-[3px]">
              <p className="text-[12px] font-[600] text-white">Apply</p>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
