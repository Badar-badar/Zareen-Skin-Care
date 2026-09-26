/**
 * Admin Provisioning Script
 * Safely creates or updates a platform Administrator account.
 * 
 * Usage:
 *   node scripts/createAdmin.js
 * 
 * Environment variables:
 *   ADMIN_FIRST_NAME (default: 'Platform')
 *   ADMIN_LAST_NAME  (default: 'Administrator')
 *   ADMIN_EMAIL      (required or default: 'admin@zareenskincare.com')
 *   ADMIN_PASSWORD   (required or passed via CLI/ENV)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');

const provisionAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zareen_skin_care';
  
  const firstName = process.env.ADMIN_FIRST_NAME || 'System';
  const lastName = process.env.ADMIN_LAST_NAME || 'Administrator';
  const email = (process.env.ADMIN_EMAIL || 'admin@zareenskincare.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';

  if (!email || !password) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD are required.');
    process.exit(1);
  }

  try {
    console.log(`[Admin Provisioning] Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let adminUser = await User.findOne({ email });

    if (adminUser) {
      adminUser.firstName = firstName;
      adminUser.lastName = lastName;
      adminUser.password = hashedPassword;
      adminUser.role = 'admin';
      adminUser.status = 'active';
      adminUser.isEmailVerified = true;
      await adminUser.save();
      console.log(`✓ Existing administrator account <${email}> successfully updated.`);
    } else {
      adminUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        isEmailVerified: true,
      });
      console.log(`✓ New administrator account <${email}> successfully created.`);
    }

    console.log('[Admin Provisioning] Administrator provisioning complete.');
  } catch (error) {
    console.error(`❌ Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  provisionAdmin();
}

module.exports = provisionAdmin;
