import { Router } from "express";
import { generalFields, validation } from "../../MiddleWare/validation.js";
import { logInSchema, signUpSchema } from "./auth.validation.js";
import * as authController from "./AuthController/auth.controller.js";
const router = Router();
router.post("/sign-up", validation(signUpSchema), authController.signUp);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/confirmNewEmail/:token", authController.confirmNewEmail);
router.patch("/forgetPassword/", authController.forgetPassword);
router.patch("/resetPassword/",validation(generalFields.password), authController.resetPassword);
router.post("/log-in", validation(logInSchema), authController.LogIn);
export default router;
