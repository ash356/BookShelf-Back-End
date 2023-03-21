// 01- AsyncHandler Instead Of Try Catch
export const asyncHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => {
      return res.json({ message: "Error !", error, stack: error.stack });
      // return next(new Error("Error! "));
    });
  };
};
// 02- Global Error Handling Instead Of All Responses
export const globalErrorHandling = (err, req, res, next) => {
  if (err) {
    return res.status(err.cause || 500).json({ message: err.message });
  }
  if (err.name === "CastError" && err.kind === "ObjectId") {
    // handle CastError caused by invalid ObjectId
    return res.status(400).json({ message: err.message });
  }
};
