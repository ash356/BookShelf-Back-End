import joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";
// 01- Update Validation
export const updateSchema = {
  body: joi
    .object({
      userName: joi.string().alphanum().required(),
      phone: joi.string().required(),
      status: joi.string().required(),
    })
    .required(),
};
// 02- Password Validation
export const passwordSchema = {
  body: joi
    .object({
      oldPassword: generalFields.password,
      password: generalFields.password,
    })
    .required(),
};
//  03- ID Validation
export const idSchema = {
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
};
