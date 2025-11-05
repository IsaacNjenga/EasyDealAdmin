import NewsletterModel from "../models/Newsletter.js";

const draftNewsletter = async (req, res) => {
  try {
    const { content } = req.body;
    const saved = await Newsletter.create({ content });
    res.status(201).json({ success: true, newsletter: saved });
  } catch (error) {
    console.error("Error in creating a draft newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchNewsletter = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({ message: "ID not specified" });
  }
  try {
    const newsletter = await NewsletterModel.findById(id);
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.status(200).json({ success: true, newsletter: newsletter });
  } catch (error) {
    console.error("Error in fetching this newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { draftNewsletter, fetchNewsletter };
