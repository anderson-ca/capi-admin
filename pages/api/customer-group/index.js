import prisma from "../../../utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  requiresApproval: z.boolean().optional(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  const tenantId = session.user?.tenantId;
  if (!tenantId) return res.status(403).json({ success: false, message: "No tenant in session" });

  if (req.method === "GET") {
    try {
      const groups = await prisma.customerGroup.findMany({
        where: { tenantId },
        orderBy: { name: "asc" }, // you don't have createdAt on the model
      });
      return res.json({ success: true, groups });
    } catch (err) {
      console.error("[customer-group:list]", err);
      return res.status(500).json({ success: false, message: "Failed to fetch groups" });
    }
  }

  if (req.method === "POST") {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const group = await prisma.customerGroup.create({
        data: { tenantId, ...parsed.data },
      });
      return res.status(201).json({ success: true, group });
    } catch (err) {
      console.error("[customer-group:create]", err);
      const code = err.code === "P2002" ? 409 : 500;
      const msg = err.code === "P2002" ? "Group name already exists" : "Error creating group";
      return res.status(code).json({ success: false, message: msg });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
