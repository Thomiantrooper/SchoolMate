import cron from "node-cron";
import StaffSalaryDetails from "./model/StaffSalaryDetails.js";
import StaffBankDetails from "./model/StaffBankDetails.js";
import moment from "moment";

// Schedule the job to run at midnight on the 10th of every month
cron.schedule("0 0 17 * *", async () => {
  try {
    console.log("Running Salary Recreation Job...");

    const bankDetailsList = await StaffBankDetails.find();

    if (bankDetailsList.length === 0) {
      console.log("No bank details found.");
      return;
    }

    const newSalaries = bankDetailsList.map((bankDetails) => {
      const salary = bankDetails.salary || 0;
      const EPF = {
        employee: salary * 0.08,
        employer: salary * 0.12,
      };
      const ETF = salary * 0.03;
      const total = salary - EPF.employee;

      return {
        userId: bankDetails.userId,
        salary,
        EPF,
        ETF,
        bonus: 0,
        leaveSalary: 0,
        total,
        month: moment().format("MM"),
        year: moment().format("YYYY"),
        status: "pending",
      };
    });

    await StaffSalaryDetails.insertMany(newSalaries);

    console.log("Salary records recreated for this month.");
  } catch (error) {
    console.error("Error in salary recreation job:", error);
  }
});

export default cron;
