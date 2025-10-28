import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    email_address: { type: String, required: true },
    full_name: { type: String, required: true },
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    message: { type: String, required: true },
    replied_to: { type: Boolean, default: false },
  },
  { collection: "mail", timestamps: true }
);

// Log creation
// mailSchema.post("save", async function (doc) {
//   await Activity.create({
//     type: "mail",
//     refId: doc._id,
//     action: "created",
//     title: `New mail from ${doc.full_name}`,
//   });
// });

// Log update
// mailSchema.post("findOneAndUpdate", async function (doc) {
//   if (doc) {
//     await Activity.create({
//       type: "mail",
//       refId: doc._id,
//       action: "updated",
//       title: `${doc.full_name}'s mail was updated`,
//     });
//   }
// });

// Log delete
// mailSchema.post("findOneAndDelete", async function (doc) {
//   if (doc) {
//     await Activity.create({
//       type: "mail",
//       refId: doc._id,
//       action: "deleted",
//       title: `${doc.full_name}'s mail was deleted`,
//     });
//   }
// });

const MailsModel = mongoose.model("mail", mailSchema);
export default MailsModel;
