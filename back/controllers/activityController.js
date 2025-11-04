import ActivityModel from "../models/Activity.js";

const fetchActivities = async (req, res) => {
  try {
    const activities = await ActivityModel.find({})
      .sort({ createdAt: -1 })
      .populate("refId");
    return res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error("Error in fetching activities:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { fetchActivities };
