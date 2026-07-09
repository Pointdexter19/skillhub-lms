const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://<arydj019_db_user>:<hehehe_19>@cluster0.xxxxx.mongodb.net/skillhub?retryWrites=true&w=majority');
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;