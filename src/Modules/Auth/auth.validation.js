import joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";
// 01- SignUp Validation
export const signUpSchema = {
  body: joi
    .object({
      userName: joi.string().alphanum().required(),
      email: generalFields.email,
      password: generalFields.password,
      cPassword: joi.string().valid(joi.ref("password")).required(),
      studentId: joi.number().integer().required(),
    })
    .required(),
};
//  02- LogIn Validation
export const logInSchema = {
  body: joi
    .object({
      email: generalFields.email,
      password: generalFields.password,
    })
    .required(),
};
