(async () => {
  try {
    await require('../scripts/seed-admin.js')();
    await require('../scripts/seed-customer-group.js')();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await require('../utils/prisma.js').$disconnect();
  }
})();
