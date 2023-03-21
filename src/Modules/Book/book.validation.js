import joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";
//  01- ID Validation
export const idSchema = {
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
};
