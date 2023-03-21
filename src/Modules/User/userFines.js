import moment from "moment";
import cron from "node-cron";
import userModel from "../../../DB/Models/User.Model.js";
// run the job at midnight every day
export const calcFines = async () => {
  const users = await userModel.find();
  for (const user of users) {
    let totalFine = 0;
    const fines = [];

    for (const bookId of user.returnDates.keys()) {
      const returnDate = moment(user.returnDates.get(bookId));
      const today = moment();
      if (returnDate.isBefore(today, "day")) {
        // book return date has ended, calculate fine
        const daysLate = today.diff(returnDate, "days");
        const fine = daysLate * 1; // $1 fine for every day late
        totalFine += fine; // add to the total fine amount
        fines.push({ bookId, fine }); // add to the array of fines
      }
    }
    // update the user's fine property in the database
    user.fine = totalFine;
    await user.save();
  }
};
export const calcFinesSchedule = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Schedule Job...");
    await calcFines();
  });
};
