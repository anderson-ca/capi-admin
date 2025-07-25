"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "react-toastify";

const cols = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "group", header: "Customer Group" },
  { accessorKey: "createdAt", header: "Joined" },
];

export default function CustomerManagement() {
  /* ── state ───────────────────────────── */
  const [rows, setRows] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    groupId: "",
  });

  /* ── fetch list & groups once ────────── */
  useEffect(() => {
    (async () => {
      try {
        const [cRes, gRes] = await Promise.all([
          fetch("/api/customer"),
          fetch("/api/customer-group"),
        ]);

        const { customers } = await cRes.json();
        const { groups } = await gRes.json();
        setRows(customers);
        setGroups(groups);
        if (groups.length) setForm((f) => ({ ...f, groupId: groups[0].id }));
      } catch (e) {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── memoised table data ─────────────── */
  const data = useMemo(
    () =>
      rows.map((c) => ({
        ...c,
        name: `${c.firstName} ${c.lastName}`,
        group: c.group?.name ?? "—",
        createdAt: new Date(c.createdAt).toLocaleDateString(),
      })),
    [rows]
  );

  const table = useReactTable({
    data,
    columns: cols,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ── helpers ─────────────────────────── */
  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      const r = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.message);
      setRows((prev) => [...prev, j.customer]);
      toast.success("Customer added");
      setModal(false);
      setForm((f) => ({
        ...f,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      }));
    } catch (e) {
      toast.error(e.message ?? "Error saving customer");
    }
  };

  /* ── render ──────────────────────────── */
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <button
          onClick={() => setModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          + New
        </button>
      </div>

      {/* table */}
      <div className="w-full overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-2 cursor-pointer select-none"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    <span className="ml-1 text-xs">
                      {{ asc: "▲", desc: "▼" }[h.column.getIsSorted()] || ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={cols.length} className="py-6 italic text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="py-6 italic text-gray-400">
                  There are no customers available.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setModal(false)}
              className="absolute top-2 right-4 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">New customer</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleInput}
                className="border rounded px-3 py-2"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleInput}
                className="border rounded px-3 py-2"
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInput}
                className="border rounded px-3 py-2 col-span-1 md:col-span-2"
              />
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleInput}
                className="border rounded px-3 py-2 col-span-1 md:col-span-2"
              />

              {/* group select */}
              <select
                name="groupId"
                value={form.groupId}
                onChange={handleInput}
                className="border rounded px-3 py-2 col-span-1 md:col-span-2"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={save}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
