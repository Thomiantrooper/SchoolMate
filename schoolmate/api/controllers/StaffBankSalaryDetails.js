// controllers/staffBankController.js
import StaffSalaryDetails from "../model/StaffSalaryDetails.js";
import StaffBankDetails from "../model/StaffBankDetails.js";
import mongoose from 'mongoose';
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });


// Create Bank Details
export const createBankDetails = async (req, res) => {
  try {
    const { userId, email, name, bank, branch, accountNumber } = req.body;
    const passbookImage = req.file ? req.file.path : "";

    // Create new bank details entry without salary
    const bankDetails = new StaffBankDetails({
      userId,
      email,
      name,
      bank,
      branch,
      accountNumber,
      passbookImage
    });

    // Save to the database
    await bankDetails.save();
    res.status(201).json(bankDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { userId, salary, month, year } = req.body;

    // Find the staff bank details by userId
    const bankDetails = await StaffBankDetails.findOne({ userId });
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found for the user" });
    }

    // Calculate EPF (Employee 8%, Employer 12%) and ETF (Employer 3%)
    const EPF = {
      employee: salary * 0.08, // Employee 8% contribution
      employer: salary * 0.12  // Employer 12% contribution
    };
    const ETF = salary * 0.03;  // Employer 3% ETF contribution

    // Calculate total salary without bonus and leave salary
    const total = salary - EPF.employee;  // Employee's EPF is deducted, but bonus and leave salary are not added yet

    // Update the salary in the bank details
    bankDetails.salary = salary;

    // Save the updated bank details
    await bankDetails.save();

    // Create a new salary details entry (initially without bonus and leave salary)
    const salaryDetails = new StaffSalaryDetails({
      userId,
      salary,
      EPF,
      ETF,
      bonus: 0,  // No bonus initially
      leaveSalary: 0,  // No leave salary initially
      total,
      month,
      year,
      status: "pending" // Set status as "pending"
    });

    await salaryDetails.save();
    res.status(200).json(salaryDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateBonusAndLeaveSalary = async (req, res) => {
  try {
    const { userId, bonus, leaveSalary, month, year, status } = req.body;
    console.log("Received userId:", userId);
console.log("Request Body:", req.body);

    // Find the existing salary details for the given userId, month, and year
    const salaryDetails = await StaffSalaryDetails.findOne({ userId, month, year });
    if (!salaryDetails) {
      return res.status(404).json({ error: "Salary details not found for the user" });
    }

    // Update the bonus and leave salary
    salaryDetails.bonus = bonus;
    salaryDetails.leaveSalary = leaveSalary;
    salaryDetails.status = status;

    // Recalculate total salary (now including bonus and leave salary)
    salaryDetails.total = salaryDetails.salary - salaryDetails.EPF.employee + salaryDetails.bonus - salaryDetails.leaveSalary;

    // Save the updated salary details
    await salaryDetails.save();
    res.status(200).json(salaryDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    const { email, name, bank, branch, accountNumber } = req.body;
    const passbookImage = req.file ? req.file.path : "";

    // Find the bank details by userId
    const bankDetails = await StaffBankDetails.findOne({ userId });
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found for the user" });
    }

    // Update the bank details fields
    bankDetails.email = email || bankDetails.email;
    bankDetails.name = name || bankDetails.name;
    bankDetails.bank = bank || bankDetails.bank;
    bankDetails.branch = branch || bankDetails.branch;
    bankDetails.accountNumber = accountNumber || bankDetails.accountNumber;
    bankDetails.passbookImage = passbookImage || bankDetails.passbookImage;

    // Save the updated bank details
    await bankDetails.save();
    res.status(200).json(bankDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBankDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Staff ID from URL

    // Fetch bank details for the given userId
    const bankDetails = await StaffBankDetails.findOne({ userId });
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found for the user" });
    }
    res.status(200).json(bankDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getAllBankAndSalaryDetails = async (req, res) => {
  try {
    // Perform aggregation to merge bank details with salary details
    const bankAndSalaryDetails = await StaffBankDetails.aggregate([
      {
        $lookup: {
          from: "staffsalarydetails", // The name of the collection for salary details (plural form)
          localField: "userId", // The field to match in the bank details collection
          foreignField: "userId", // The field to match in the salary details collection
          as: "salaryDetails" // Alias for the merged data
        }
      },
      {
        $unwind: {
          path: "$salaryDetails", // Unwind the salaryDetails array to have a single object
          preserveNullAndEmptyArrays: true // If no salary details are found, preserve the bank details
        }
      }
    ]);

    if (!bankAndSalaryDetails || bankAndSalaryDetails.length === 0) {
      return res.status(404).json({ error: "No bank and salary details found" });
    }

    res.status(200).json(bankAndSalaryDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




export const getBankAndSalaryDetailsById = async (req, res) => {
  try {
    let { userId } = req.params;
    console.log("Received userId:", userId);

    // Convert userId to ObjectId if needed
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);

    // Perform aggregation to merge bank details with salary details for a specific user
    const bankAndSalaryDetails = await StaffBankDetails.aggregate([
      {
        $match: { userId: objectId }, // Match with ObjectId
      },
      {
        $lookup: {
          from: "staffsalarydetails",
          localField: "userId",
          foreignField: "userId",
          as: "salaryDetails",
        },
      },
      {
        $unwind: {
          path: "$salaryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    console.log("Aggregation Result:", bankAndSalaryDetails);

    if (!bankAndSalaryDetails || bankAndSalaryDetails.length === 0) {
      return res.status(404).json({ error: "No bank and salary details found for this user." });
    }

    res.status(200).json(bankAndSalaryDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




