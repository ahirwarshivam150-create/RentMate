const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Expense = require('./models/Expense'); // Assuming Expense model exists or will satisfy dependency
const Notification = require('./models/Notification');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roommate-expenses', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const resetData = async () => {
    try {
        await connectDB();

        console.log('Clearing Users...');
        await User.deleteMany({});

        console.log('Clearing Rooms...');
        await Room.deleteMany({});

        // Check if Expense model file exists first in a real scenario, but here we assume it's created or we look for collection
        // If Expense model wasn't viewed/created yet, we might need to check. 
        // Based on previous `index.js`, `expenseRoutes` exists, so likely `Expense` model exists or allows loose schema if we queried collection directly.
        // But better to use the model if valid.
        try {
            const ExpenseModel = require('./models/Expense');
            console.log('Clearing Expenses...');
            await ExpenseModel.deleteMany({});
        } catch (e) {
            console.log('Expense model might not exist or failed to clear, checking collection directly...');
            if (mongoose.connection.collections['expenses']) {
                await mongoose.connection.collections['expenses'].deleteMany({});
            }
        }

        console.log('Clearing Notifications...');
        await Notification.deleteMany({});

        console.log('All Data Cleared Successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing data:', err);
        process.exit(1);
    }
};

resetData();
