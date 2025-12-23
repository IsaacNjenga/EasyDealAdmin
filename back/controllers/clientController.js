import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "../config/FirebaseAdmin.js";
import ClientModel from "../models/Client.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "4d",
  });

  return { accessToken };
};

const firebaseGoogleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    //verify with firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    //find user in DB
    let user = await ClientModel.findOne({ email });
    if (!user) {
      user = await ClientModel.create({
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

const clientRegister = async (req, res) => {
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

const clientLogin = async (req, res) => {
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

const fetchClients = async (req, res) => {
  await connectDB();
  try {
    const clients = await ClientModel.find({}).select("-password");
    res.status(200).json({ success: true, clients: clients });
  } catch (error) {
    console.error("Error in fetching clients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchClient = async (req, res) => {
  await connectDB();
  const { email } = req.query;
  try {
    const client = await ClientModel.findOne({ email })
      .populate("favourites reviews cart")
      .select("-passwords");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ success: true, client: client });
  } catch (error) {
    console.error("Error in fetching client:", error);
    return res.status(500).json({ message: "Error Fetching Client" });
  }
};

const fetchClientDetails = async (req, res) => {
  await connectDB();
  const { email } = req.query;
  try {
    const clientDetails = await ClientModel.aggregate([
      { $match: { email } },
      {
        $lookup: {
          from: "cart",
          localField: "cart",
          foreignField: "_id",
          as: "cart",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "favourites",
          foreignField: "_id",
          as: "favourites",
          pipeline: [
            // Now inside favourites pipeline, lookup analytics
            {
              $lookup: {
                from: "analytics",
                localField: "_id",
                foreignField: "productId",
                as: "analytics",
              },
            },
            // optional: add calculated totals
            {
              $addFields: {
                totalViews: { $sum: "$analytics.views" },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
          pipeline: [
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productId",
              },
            },
          ],
        },
      },
    ]);
    res
      .status(200)
      .json({ success: true, clientDetails: clientDetails[0] || null });
  } catch (error) {
    console.error("Error when fetching client details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  firebaseGoogleLogin,
  clientRegister,
  clientLogin,
  fetchClient,
  fetchClients,
  fetchClientDetails,
};
