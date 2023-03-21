import bcrypt from "bcryptjs";
export const hash = ({
  plainText = "",
  saltRound = process.env.SALT_ROUND,
} = {}) => {
  const hashedResult = bcrypt.hashSync(plainText, parseInt(saltRound));
  return hashedResult;
};
export const compare = ({ plainText, hashedValue } = {}) => {
  const match = bcrypt.compareSync(plainText, hashedValue);
  return match;
};
