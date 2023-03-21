import { Router } from "express";
import auth from "../../MiddleWare/auth.middleware.js";
import {validation} from "../../MiddleWare/validation.js";
import { fileUpload, fileValidation } from "../../Utils/multer.js";
import { passwordSchema, updateSchema } from "./user.validation.js";
import * as userController from "./userController/user.controller.js";
const router = Router();
// 01- Get User Profile
router.get("/profile", auth, userController.profile);
// 02- Update User Profile
router.patch("/update", auth, validation(updateSchema),userController.updateProfile);
// 03- Update Password
router.put("/password",auth,validation(passwordSchema),userController.updatePassword);
// 04- Delete User
router.delete("/delete",auth,userController.deleteUser);
// 05- Soft Delete User
router.delete("/softDelete",auth,userController.softDeleteUser);
// 06- Profile Picture
router.patch("/profilePic",auth,fileUpload('/user/profilePic',fileValidation.image).single("image"),userController.profilePic);
// 07- Cover Picture
router.patch("/coverPic",auth,fileUpload('/user/coverPic',fileValidation.image).array("image",4),userController.coverPic);
export default router;
