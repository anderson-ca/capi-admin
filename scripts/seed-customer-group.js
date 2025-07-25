// scripts/seed-customer-group.js
const prisma = require('../utils/prisma.js');

module.exports = async function seedCustomerGroups() {
  await prisma.customerGroup.upsert({
    where : { name: 'Default group' },
    update: {},
    create: {
      name            : 'Default group',
      description     : 'Initial group',
      requiresApproval: false,
    },
  });

  console.log('🌱  Default customer group ensured');
};
