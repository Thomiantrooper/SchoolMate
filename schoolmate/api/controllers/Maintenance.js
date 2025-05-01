import MaintenancePayment from "../model/Maintenance.js";
import multer from "multer";

// Setting up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Make file name unique by appending timestamp
  },
});

// Create multer upload middleware
const upload = multer({ storage });

// Create a new maintenance payment
export const createMaintenancePayment = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload.single('paymentSlipImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err });
      }

      const { name, amount, paymentType, date, month, paidStatus } = req.body;
      const paymentSlipImage = req.file ? req.file.path : ''; // Get file path if uploaded

      const newPayment = new MaintenancePayment({
        name,
        amount,
        paymentType,
        date,
        month,
        paidStatus,
        paymentSlipImage,
      });

      await newPayment.save();
      res.status(201).json({ message: 'Payment record created successfully', data: newPayment });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating payment record', error: err });
  }
};

// Get all maintenance payments for a specific month
export const getMaintenancePayments = async (req, res) => {
  try {
    const { month } = req.params;
    const payments = await MaintenancePayment.find({ month });
    res.status(200).json({ message: 'Payments fetched successfully', data: payments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err });
  }
};

// Update payment status and details
export const updateMaintenancePayment = async (req, res) => {
  try {
      // Use multer to handle the file upload
      upload.single('paymentSlipImage')(req, res, async (err) => {
          if (err) {
              return res.status(400).json({ message: 'Error uploading file', error: err });
          }

          const { paymentId } = req.params;
          const { name, amount, paymentType, date, month, paidStatus, removeImage } = req.body;
          
          // Get the existing payment first
          const existingPayment = await MaintenancePayment.findById(paymentId);
          if (!existingPayment) {
              return res.status(404).json({ message: 'Payment not found' });
          }

          // Handle the payment slip image
          let paymentSlipImage;
          if (removeImage === 'true') {
              // If removeImage is true, set to empty string to remove
              paymentSlipImage = '';
          } else if (req.file) {
              // If new file uploaded, use its path
              paymentSlipImage = req.file.path;
          } else {
              // Otherwise keep the existing image
              paymentSlipImage = existingPayment.paymentSlipImage;
          }

          const updatedPayment = await MaintenancePayment.findByIdAndUpdate(
              paymentId,
              { 
                  name, 
                  amount, 
                  paymentType, 
                  date, 
                  month, 
                  paidStatus, 
                  paymentSlipImage 
              },
              { new: true }
          );

          res.status(200).json({ 
              message: 'Payment updated successfully', 
              data: updatedPayment 
          });
      });
  } catch (err) {
      res.status(500).json({ 
          message: 'Error updating payment record', 
          error: err 
      });
  }
};

// Delete a payment record
export const deleteMaintenancePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const deletedPayment = await MaintenancePayment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully', data: deletedPayment });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting payment record', error: err });
  }
};
