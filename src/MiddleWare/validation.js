import joi from "joi";

const dataMethods = ["body", "query", "params", "headers"];
export const generalFields = {
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["com", "net", "edu"] },
  }),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[a-zA-Z]).{8,}$/
      )
    ),
  id: joi.string().required().min(24).max(24).required(),
};
export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          //   return res.json({ message: "Validation Error !", validationResult });
          validationError.push(validationResult.error.details);
        }
      }
    });
    if (validationError.length > 0) {
      return res.json({ message: "Validation Error !", validationError });
    }
    return next();
  };
};
