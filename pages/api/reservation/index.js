// pages/api/reservations/index.ts
import { prisma } from '../../../utils/prisma'; // adjust if needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      tableId,
      guestNumber,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      restaurantId,
      comment,
    } = req.body;

    try {
      const reservation = await prisma.reservation.create({
        data: {
          tableName: tableId,
          guestNumber: parseInt(guestNumber),
          date: new Date(date),
          time,
          firstName,
          lastName,
          email,
          phone,
          restaurant: restaurantId,
          comment,
        },
      });

      return res.status(200).json({ success: true, reservation });
    } catch (error) {
      console.error('Reservation creation error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error creating reservation',
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const reservations = await prisma.reservation.findMany({
        orderBy: {
          date: 'desc',
        },
      });

      return res.status(200).json({ success: true, reservations });
    } catch (error) {
      console.error('Reservation fetch error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching reservations',
      });
    }
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
