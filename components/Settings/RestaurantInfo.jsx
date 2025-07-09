import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  logo: z.any().optional(),
});

const RestaurantGeneralForm = () => {
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // TODO: Submit to backend API here
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[600px] space-y-6 bg-white p-6 rounded-md shadow"
    >
      <div>
        <label className="block font-medium mb-1">Restaurant Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Restaurant Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Restaurant Logo</label>
        <input
          type="file"
          accept="image/*"
          {...register("logo")}
          onChange={handleImageChange}
          className="block"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 h-24 object-contain"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-[#FE4901] text-white py-2 px-4 rounded hover:bg-orange-600 transition"
      >
        Save
      </button>
    </form>
  );
};

export default RestaurantGeneralForm;
