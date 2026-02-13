require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (existingAdmin) {
            console.log('❌ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = new User({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

seedAdmin();
