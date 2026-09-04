import mongoose from 'mongoose';

async function databaseConnection() {
  try {
    await mongoose.connect("mongodb+srv://qureshiarshad47878_db_user:CoEO1mVMZ9dLASF3@cluster0.jfkut42.mongodb.net/");

    console.log('MongoDB connected');
  } catch (error) {
    console.error(
      'MongoDB connection error:',
      error.message
    );
  }
}

export default databaseConnection;