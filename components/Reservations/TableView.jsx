"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

/* column definitions */
const columns = [
  { accessorKey: "id",       header: "ID" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "name",     header: "Name" },
  { accessorKey: "guests",   header: "Guest(s)" },
  { accessorKey: "table",    header: "Table" },
  { accessorKey: "status",   header: "Status" },
  { accessorKey: "user",     header: "User" },
  { accessorKey: "time",     header: "Time" },
  { accessorKey: "date",     header: "Date" },
];

/* SWR fetcher */
const fetcher = (url) =>
  fetch(url).then(async (r) => {
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error(j.message || "API error");
    return j.reservations;
  });

export default function TableView() {
  /* polling every 15 s */
  const { data: reservations, error, isLoading } = useSWR(
    "/api/reservation",
    fetcher,
    { refreshInterval: 15_000 }
  );

  /* toast only after initial render */
  const firstLoad = useRef(true);
  useEffect(() => {
    if (error) toast.error("Failed to load reservations");
    if (reservations && !firstLoad.current) {
      toast.success("Reservations updated", {
        autoClose: 800,
        toastId: "update",
      });
    }
    if (firstLoad.current && reservations) firstLoad.current = false;
  }, [error, reservations]);

  /* map DB rows -> table rows */
  const tableData = useMemo(() => {
    if (!reservations) return [];
    return reservations.map((r) => ({
      id:       r.id,
      location: r.restaurant || "—",
      name:     `${r.firstName} ${r.lastName}`,
      guests:   r.guestNumber,
      table:    r.tableName,
      status:   r.status,
      user:     r.email,
      time:     r.time,
      date:     new Date(r.date).toLocaleDateString(),
    }));
  }, [reservations]);

  /* react-table instance */
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* render */
  return (
    <>
      <ToastContainer position="top-right" theme="colored" newestOnTop />
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-center text-gray-800">
          <thead className="bg-gray-100 border-b border-gray-300">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 font-semibold cursor-pointer select-none border border-red-500"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="inline-block w-4 text-gray-500">
                      {{ asc: "▲", desc: "▼" }[header.column.getIsSorted()] || ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-gray-400 italic">
                  Loading…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-gray-400 italic">
                  There are no reservations.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
