"use client";
import React, { useEffect, useState, useMemo } from "react";
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
  { accessorKey: "role", header: "Role" },
  { accessorKey: "createdAt", header: "Joined" },
];

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "manager",
  });

  /* ── fetch staff list ─────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/staff");
        const j = await r.json();
        if (!j.success) throw new Error(j.message);
        setStaff(j.staff);
      } catch (e) {
        toast.error("Failed to load staff");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* ── react-table instance ─────────────────────────────── */
  const data = useMemo(() => {
    return staff.map((s) => ({
      ...s,
      name: `${s.firstName} ${s.lastName}`,
      createdAt: new Date(s.createdAt).toLocaleDateString(),
    }));
  }, [staff]);

  const table = useReactTable({
    data,
    columns: cols,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ── helpers ──────────────────────────────────────────── */
  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveStaff = async () => {
    try {
      const r = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.message);
      setStaff((prev) => [...prev, j.staff]);
      toast.success("Staff added");
      setShowModal(false);
    } catch (e) {
      toast.error(e.message || "Error saving staff");
    }
  };

  /* ── render ───────────────────────────────────────────── */
  return (
    <>
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Staff members</h1>
        <button
          onClick={() => setShowModal(true)}
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
            {isLoading ? (
              <tr>
                <td colSpan={cols.length} className="py-6 italic text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="py-6 italic text-gray-400">
                  No staff yet.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
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

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">New staff member</h2>

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

              {/* role radios */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Role</label>
                {["owner", "manager", "waiter", "delivery"].map((r) => (
                  <label key={r} className="mr-4">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={form.role === r}
                      onChange={handleInput}
                      className="mr-1"
                    />
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={saveStaff}
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
