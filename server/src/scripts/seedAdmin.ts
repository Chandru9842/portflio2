import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { connectDB, validateDatabaseConfig } from '../config/db';

async function seedAdmin() {
  try {
    // Validate database configuration first
    validateDatabaseConfig();
  } catch (error: any) {
    console.error('❌ Configuration Error:', error.message || error);
    process.exit(1);
  }

  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME;

  if (!username || !email || !password || !fullName) {
    console.error('❌ Error: Missing required admin environment variables.');
    console.log('Please ensure the following are defined in your .env or Settings:');
    console.log('- ADMIN_USERNAME');
    console.log('- ADMIN_EMAIL');
    console.log('- ADMIN_PASSWORD');
    console.log('- ADMIN_FULL_NAME');
    process.exit(1);
  }

  try {
    // Use the central verified connectDB configuration
    await connectDB();

    // Check if an admin already exists (either username or email)
    const existingAdmin = await Admin.findOne({
      $or: [{ username: username.toLowerCase().trim() }, { email: email.toLowerCase().trim() }],
    });

    console.log('🔑 Hashing administrative password...');
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existingAdmin) {
      console.log('ℹ️  An administrator account with this username or email already exists.');
      console.log('Updating existing administrator account to match environment variables and current password...');
      
      existingAdmin.username = username.toLowerCase().trim();
      existingAdmin.email = email.toLowerCase().trim();
      existingAdmin.fullName = fullName.trim();
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;

      await existingAdmin.save();
      console.log('🏆 Administrator account updated successfully!');
      console.log(`- Full Name: ${fullName}`);
      console.log(`- Username:  ${username.toLowerCase()}`);
      console.log(`- Email:     ${email.toLowerCase()}`);
      console.log('- Role:      admin');
      console.log('- Status:    Active');
      
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB.');
      process.exit(0);
    }

    const newAdmin = new Admin({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    await newAdmin.save();
    console.log('🏆 Administrator account initialized successfully!');
    console.log(`- Full Name: ${fullName}`);
    console.log(`- Username:  ${username.toLowerCase()}`);
    console.log(`- Email:     ${email.toLowerCase()}`);
    console.log('- Role:      admin');
    console.log('- Status:    Active');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding administrator account:', error?.message || error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

seedAdmin();
