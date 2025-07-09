"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const localeSchema = z.object({
  detectBrowserLanguage: z.boolean(),
  currencyConverter: z.enum(["openexchange", "fixer"]),
  apiKey: z.string().optional(),
  refreshInterval: z.enum(["12 Hours", "24 Hours", "48 Hours", "1 Week"]),
  timezone: z.string().min(1, "Timezone is required"),
});

const defaultValues = {
  detectBrowserLanguage: false,
  currencyConverter: "openexchange",
  apiKey: "",
  refreshInterval: "24 Hours",
  timezone: "",
};

export default function LocationAndLocale() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(localeSchema),
  });

  const onSubmit = (data) => {
    console.log("Submitted locale settings:", data);
    // Save logic here
  };

  const detectLang = watch("detectBrowserLanguage");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl p-6">
      <h2 className="text-xl font-semibold">Localization</h2>

      {/* Toggle: Detect Browser Language */}
      <div className="flex items-center justify-between">
        <label htmlFor="detectBrowserLanguage" className="text-sm font-medium">
          Detect Browser Language
        </label>
        <input
          type="checkbox"
          id="detectBrowserLanguage"
          {...register("detectBrowserLanguage")}
          className="w-5 h-5"
        />
      </div>

      {/* Currency Converter Radios */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Currency Converter</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="openexchange"
              {...register("currencyConverter")}
              className="accent-black"
            />
            Open Exchange Rates
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="fixer"
              {...register("currencyConverter")}
              className="accent-black"
            />
            Fixer.io
          </label>
        </div>
      </div>

      {/* API Key Field */}
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
          Currency API Key (optional)
        </label>
        <input
          type="text"
          id="apiKey"
          {...register("apiKey")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Refresh Interval */}
      <div>
        <label
          htmlFor="refreshInterval"
          className="block text-sm font-medium mb-1"
        >
          Exchange Rates Refresh Interval
        </label>
        <select
          id="refreshInterval"
          {...register("refreshInterval")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="12 Hours">12 Hours</option>
          <option value="24 Hours">24 Hours</option>
          <option value="48 Hours">48 Hours</option>
          <option value="1 Week">1 Week</option>
        </select>
      </div>

      {/* Timezone */}
      <div>
        <label htmlFor="timezone" className="block text-sm font-medium mb-1">
          Default Timezone
        </label>
        <select
          id="timezone"
          {...register("timezone")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select a timezone</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="America/Sao_Paulo">America/Sao_Paulo</option>
          <option value="Asia/Baku">Asia/Baku</option>
          <option value="America/Chicago">America/Chicago</option>
        </select>
        {errors.timezone && (
          <p className="text-sm text-red-500 mt-1">{errors.timezone.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </form>
  );
}
