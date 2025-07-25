import prisma from "../../../utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName : z.string().min(1),
  email    : z.string().email(),
  phone    : z.string().optional(),
  groupId  : z.string().optional().nullable(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  const tenantId = session.user?.tenantId;
  if (!tenantId) return res.status(403).json({ success: false, message: "No tenant in session" });

  /* ───────────── GET /api/customer ───────────── */
  if (req.method === "GET") {
    try {
      const customers = await prisma.customer.findMany({
        where: { tenantId, deletedAt: null },
        include: { group: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ success: true, customers });
    } catch (err) {
      console.error("[customer:list]", err);
      return res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
  }

  /* ───────────── POST /api/customer ──────────── */
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
      const customer = await prisma.customer.create({
        data: { tenantId, ...parsed.data },
        include: { group: true },
      });
      return res.status(201).json({ success: true, customer });
    } catch (err) {
      console.error("[customer:create]", err);
      const code = err.code === "P2002" ? 409 : 500; // unique (tenantId,email)
      const msg  = err.code === "P2002" ? "Email already exists in this tenant" : "Error creating customer";
      return res.status(code).json({ success: false, message: msg });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
