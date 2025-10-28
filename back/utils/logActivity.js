import ActivityModel from "../models/Activity.js";

export const logActivity = async (
  type,
  refId,
  action,
  title,
  description = "",
  refModel,
  res
) => {
  try {
    await ActivityModel.create({
      type,
      refId,
      action,
      title,
      description,
      refModel,
    });
  } catch (error) {
    console.error("Error logging activity", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
