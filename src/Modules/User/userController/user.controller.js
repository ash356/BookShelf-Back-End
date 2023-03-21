import userModel from "../../../../DB/Models/User.Model.js";
import bookModel from "../../../../DB/Models/Book.Model.js";

import { asyncHandler } from "../../../Utils/errorHandling.js";
import { compare, hash } from "../../../Utils/HashAndCompare.js";
// 01- User Profile
export const profile = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select("studentId userName email status phone");
  return res.status(200).json({ message: "Success", user });
});
// 02- Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { userName, phone, status } = req.body;
  const user = await userModel
    .findByIdAndUpdate(
      { _id: req.user._id },
      { userName, phone, status },
      { new: true }
    )
    .select("studentId userName email status phone");
  return res.status(202).json({ message: "Success", user: user._id });
});
// 03- Update Password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  // console.log({ oldPassword, password });
  const user = await userModel.findById(req.user._id);
  const match = compare({ plainText: oldPassword, hashedValue: user.password });
  if (!match) {
    return next(new Error("In-Valid Password !", { cause: 400 }));
  } else {
    // Hashing Password
    const hashPassword = hash({ plainText: password, saltRound: 9 });
    user.password = hashPassword;
    await user.save();
    return res.status(202).json({ message: "Success", user: user._id });
  }
});
// 04- Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.user._id);
  const books = await bookModel.find({ reader: user._id });
  for (const book of books) {
    book.reader = null;
    book.available = true;
    await book.save();
  }
  return res.json({ message: "Success", user: user._id });
});
// 05- Soft Delete check Added In Auth Controller
export const softDeleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  user.deleted = true;
  await user.save();
  const books = await bookModel.find({ reader: user._id });
  for (const book of books) {
    book.reader = null;
    book.available = true;
    await book.save();
  }
  return res.json({ message: "Success", user: user._id });
});
export const profilePic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("File Is Required !"), { cause: 400 });
  }
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { profilePic: `${req.file.dist}` },
    { new: true }
  );
  return res.status(202).json({ message: "Success", file: req.file, user });
});
export const coverPic = asyncHandler(async (req, res, next) => {
  if (!req.files?.length) {
    return next(new Error("File Is Required !"), { cause: 400 });
  }
  const coverPic = [];
  for (const file of req.files) {
    coverPic.push(file.dist);
  }
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { coverPic },
    { new: true }
  );
  return res.status(202).json({ message: "Success", user });
});
