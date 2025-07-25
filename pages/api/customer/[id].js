import prisma from "../../../utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName : z.string().min(1).optional(),
  email    : z.string().email().optional(),
  phone    : z.string().optional().nullable(),
  groupId  : z.string().optional().nullable(),
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  const tenantId = session.user?.tenantId;
  if (!tenantId) return res.status(403).json({ success: false, message: "No tenant in session" });

  /* ───────────── PUT /api/customer/:id ───────────── */
  if (req.method === "PUT") {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    if (Object.keys(parsed.data).length === 0) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    try {
      const updated = await prisma.customer.updateMany({
        where: { id, tenantId, deletedAt: null },
        data: parsed.data,
      });

      if (updated.count === 0) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      const customer = await prisma.customer.findFirst({
        where: { id, tenantId },
        include: { group: true },
      });

      return res.json({ success: true, customer });
    } catch (err) {
      console.error("[customer:update]", err);
      const code = err.code === "P2002" ? 409 : 500;
      const msg  = err.code === "P2002" ? "Email already exists in this tenant" : "Error updating customer";
      return res.status(code).json({ success: false, message: msg });
    }
  }

  /* ─────────── DELETE /api/customer/:id ─────────── */
  if (req.method === "DELETE") {
    try {
      const deleted = await prisma.customer.updateMany({
        where: { id, tenantId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      if (deleted.count === 0) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      return res.status(204).end();
    } catch (err) {
      console.error("[customer:delete]", err);
      return res.status(500).json({ success: false, message: "Error deleting customer" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end();
}
