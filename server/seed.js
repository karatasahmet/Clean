const { sequelize, User } = require('./models');

async function seed() {
  await sequelize.sync({ alter: true });
  
  const adminExists = await User.findOne({ where: { email: 'admin@cleanaqua.com' } });
  if (!adminExists) {
    await User.create({
      name: 'Yönetici',
      email: 'admin@cleanaqua.com',
      password: 'admin', // Will be hashed by hook
      role: 'Süper Admin',
      phone: '0500 000 00 00'
    });
    console.log('Demo Admin kullanıcısı oluşturuldu: admin@cleanaqua.com / admin');
  }

  const driverExists = await User.findOne({ where: { email: 'driver@cleanaqua.com' } });
  if (!driverExists) {
    await User.create({
      name: 'Ahmet Şoför',
      email: 'driver@cleanaqua.com',
      password: 'driver',
      role: 'Saha Personeli',
      phone: '0530 000 00 00'
    });
    console.log('Demo Şoför kullanıcısı oluşturuldu: driver@cleanaqua.com / driver');
  }

  process.exit();
}

seed();
