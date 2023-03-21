import moment from "moment";
import mongoose, { model, Schema, Types } from "mongoose";
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentId: {
    type: Number,
    required: true,
  },
  borrowedBooks: {
    type: [Types.ObjectId],
    ref: "Book",
    default: [],
  },
  borrowedDates: {
    type: Map,
    default: new Map(),
  },
  returnDates: {
    type: Map,
    default: new Map(),
  },
  fine: { type: Number, default: 0 },
  phone: {
    type: String,
    default: "+20123456789",
  },
  confirmEmail: {
    type: Boolean,
    default: false,
  },
  resetCode: String,
  gender: {
    type: String,
    default: "Male",
    enum: ["Male", "Female"],
  },
  status: {
    type: String,
    default: "OffLine",
    enum: ["OffLine", "OnLine", "Blocked"],
  },
  role: {
    type: String,
    default: "User",
    enum: ["User", "Admin"],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  profilePic: String,
  coverPic: [String],
  createdAt: {
    type: String,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedAt: {
    type: String,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
});

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
