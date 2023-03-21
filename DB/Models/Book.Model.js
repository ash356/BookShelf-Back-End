import mongoose, { model, Schema, Types } from "mongoose";
const bookSchema = new Schema(
  {
    bookName: {
      type: String,
      required: true,
      unique: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    reader: {
      type: Types.ObjectId,
      ref: "User",
    },
    bookPic: String,
  },
  { timestamps: true }
);

const bookModel = mongoose.models.Message || model("Book", bookSchema);
export default bookModel;
