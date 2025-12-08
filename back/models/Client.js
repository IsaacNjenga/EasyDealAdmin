import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    password: { type: String, minLength: 8 },
    stats: {
      favourites: { type: Number, default: 0 },
      reviews: { type: Number, default: 0 },
      viewings: { type: Number, default: 0 },
    },
    favourites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "products",
      default: [],
    },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "reviews",
      default: [],
    },
  },
  { collection: "clients", timestamps: true }
);

//hashing password before saving user
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//compare password
clientSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const ClientModel = mongoose.model("clients", clientSchema);

export default ClientModel;
