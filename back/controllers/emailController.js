import MailsModel from "../models/Emails.js";
import { logActivity } from "../utils/logActivity.js";

const createMail = async (req, res) => {
  try {
    const newMail = new MailsModel(req.body);

    //logging the activity
    await logActivity(
      "mail",
      newMail._id,
      "created",
      `New mail from ${newMail.full_name}`,
      `${newMail.email_address} sent a message`,
      "mail"
    );

    await newMail.save();
    return res.status(201).json({ success: true, mail: newMail });
  } catch (error) {
    console.error("Error in mail creation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const readMails = async (req, res) => {
  try {
    const mails = await MailsModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, mails });
  } catch (error) {
    console.error("Error in mails fetch:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const readMail = async (req, res) => {
  const { id } = req.query;
  try {
    const mail = await MailsModel.findById(id);
    if (!mail) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found" });
    }
    return res.status(200).json({ success: true, mail });
  } catch (error) {
    console.error("Error in mail fetch:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const emailUpdate = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;
  try {
    const updateMail = await MailsModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updateMail) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found" });
    }
    return res.status(200).json({ success: true, mail: updateMail });
  } catch (error) {
    console.error("Error in mail update:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const emailRead = async (req, res) => {
  const { id } = req.query;
  try {
    const mail = await MailsModel.findById(id);
    if (!mail) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found" });
    }
    mail.read = !mail.read;
    await mail.save();
    return res.status(200).json({ success: true, mail: mail });
  } catch (error) {}
};

const emailStarred = async (req, res) => {
  const { id } = req.query;
  try {
    const mail = await MailsModel.findById(id);
    if (!mail) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found" });
    }
    mail.starred = !mail.starred;
    await mail.save();
    return res.status(200).json({ success: true, mail: mail });
  } catch (error) {
    console.error("Error in mail starring:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const updateMail = async (req, res) => {
  const { id } = req.query;
  try {
    const mail = await MailsModel.findById(id);
    if (!mail) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found" });
    }
    const updatedMail = await MailsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ success: true, mail: updatedMail });
  } catch (error) {
    console.error("Error in mail updation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteMail = async (req, res) => {
  const { id } = req.query;
  try {
    const mail = await MailsModel.findById(id);
    if (!mail) {
      return res
        .status(404)
        .json({ success: false, message: "Mail not found" });
    }
    await MailsModel.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Mail deleted" });
  } catch (error) {
    console.error("Error in mail deletion:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  createMail,
  readMails,
  readMail,
  updateMail,
  deleteMail,
  emailRead,
  emailStarred,
  emailUpdate,
};
