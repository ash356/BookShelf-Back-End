import userModel from "../../../../DB/Models/User.Model.js";
import {
  createToken,
  verifyToken,
} from "../../../Utils/CreateAndVerifyToken.js";
import { compare, hash } from "../../../Utils/HashAndCompare.js";
import { asyncHandler } from "../../../Utils/errorHandling.js";
import sendEmail from "../../../Utils/nodeMailer.js";
import { customAlphabet } from "nanoid";
//  01- SignUp Method
export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, studentId } = req.body;
  // console.log({ userName, email, password });
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    // return res.json({ message: "Email Allready Exist !" });
    return next(new Error("Email Allready Exist !", { cause: 409 }));
  } else {
    // Send Email To Confirm Email
    const token = createToken({
      payload: { email },
      expiresIn: 60 * 5,
      signature: process.env.EMAIL_TOKEN,
    });
    const link = `http://localhost:5000/auth/confirmEmail/${token}`;
    const refreshToken = createToken({
      payload: { email },
      expiresIn: 60 * 60 * 24 * 30,
      signature: process.env.EMAIL_TOKEN,
    });

    const refreshLink = `http://localhost:5000/auth/confirmNewEmail/${refreshToken}`;
    const html = `<a href="${link}"> Click To Confirm Email</a> <br> <br> <a href="${refreshLink}"> Click To Send New Email</a> <br>`;

    const info = await sendEmail({ to: email, subject: "Confirm Email", html });
    // console.log({ info });
    if (!info) {
      return next(new Error("Rejected Email"), { cause: 400 });
    }
    const hashPassword = hash({ plainText: password });
    const user = await userModel.create({
      userName,
      email,
      password: hashPassword,
      studentId,
    });
    return res.status(201).json({ message: "Success", user: user._id });
  }
});
//  02- Login Method
export const LogIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || user.deleted) {
    // return res.json({ message: "Account Not Found !" });
    return next(new Error("Account Not Found !", { cause: 404 }));
  } else {
    const match = compare({ plainText: password, hashedValue: user.password });
    if (!match) {
      // return res.json({ message: "In-Valid Password !" });
      return next(new Error("In-Valid Password !", { cause: 400 }));
    } else {
      const token = createToken({
        payload: {
          id: user._id,
          isLoggedIn: true,
          rule: user.role,
        },
        expiresIn: 60 * 60 * 24,
      });
      user.status = "OnLine";
      await user.save();
      return res.status(200).json({ message: "Success", token });
    }
  }
});
// 03- Confirm Email Method
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });

  const user = await userModel.updateOne({ email }, { confirmEmail: true });
  return user.modifiedCount
    ? res.status(200).json({ message: "Success Login Now" })
    : next(new Error("Not Register Account", { cause: 400 }));
});
// 04- New Confirm Email Method
export const confirmNewEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
  // Send Email To Confirm Email
  const newToken = createToken({
    payload: { email },
    expiresIn: 60 * 5,
    signature: process.env.EMAIL_TOKEN,
  });
  const link = `http://localhost:5000/auth/confirmEmail/${token}`;
  const refreshLink = `http://localhost:5000/auth/confirmNewEmail/${newToken}`;
  const html = `<a href="${link}"> Click To Confirm Email</a> <br> <br> <a href="${refreshLink}"> Click To Send New Email</a> <br>`;
  const info = await sendEmail({ to: email, subject: "Confirm Email", html });
  if (!info) {
    return next(new Error("Rejected Email"), { cause: 400 });
  }
  return res.status(200).json({ message: "Success Check You Email " });
});
// 05- forgetpassword
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Email Not Found !", { cause: 404 }));
  } else {
    const nanoid = customAlphabet(process.env.alphabet, 6);
    const resetCode = nanoid();
    // console.log(resetCode);
    user.resetCode = resetCode;
    await user.save();
    const info = await sendEmail({
      to: email,
      subject: "Password Reset Code",
      text: `Your Password Reset Code Is ${resetCode}.`,
    });
    // console.log({ info });
    if (!info) {
      return next(new Error("Rejected Email"), { cause: 400 });
    }

    return res.status(201).json({ message: "Success", user: user.email });
  }
});

// 06- Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, newPassword } = req.body;
  const user = await userModel.findOne({ email, resetCode });
  if (!user) {
    return next(new Error("Invalid Reset Code"));
  } else {
    const hashPassword = hash({ plainText: newPassword, saltRound: 9 });
    user.password = hashPassword;
    user.resetCode = null;
    await user.save();
    return res.status(200).json({ message: "Password Reset Successful" });
  }
});
