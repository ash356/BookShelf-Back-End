import { asyncHandler } from "../../../Utils/errorHandling.js";
import bookModel from "../../../../DB/Models/Book.Model.js";
import moment from "moment";
import userModel from "../../../../DB/Models/User.Model.js";

// 01- Add Book With Picture
export const addBook = asyncHandler(async (req, res, next) => {
  const { bookName } = req.body;
  // console.log(bookName);
  // Book Name Unique
  const checkBook = await bookModel.findOne({ bookName });
  if (checkBook) {
    return next(new Error("Book Allready Exist !", { cause: 409 }));
  }
  const book = await bookModel.create({ bookName, bookPic: req.file.dist });
  return res.status(200).json({ message: "Success", book });
});
// 0- Get All Books
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await bookModel.find();
  return res.status(200).json({ message: "Success", books });
});
// 0- Get Free Books
export const freeBooks = asyncHandler(async (req, res) => {
  const freeBooks = await bookModel.find({ available: true });
  return res.status(200).json({ message: "Success", freeBooks });
});
// 0- Get Borrowed Books
export const borrowedBooks = asyncHandler(async (req, res) => {
  const borrowBooks = await bookModel
    .find({ available: false })
    .populate({ path: "reader", select: "_id userName email" });
  return res.status(200).json({ message: "Success", borrowBooks });
});
// 0- Borrow Book
export const borrowBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const book = await bookModel.findById(id);
  if (!book || !book.available) {
    return next(new Error("Sorry, This Book is not Available"), { cause: 409 });
  }
  // Change Book Status
  book.available = false;
  book.reader = req.user._id;
  await book.save();
  // Start & End
  const startDate = moment();
  // Clone To Create New Moment
  const endDate = startDate.clone().add(5, "days");
  // const endDate = moment("2023-03-07T00:00:00"); // To Change EndDate While Testing
  // Push to User Array
  req.user.borrowedBooks.push(id);
  req.user.borrowedDates.set(book._id, startDate);
  req.user.returnDates.set(book._id, endDate);
  await req.user.save();
  // console.log(req.user);
  return res.status(200).json({ message: "Success", book });
});
// 0- Calculate Fine For Every User And Also I made A schedule One
export const calcFine = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.user._id)
    .select("borrowedBooks fine returnDates");
  // console.log({ user });
  let totalFine = 0;
  const fines = [];
  for (const bookId of user.returnDates.keys()) {
    const returnDate = moment(user.returnDates.get(bookId));
    const today = moment();
    if (returnDate.isBefore(today, "day")) {
      // book return date has ended, calculate fine
      const daysLate = today.diff(returnDate, "days");
      const fine = daysLate * 1; // $1 fine for every day late
      // console.log(
      //   `Book with ID ${bookId} is ${daysLate} days late. Fine: $${fine}`
      // );
      totalFine += fine;
      fines.push({ bookId, fine });
    }
    // else {
    //   console.log(`Book with ID ${bookId} is not yet due.`);
    // }
  }
  // console.log({ totalFine });
  user.fine = totalFine;
  await user.save();
  if (totalFine == 0) {
    return res.status(200).json({ message: "No Fines To Pay" });
  } else {
    return res.status(200).json({ fines, totalFine });
  }
});
// 0- Return Book // test
export const returnBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // Only The Reader OF The Can Return It If No Fines
  const book = await bookModel.findOne({ _id: id, reader: req.user._id });
  if (!book) {
    return next(new Error("Book Not Found !", { cause: 404 }));
  }
  const totalFine = req.user.fine;
  if (totalFine > 0) {
    return res
      .status(202)
      .json({ message: `Please Pay Your Fines First Total: $ ${totalFine}` });
  }
  // Change Book Status
  book.available = true;
  book.reader = null;
  await book.save();
  return res.status(202).json({ message: "Success No Fines To Pay" });
});
// 0- Get User Books
export const getUserBooks = asyncHandler(async (req, res) => {
  const userBooks = await bookModel
    .find({ reader: req.user._id })
    .populate({ path: "reader", select: "_id userName email" });
  return res.status(200).json({ message: "Success", userBooks });
});
// 0- Find Book By ID
export const findBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const book = await bookModel.findById(id);
  if (!book) {
    return next(new Error("Book Not Found !", { cause: 404 }));
  }
  return res.status(200).json({ message: "Success", book });
});
// 0- Delete Book By ID
export const deleteBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const checkBook = await bookModel.findById(id);
  if (!checkBook) {
    return next(new Error("Book Not Found !", { cause: 404 }));
  } else {
    const book = await bookModel.deleteOne({ _id: id });
    return res.status(200).json({ message: "Success", book });
  }
});
