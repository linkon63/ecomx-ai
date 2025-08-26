import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test queries
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const orderCount = await prisma.order.count();
    
    console.log('📊 Database statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Orders: ${orderCount}`);
    
    // Test admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@shoex.com' },
      select: { id: true, email: true, role: true }
    });
    
    if (admin) {
      console.log('👤 Admin user found:', admin);
    } else {
      console.log('❌ Admin user not found');
    }
    
    console.log('✅ Database test completed successfully');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
