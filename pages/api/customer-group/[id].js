import prisma from "../../../utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  requiresApproval: z.boolean().optional(),
});

export default async function handler(req, res) {
  const { id } = req.query;

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  const tenantId = session.user?.tenantId;
  if (!tenantId) return res.status(403).json({ success: false, message: "No tenant in session" });

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
      const group = await prisma.customerGroup.update({
        where: { id_tenantId: { id, tenantId } }, // requires @@unique([id, tenantId]) OR use findFirst + update
        data: parsed.data,
      });
      return res.json({ success: true, group });
    } catch (err) {
      console.error("[customer-group:update]", err);
      const code = err.code === "P2002" ? 409 : 500;
      const msg = err.code === "P2002" ? "Group name already exists" : "Error updating group";
      return res.status(code).json({ success: false, message: msg });
    }
  }

  if (req.method === "DELETE") {
    try {
      // Hard delete. If you need soft delete, add deletedAt to CustomerGroup and update instead.
      await prisma.customerGroup.delete({
        where: { id_tenantId: { id, tenantId } }, // same comment as above
      });
      return res.status(204).end();
    } catch (err) {
      console.error("[customer-group:delete]", err);
      return res.status(500).json({ success: false, message: "Error deleting group" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end();
}
