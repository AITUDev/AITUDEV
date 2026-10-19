const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read .env.local if available
const envPath = path.resolve(__dirname, '../.env.local');
let uri = 'mongodb+srv://aitudevelopment_db_user:xrleBoYircluoPx1@cluster0.baznljf.mongodb.net/aitudev?retryWrites=true&w=majority';
let defaultEmail = 'aitudevelopment@gmail.com';
let defaultPass = 'Admin@2026';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    const val = rest.join('=').trim();
    if (key.trim() === 'MONGODB_URI' && val) uri = val;
    if (key.trim() === 'NEXT_PUBLIC_DASHBOARD_EMAIL' && val) defaultEmail = val;
    if (key.trim() === 'NEXT_PUBLIC_DASHBOARD_PASS' && val) defaultPass = val;
  });
}

async function seedAdmin() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully!');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPass, salt);

    const adminAccounts = [
      {
        name: 'AITU Dev Admin',
        email: defaultEmail.toLowerCase().trim(),
        role: 'admin',
        accountRole: 'admin',
        passwordHash,
        status: 'active',
        skills: ['Fullstack', 'Management', 'Lead'],
        bio: 'Administrator account for AITU Dev team platform',
        socialLinks: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin',
        email: 'admin@aitudev.com',
        role: 'admin',
        accountRole: 'admin',
        passwordHash,
        status: 'active',
        skills: ['Management', 'Admin'],
        bio: 'Platform Administrator',
        socialLinks: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const dbName of ['aitudev', 'test']) {
      const db = client.db(dbName);
      for (const account of adminAccounts) {
        const existing = await db.collection('teammembers').findOne({
          email: { $regex: new RegExp(`^${account.email}$`, 'i') }
        });

        if (existing) {
          await db.collection('teammembers').updateOne(
            { _id: existing._id },
            {
              $set: {
                passwordHash,
                role: 'admin',
                accountRole: 'admin',
                status: 'active',
                updatedAt: new Date()
              }
            }
          );
          console.log(`✅ [${dbName}] Admin account updated: ${account.email}`);
        } else {
          await db.collection('teammembers').insertOne(account);
          console.log(`✅ [${dbName}] Admin account created: ${account.email}`);
        }
      }
    }

    console.log('\n--- Admin Credentials ---');
    console.log(`Email 1: ${defaultEmail}`);
    console.log(`Email 2: admin@aitudev.com`);
    console.log(`Password: ${defaultPass}`);
    console.log('-------------------------\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    await client.close();
  }
}

seedAdmin();
