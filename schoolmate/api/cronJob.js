import cron from "node-cron";
import StaffSalaryDetails from "./model/StaffSalaryDetails.js";
import StaffBankDetails from "./model/StaffBankDetails.js";
import moment from "moment";

// Schedule at 00:14 AM on the 1st of every month
cron.schedule("0 0 10 * *", async () => {
  try {
    console.log("Running Monthly Salary Job at", new Date().toISOString());

    const bankDetailsList = await StaffBankDetails.find().select('userId salary');

    if (!bankDetailsList?.length) {
      console.log("No bank details found.");
      return;
    }

    const prevMonth = moment().format("MMMM"); // Previous month
    const prevYear = moment().format("YYYY"); // Current year (adjust if fiscal year differs)

    const salaryRecords = bankDetailsList.map(bankDetail => ({
      userId: bankDetail.userId,
      salary: bankDetail.salary || 0,
      EPF: {
        employee: (bankDetail.salary || 0) * 0.08,
        employer: (bankDetail.salary || 0) * 0.12
      },
      ETF: (bankDetail.salary || 0) * 0.03,
      bonus: 0,
      leaveSalary: 0,
      total: (bankDetail.salary || 0) * 0.92, // salary - employee EPF
      month: prevMonth, // Assign to previous month
      year: prevYear,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await StaffSalaryDetails.insertMany(salaryRecords);
    console.log(`Created ${salaryRecords.length} records for ${prevMonth} ${prevYear}`);

  } catch (error) {
    console.error("Salary Job Failed:", error);
    // Add your alert system here (email/SMS)
  }
});

export default cron;