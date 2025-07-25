import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";
import { z } from "zod";

const staffSchema = z.object({
  firstName: z.string().min(1),
  lastName : z.string().min(1),
  email    : z.string().email(),
  phone    : z.string().optional(),
  role     : z.enum(["owner", "manager", "waiter", "delivery"]),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  const tenantId = session.user.tenantId;
  if (!tenantId) return res.status(403).json({ success: false, message: "No tenant on session" });

  if (req.method === "GET") {
    try {
      const staff = await prisma.staff.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ success: true, staff });
    } catch (err) {
      console.error("[staff-list]", err);
      return res.status(500).json({ success: false, message: "Failed to fetch staff list" });
    }
  }

  if (req.method === "POST") {
    const parsed = staffSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const staff = await prisma.staff.create({
        data: { ...parsed.data, tenantId },
      });
      return res.status(200).json({ success: true, staff });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
      console.error("[staff-create]", err);
      return res.status(500).json({ success: false, message: "Error creating staff member" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
