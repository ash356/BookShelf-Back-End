import { verifyToken } from "../Utils/CreateAndVerifyToken.js";
import userModel from "../../DB/Models/User.Model.js";
import { asyncHandler } from "../Utils/errorHandling.js";
const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log({ authorization });
  // 01- Validate Bearer Key
  if (!authorization?.startsWith(process.env.BEARER_KEY)) {
    return res.json({ message: "In-Valid Bearer Key !" });
  }
  // 02- Split Token
  const token = authorization.split(process.env.BEARER_KEY)[1];
  // console.log({ token });
  if (!token) {
    return res.json({ message: "Token Is Required !" });
  }
  // 03- Decoded Token
  const decoded = verifyToken({ token });
  // console.log({ decoded });
  if (!decoded?.id) {
    return res.json({ message: "In-Valid Token !" });
  }
  // 04- Find Auth User
  const authUser = await userModel
    .findById(decoded.id)
    .select(
      "userName email role status borrowedBooks borrowedDates returnDates fine deleted"
    );
  if (!authUser || authUser.deleted) {
    return res.json({ message: "Account Not Found !" });
  }
  // 05- Set User to Request
  req.user = authUser;
  return next();
});
export default auth;
