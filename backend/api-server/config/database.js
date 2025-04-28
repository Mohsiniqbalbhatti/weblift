import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDBURL, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("connected to DB");
  } catch (error) {
    console.log("error connecting Database", error);
    process.exit(1);
  }
};
