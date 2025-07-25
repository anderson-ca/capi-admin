import prisma from "../../../utils/prisma";
import { z } from "zod";

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName : z.string().min(1).optional(),
  email    : z.string().email().optional(),
  phone    : z.string().optional(),
  role     : z.enum(["owner", "manager", "waiter", "delivery"]).optional(),
});

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      return updateStaff(req, res, id);
    case "DELETE":
      return deleteStaff(req, res, id);
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}

async function updateStaff(req, res, id) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    // ensure it exists & not soft-deleted
    const exists = await prisma.staff.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!exists) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: parsed.data,
    });

    return res.status(200).json({ success: true, staff });
  } catch (err) {
    if (err.code === "P2002") {
      // unique email conflict
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
    console.error("[staff-update]", err);
    return res
      .status(500)
      .json({ success: false, message: "Error updating staff member" });
  }
}

async function deleteStaff(req, res, id) {
  try {
    // soft delete
    const staff = await prisma.staff.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (staff.count === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[staff-delete]", err);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting staff member" });
  }
}
