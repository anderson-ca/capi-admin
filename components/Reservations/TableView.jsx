"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "guests", header: "Guest(s)" },
  { accessorKey: "table", header: "Table" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "user", header: "User" },
  { accessorKey: "time", header: "Time" },
  { accessorKey: "date", header: "Date" },
];

export default function TableView() {
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/reservation");
        const json = await res.json();

        if (!json.success) {
          throw new Error("API returned error: " + json.message);
        }

        const mapped = json.reservations.map((r) => ({
          id: r.id,
          location: r.restaurant || "—",
          name: `${r.firstName} ${r.lastName}`,
          guests: r.guestNumber,
          table: r.tableName,
          status: "Confirmed", // You can replace this later if your schema includes status
          user: r.email,
          time: r.time,
          date: new Date(r.date).toLocaleDateString(),
        }));

        setData(mapped);
      } catch (err) {
        console.error("❌ Failed to load reservations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-center text-gray-800">
        <thead className="bg-gray-100 border-b border-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 font-semibold cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  <span className="inline-block w-4 text-gray-500">
                    {{
                      asc: "▲",
                      desc: "▼",
                    }[header.column.getIsSorted()] || ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-gray-400 italic"
              >
                Loading...
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-gray-400 italic"
              >
                There are no reservations available.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
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
  );
}
