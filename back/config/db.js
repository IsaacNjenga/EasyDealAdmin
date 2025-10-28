import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Connection = () => {
  try {
    const uri = process.env.URI;
    mongoose.connect(uri);
    console.log("Database Connected!");
  } catch (error) {
    console.error("Error connecting to DB", error);
  }
};

Connection();
