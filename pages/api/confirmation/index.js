// pages/api/confirmation/index.js
import prisma from "@/utils/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const { token } = req.query;
  if (!token || Array.isArray(token)) {
    return res.status(400).send("Missing token");
  }

  try {
    // single write to avoid race conditions
    const updated = await prisma.reservation.updateMany({
      where: {
        token,
        expiresAt: { gt: new Date() }, // still valid
        status: "pending",
      },
      data: {
        status: "confirmed",
        token: null,
        expiresAt: null,
      },
    });

    if (updated.count === 0) {
      return res.status(400).send("Invalid, expired, or already confirmed link");
    }

    // success – send them to a nice page
    return res.redirect(307, "/confirmed");
  } catch (err) {
    console.error("[confirmation]", err);
    return res.status(500).send("Server error");
  }
}
