import Payment from "../model/StudentPayment.model.js";
import multer from "multer";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage }).single("slipImage"); // Expecting 'slipImage'

export const makePayment = async (req, res, next) => {
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ message: "File upload failed" });
  
      console.log("Request Body:", req.body); // Debugging: Check received data
      console.log("Uploaded File:", req.file); // Debugging: Check uploaded file
  
      const { userId, username, email, course, bank, branch, amount } = req.body;
      const slipImage = req.file ? req.file.path : null;
  
      if (!userId || !username || !email || !course || !bank || !branch || !amount || !slipImage) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      try {
        const newPayment = new Payment({
          userId,
          username,
          email,
          course,
          bank,
          branch,
          amount,
          slipImage,
        });
  
        await newPayment.save();
        res.status(201).json({ message: "Payment successful", payment: newPayment });
      } catch (error) {
        next(error);
      }
    });
  };
  

export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate("userId", "username email");
    res.json(payments);
  } catch (error) {
    next(error);
  }
};
