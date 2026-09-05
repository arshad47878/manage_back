import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

async function databaseConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');
  } catch (error) {
    console.error(
      'MongoDB connection error:',
      error.message
    );
  }
}

export default databaseConnection;