import mongoose from "mongoose";
const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_LOCAL)
    .then((result) => {
      console.log(`DB Connected...`);
      //   console.log(result);
    })
    .catch((error) => {
      console.log(`DB Connected...`);
      //   console.log(result);
    });
};
export default connectDB;
