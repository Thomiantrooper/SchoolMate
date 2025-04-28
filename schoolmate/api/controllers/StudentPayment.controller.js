import Payment from "../model/StudentPayment.model.js";
import multer from "multer";
import mongoose from "mongoose";
import { jsPDF } from "jspdf";
import nodemailer from 'nodemailer';
import fs from 'fs'


const transporter = nodemailer.createTransport({
  service: 'gmail', // Example for Gmail, adjust based on your email provider
  auth: {
    user: 'vuever.lk@gmail.com',
    pass: 'sppzmnejqhttfnnz' , // Add your email password or app-specific password here
  }
});

const generatePaymentReceiptPDF = (payment) => {
  const doc = new jsPDF();
  
  doc.text("Payment Receipt", 20, 10);
  const text = `
    Dear ${payment.userId?.username || "Student"},

    This is to confirm the payment made for the following details:

    - Student ID: ${payment.userId?._id}
    - Amount: $${payment.amount}
    - Grade: ${payment.grade}
    - Bank: ${payment.bank}
    - Branch: ${payment.branch}
    - Payment Method: ${payment.method}
    - Month: ${payment.month}
    - Payment Date: ${new Date(payment.date).toLocaleDateString() || 'N/A'}
    - Payment Status: ${payment.status}

    Thank you for your payment.

    Sincerely,
    Your Institution Name
  `;

  doc.text(text, 20, 20);

  const pdfPath = `uploads/payment-receipt-${payment._id}.pdf`;
  doc.save(pdfPath); // Save PDF to a file

  return pdfPath; // Return the file path for later attachment
};

// Function to send email with the payment receipt attached
const sendPaymentStatusEmail = (email, status, payment) => {
  let subject, text;

  if (status === 'in-process') {
    subject = 'Your Payment is in Process';
    text = 'We have received your payment request and it is currently being processed.';
  } else if (status === 'paid') {
    subject = 'Payment Successful';
    text = 'Your payment has been successfully processed.';
  } else if (status === 'failed') {
    subject = 'Payment Failed';
    text = 'Unfortunately, your payment has failed. Please try again.';
  }

  // Generate PDF receipt for paid status
  let attachments = [];
  if (status === 'paid') {
    const pdfPath = generatePaymentReceiptPDF(payment);
    attachments = [{
      filename: `payment-receipt-${payment._id}.pdf`,
      path: pdfPath,
      contentType: 'application/pdf'
    }];
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
    attachments: attachments,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent: " + info.response);

      // Delete the PDF after sending the email
      if (status === 'paid') {
        fs.unlinkSync(pdfPath);
      }
    }
  });
};

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
      if (err) {
          console.log("File upload error:", err);
          return res.status(500).json({ message: "File upload failed" });
      }

      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      const { userId, email, grade, bank, branch, amount, method, month, status } = req.body;
      const slipImage = req.file ? req.file.path : null;

      if (!userId || !email || !grade || !bank || !branch || !amount || !method || !month || !slipImage) {
          console.log("Missing fields in the request body");
          return res.status(400).json({ message: "All fields are required" });
      }

      try {
          const newPayment = new Payment({
              userId,
              email,
              grade,
              bank,
              branch,
              amount,
              method,
              month,
              slipImage,
              status,  // Ensure status is set, default is false
          });

          await newPayment.save();
          sendPaymentStatusEmail(email, 'in-process', newPayment);
          res.status(201).json({ message: "Payment successful", payment: newPayment });
      } catch (error) {
          console.log("Error while saving payment:", error);
          next(error);
      }
  });
};


  

  export const getPayments = async (req, res, next) => {
    try {
      const payments = await Payment.find()
        .populate("userId", "username email studentEmail") // Populate the userId with username and email
        .exec();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  };

  export const getStudentPaymentDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if ID is valid before querying the database
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid student ID format" });
      }
  
      const payments = await Payment.find({ userId: id })
        .populate("userId", "username email")
        .exec();
  
      if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "No payment details found" });
      }
  
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching student payment details:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  export const updatePaymentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      // Validate status
      if (!["paid", "failed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
  
      const updatedPayment = await Payment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      sendPaymentStatusEmail(updatedPayment.email, status, updatedPayment);
      res.status(200).json({ message: `Payment marked as ${status}`, updatedPayment });
    } catch (error) {
      res.status(500).json({ message: "Error updating payment status", error });
    }
  };