// controllers/staffBankController.js
import StaffSalaryDetails from "../model/StaffSalaryDetails.js";
import StaffBankDetails from "../model/StaffBankDetails.js";
import mongoose from 'mongoose';
import multer from "multer";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'vuever.lk@gmail.com',
    pass: 'sppzmnejqhttfnnz'
  }
});

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
    console.log("Request Body:", req.body);

    // Find the staff bank details by userId
    const bankDetails = await StaffBankDetails.findOne({ userId });
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found for the user" });
    }

    // Update the salary in bank details
    bankDetails.salary = salary;
    await bankDetails.save();

    // Check if a salary entry already exists for the same user, month, and year
    const salaryDetails = await StaffSalaryDetails.findOne({ userId, month, year });

    if (!salaryDetails) {
      return res.status(404).json({ 
        error: "Salary details not found for the specified month and year. Please create a salary record first." 
      });
    }

    if (salaryDetails.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Salary is already paid. Only bank details have been updated.",
        bankDetails,
      });
    }

    // Calculate deductions and totals
    const EPF = {
      employee: salary * 0.08, 
      employer: salary * 0.12  
    };
    const ETF = salary * 0.03;  
    const total = salary - EPF.employee;  

    // Update existing salary details
    salaryDetails.salary = salary;
    salaryDetails.EPF = EPF;
    salaryDetails.ETF = ETF;
    salaryDetails.total = total;
    await salaryDetails.save();

    res.status(200).json({
      success: true,
      message: "Salary details updated successfully",
      salaryDetails
    });
  } catch (error) {
    console.error("Error updating salary:", error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};




export const updateBonusAndLeaveSalary = async (req, res) => {
  try {
    const { userId, bonus, leaveSalary, month, year, status } = req.body;
    console.log("Received userId:", userId);
    console.log("Request Body:", req.body);

    // Find the existing salary details
    const salaryDetails = await StaffSalaryDetails.findOne({ userId, month, year }).populate("userId");
    if (!salaryDetails) {
      return res.status(404).json({ error: "Salary details not found for the user" });
    }

    // Find bank details
    const bankDetails = await StaffBankDetails.findOne({ userId }).populate("userId");
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found for the user" });
    }

    

    // Update the salary details
    salaryDetails.bonus = bonus;
    salaryDetails.leaveSalary = leaveSalary;
    salaryDetails.status = status;
    salaryDetails.total = salaryDetails.salary - salaryDetails.EPF.employee + salaryDetails.bonus - salaryDetails.leaveSalary;
    await salaryDetails.save();

    // If status is paid, generate PDF and send email
    if (status === "paid") {
      console.log("✅ Status is 'paid', generating PDF...");

      const pdfPath = await generateSalaryPDF(salaryDetails, bankDetails);
    console.log("✅ PDF Generated at:", pdfPath);

    console.log("📨 Sending email to:", bankDetails.email);
    await sendSalaryEmail(bankDetails.email, pdfPath);
    console.log("✅ Email sent successfully!");
    
    }

    res.status(200).json(salaryDetails);
  } catch (error) {
    console.error("❌ Error updating salary:", error);
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
    const bankAndSalaryDetails = await StaffBankDetails.aggregate([
      {
        $lookup: {
          from: "staffsalarydetails",
          localField: "userId",
          foreignField: "userId",
          as: "salaryDetails"
        }
      },
      { $unwind: { path: "$salaryDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          email: "$user.email"
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


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const ensureUploadsDir = () => {
  const dirPath = path.join(__dirname, 'uploads');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

const generateSalaryPDF = async (salaryDetails, bankDetails) => {
  return new Promise((resolve, reject) => {
    ensureUploadsDir();
    const pdfPath = path.join(__dirname, "./uploads", `salary-${salaryDetails.userId._id}.pdf`);

    console.log("📄 Creating PDF at:", pdfPath);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    doc.fontSize(20).text("Salary Slip", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Employee Name: ${bankDetails.name}`);
    doc.text(`Salary: Rs.${salaryDetails.salary}`);
    doc.text(`EPF Employee: Rs.${salaryDetails.EPF.employee}`);
    doc.text(`EPF Employer: Rs.${salaryDetails.EPF.employer}`);
    doc.text(`ETF: Rs.${salaryDetails.ETF}`);
    doc.text(`Bonus: Rs.${salaryDetails.bonus}`);
    doc.text(`Leave Salary: Rs.${salaryDetails.leaveSalary}`);
    doc.text(`Total Salary: Rs.${salaryDetails.total}`);
    doc.text(`Status: ${salaryDetails.status}`);
    doc.text(`Month: ${salaryDetails.month}/${salaryDetails.year}`);

    doc.end();

    stream.on("finish", () => {
      console.log("✅ PDF successfully generated at:", pdfPath);

      // Check if file exists before resolving
      setTimeout(() => {
        if (fs.existsSync(pdfPath)) {
          console.log("🔍 Verified: PDF file exists.");
          resolve(pdfPath);
        } else {
          console.error("❌ PDF file was not created.");
          reject(new Error("PDF file was not created"));
        }
      }, 1000);
    });

    stream.on("error", (err) => {
      console.error("❌ PDF Generation Error:", err);
      reject(err);
    });
  });
};

const sendSalaryEmail = async (email, pdfPath) => {
  const mailOptions = {
    from: 'vuever.lk@gmail.com',
    to: email,
    subject: "Salary Payment Confirmation",
    text: "Your salary has been paid. Please find the attached salary slip.",
    attachments: [{ filename: "Salary-Slip.pdf", path: pdfPath }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Salary email sent to ${email}`);
  } catch (error) {
    console.error("Error sending salary email:", error);
  }
};



