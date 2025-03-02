import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const URI = process.env.MongoDBURL;
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("connected to DB");
  } catch (error) {
    console.log("error connecting Database", error);
    process.exit(1);
  }
};
