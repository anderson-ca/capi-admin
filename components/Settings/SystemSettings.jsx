import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  logBadRequests: z.boolean(),
  maintenanceMode: z.boolean(),
  logRetentionDays: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val) >= 1, {
      message: "Must be a number greater than 0",
    }),
});

export default function SystemSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      logBadRequests: false,
      maintenanceMode: false,
      logRetentionDays: "60",
    },
  });

  const onSubmit = (data) => {
    console.log("System settings saved:", data);
    // TODO: Replace with real submission logic (e.g. API call)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Log Settings</h2>
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register("logBadRequests")} />
          <span>Log Bad Requests (e.g. 404)</span>
        </label>
        <p className="text-sm text-gray-500">
          Whether to log bad browser requests, such as 404 errors.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Maintenance</h2>
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register("maintenanceMode")} />
          <span>Maintenance Mode</span>
        </label>
        <p className="text-sm text-gray-500">
          Enable to prevent customers from viewing your store. The maintenance
          message will be shown to non-admins.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Activity Log Settings
        </h2>
        <label className="block text-sm font-medium text-gray-700">
          Clean Up Activity Log Older Than (Days)
        </label>
        <input
          type="text"
          {...register("logRetentionDays")}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        {errors.logRetentionDays && (
          <p className="text-sm text-red-500">{errors.logRetentionDays.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Delete all recorded activities older than the specified number of days.
        </p>
      </div>

      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Save
      </button>
    </form>
  );
}
