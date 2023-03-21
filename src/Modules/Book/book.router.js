import { Router } from "express";
import auth from "../../MiddleWare/auth.middleware.js";
import {validation} from "../../MiddleWare/validation.js";
import { fileUpload, fileValidation } from "../../Utils/multer.js";
import { idSchema } from "./book.validation.js";
import * as bookController from "./bookController/book.controller.js";
const router = Router();
// 00- Add Book
router.post("/add", fileUpload("book/bookPic",fileValidation.image).single("image"),bookController.addBook);
// 01- Get All Books
router.get("/all", bookController.getAllBooks);
// 02- Get Free Books
router.get("/free", bookController.freeBooks);
// 03- Get Borrowed Books
router.get("/borrowed", bookController.borrowedBooks);
// 04- Borrow Book
router.post("/borrow/:id", auth, validation(idSchema),bookController.borrowBook);
// 05- Return Book
router.post("/return/:id", auth,validation(idSchema), bookController.returnBook);
// 00- Calc Book Fine
router.get("/fine/", auth, bookController.calcFine);
// 06-- Get User Books
router.get("/user", auth, bookController.getUserBooks);
// 07- Find Book
router.get("/:id", auth,validation(idSchema) ,bookController.findBook);
// 08- Delete Book
router.delete("/delete/:id", auth,validation(idSchema) ,bookController.deleteBook);

export default router;
