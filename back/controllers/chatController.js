import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

const queryUsers = async (req, res) => {
  const { username } = req.query;
  try {
    const serverClient = StreamChat.getInstance(api_key, api_secret);
    const users = await serverClient.queryUsers({ username });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error on fetching users" });
  }
};

export { queryUsers };
