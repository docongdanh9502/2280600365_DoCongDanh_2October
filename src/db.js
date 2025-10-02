import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { autoIndex: true });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};
