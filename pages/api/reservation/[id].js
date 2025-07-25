import prisma from "../../../utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  comment: z.string().optional(),
  // add any other fields you want to allow updating
});

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const tenantId = session.user?.tenantId;
  if (!tenantId) {
    return res.status(403).json({ success: false, message: "No tenant in session" });
  }

  if (req.method === "PUT") {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const updated = await prisma.reservation.updateMany({
        where: { id, tenantId, deletedAt: null },
        data: parsed.data,
      });

      if (updated.count === 0) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      const reservation = await prisma.reservation.findFirst({
        where: { id, tenantId, deletedAt: null },
      });

      return res.json({ success: true, reservation });
    } catch (err) {
      console.error("[reservation:update]", err);
      return res.status(500).json({ success: false, message: "Error updating reservation" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await prisma.reservation.updateMany({
        where: { id, tenantId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      if (deleted.count === 0) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      return res.status(204).end();
    } catch (err) {
      console.error("[reservation:delete]", err);
      return res.status(500).json({ success: false, message: "Error deleting reservation" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end();
}
