import jwt from "jsonwebtoken";
export const createToken = ({
  payload = {},
  signature = process.env.TOKEN_SIGNATURE,
  expiresIn = 60 * 60 * 24,
} = {}) => {
  const token = jwt.sign(payload, signature, {
    expiresIn: parseInt(expiresIn),
  });
  return token;
};
export const verifyToken = ({
  token,
  signature = process.env.TOKEN_SIGNATURE,
} = {}) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
};
