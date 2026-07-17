import dotenv from 'dotenv';
// Load environment variables from local server directory first, if they exist
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  console.log('🏁 Starting standalone backend service...');
  
  try {
    await connectDB();
    console.log('✅ Standalone DB setup step finished.');
  } catch (err) {
    console.warn('⚠️  Database connection skipped or failed. Standalone server starting without database.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Standalone Server running on port ${PORT}`);
  });
}

bootstrap();
