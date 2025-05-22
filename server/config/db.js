import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,    // Ensures compatibility with new MongoDB drivers
            useUnifiedTopology: true, // Enables the new server discovery and monitoring engine
            serverSelectionTimeoutMS: 10000, // Prevents long delays if MongoDB server isn't reachable
        });

        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);

        // Additional error details for better debugging
        if (err.name === 'MongooseServerSelectionError') {
            console.error('🔎 Possible Cause: IP not whitelisted in MongoDB Atlas.');
        }

        process.exit(1); // Exit the app if the database connection fails
    }
};

export default connectDB;
