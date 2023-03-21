import authRouter from "./Modules/Auth/auth.router.js";
import userRouter from "./Modules/User/user.router.js";
import bookRouter from "./Modules/Book/book.router.js";
import connectDB from "../DB/connection.js";
import { globalErrorHandling } from "./Utils/errorHandling.js";
import { calcFines, calcFinesSchedule } from "./Modules/User/userFines.js";

const initApp = (app, express) => {
  // Convert Buffer Data
  app.use(express.json({}));
  // Allow Calling Static Routes
  app.use("/uploads", express.static("uploads"));
  // DataBase Connection
  connectDB();
  // Start Calculating User Fines
  calcFinesSchedule(); // To Run Every Day At Midnight
  // calcFines(); // To Run Now
  //  Home Page
  app.get("/", (req, res) => {
    return res.json({ message: "Home Page" });
  });
  //    Auth Router
  app.use("/auth", authRouter);
  //   User Router
  app.use("/user", userRouter);
  //   Message Router
  app.use("/book", bookRouter);
  // Handle Routing Errors
  app.all("*", (req, res, next) => {
    return res.json({ message: "Error 404 Page Not Found !" });
  });
  // Global Error Handling In Last MiddleWare Of The Stack
  app.use(globalErrorHandling);
};
export default initApp;
