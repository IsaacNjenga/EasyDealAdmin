import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "../config/FirebaseAdmin.js";
import ClientModel from "../models/Client.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  return { accessToken };
};

const firebaseGoogleLogin = async (req, res) => {
  await connectDB();
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    //verify with firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    //find user in DB
    let user = await ClientModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        firebaseUid: uid,
        email,
        name,
        avatar: picture,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res
      .status(200)
      .json({ success: true, token, user: { ...user, _id: user._id } });
  } catch (error) {
    console.error("Error on login:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const Register = async (req, res) => {
  await connectDB();
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const existingEmail = await ClientModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User under this email already exists" });
    }
    const existingName = await ClientModel.findOne({ name });
    if (existingName) {
      return res
        .status(400)
        .json({ message: "A user under this name already exists" });
    }

    //random avatar generation logic
    const avatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${name}`;

    const newUser = new ClientModel({ ...req.body, avatar });
    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        id: newUser._id,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in Registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Login = async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await ClientModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email address is invalid" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is invalid" });
    }

    const { accessToken } = generateTokens(user);
    await user.save();

    //const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { firebaseGoogleLogin, Register, Login };
