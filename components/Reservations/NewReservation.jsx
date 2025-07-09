import React, { useState } from "react";
import { usePopUpContext } from "../../context/PopUp";
import { z } from "zod";

const reservationSchema = z.object({
  tableId: z.string().min(1, "Table is required"),
  guestNumber: z.coerce.number().min(1, "Guest number is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  restaurantId: z.string().min(1, "Restaurant is required"),
  comment: z.string().optional(),
  customer: z.string().optional(),
  confirm: z.boolean().optional(),
});

const NewReservation = () => {
  const { closePopUp } = usePopUpContext();

  const [formData, setFormData] = useState({
    tableId: "",
    guestNumber: 0,
    date: "",
    time: "",
    customer: "Guest",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    restaurantId: "",
    comment: "",
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = reservationSchema.safeParse(formData);

    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      setErrors(zodErrors);
      return;
    }

    setErrors({});

    const payload = {
      tableId: formData?.tableId,
      guestNumber: Number(formData?.guestNumber),
      date: formData?.date,
      time: formData?.time,
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email,
      phone: formData?.phone,
      restaurantId: formData?.restaurantId,
      comment: formData?.comment,
    };

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error:", text);
        alert("Failed: " + text);
        return;
      }

      const data = await res.json();

      console.log("✅ Reservation created:", data);
      closePopUp();
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-xl relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
          onClick={closePopUp}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-orange-600">
          New Reservation
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          {/* Table */}
          <div>
            <label className="block text-sm font-medium">Table</label>
            <select
              name="tableId"
              value={formData.tableId}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">- please select -</option>
              <option value="t1">Table 1</option>
              <option value="t2">Table 2</option>
            </select>
            {errors.tableId && (
              <p className="text-red-600 text-sm">{errors.tableId}</p>
            )}
          </div>

          {/* Guest Number */}
          <div>
            <label className="block text-sm font-medium">Guest Number</label>
            <input
              type="number"
              name="guestNumber"
              value={formData.guestNumber}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.guestNumber && (
              <p className="text-red-600 text-sm">{errors.guestNumber}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.date && (
              <p className="text-red-600 text-sm">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.time && (
              <p className="text-red-600 text-sm">{errors.time}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Restaurant */}
          <div>
            <label className="block text-sm font-medium">Restaurant</label>
            <select
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">- please select -</option>
              <option value="r1">Main Branch</option>
              <option value="r2">Downtown</option>
            </select>
            {errors.restaurantId && (
              <p className="text-red-600 text-sm">{errors.restaurantId}</p>
            )}
          </div>
        </form>

        {/* Comment */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Comment</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Submit */}
        <div className="pt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;
