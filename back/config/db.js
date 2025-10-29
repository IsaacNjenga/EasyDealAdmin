import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const Connection = async () => {
  try {
    const db = process.env.URI;
    await mongoose.connect(db);
    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to db", error);
  }
};

Connection();