// scripts/seed-admin.js
const prisma = require('../utils/prisma.js');
const { hash } = require('bcrypt');

module.exports = async function seedAdmin() {
  const pwd = await hash('password123', 10);

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Restaurant',
      memberships: {
        create: {
          role: 'OWNER',
          user: {
            create: {
              email        : 'anderson.d.cardoso92@gmail.com',
              passwordHash : pwd,
              firstName    : 'Owner',
              lastName     : 'User',
            },
          },
        },
      },
    },
    include: { memberships: { include: { user: true } } },
  });

  console.log('🌱  Seeded owner →', tenant.memberships[0].user.email);
};
