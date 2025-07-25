import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { Resend } from "resend";
import crypto from "crypto";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const createReservationSchema = z.object({
  tableId: z.string().min(1),
  guestNumber: z.coerce.number().int().positive(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  time: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  restaurantId: z.string().min(1), // if restaurantId === tenantId, keep it; otherwise drop it
  comment: z.string().optional(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // If you want GET/POST here to be private (dashboard only), enforce it:
  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const tenantId = session.user?.tenantId;
  if (!tenantId) {
    return res.status(403).json({ success: false, message: "No tenant bound to session" });
  }

  if (req.method === "GET") {
    try {
      const reservations = await prisma.reservation.findMany({
        where: {
          tenantId,
          // deletedAt: null, // uncomment if you add soft-delete later
        },
        orderBy: { date: "desc" },
      });

      return res.status(200).json({ success: true, reservations });
    } catch (error) {
      console.error("Reservation fetch error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching reservations" });
    }
  }

  if (req.method === "POST") {
    const parsed = createReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const {
      tableId,
      guestNumber,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      restaurantId, // keep if you still use it elsewhere
      comment,
    } = parsed.data;

    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

      const reservation = await prisma.reservation.create({
        data: {
          tenantId, // 👈 IMPORTANT
          tableName: tableId,
          guestNumber,
          date: new Date(date),
          time,
          firstName,
          lastName,
          email,
          phone,
          restaurant: restaurantId, // or drop if you don’t store it anymore
          comment,
          status: "pending",
          token,
          expiresAt,
        },
      });

      const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/confirmation?token=${token}`;

      await resend.emails.send({
        from: "Tamilla’s Kitchen <onboarding@resend.dev>",
        to: email,
        subject: "Please confirm your reservation",
        html: `
          <h2>Hi ${firstName}, confirm your reservation</h2>
          <p>Click the button below to finalize your booking.</p>
          <p><a
               style="background:#ff7a00;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none"
               href="${confirmUrl}">
               Confirm Reservation
             </a></p>
          <p>This link is valid for 24 hours.</p>
        `,
      });

      return res.status(200).json({ success: true, reservation });
    } catch (error) {
      console.error("Reservation creation error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error creating reservation",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
