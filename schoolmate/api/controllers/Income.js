import Income from "../model/Income.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Make file name unique by appending timestamp
  },
});

const upload = multer({ storage });

// Create a new income entry
export const createIncome = async (req, res) => {
    upload.single('slipImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file", error: err });
      }
      try {
        const { name, email, amount, bank, branch, paymentMethod, date, reason, month, status } = req.body;
        const slipImage = req.file ? req.file.path : ""; // Get uploaded file path
  
        const income = new Income({
          name,
          email,
          amount,
          bank,
          branch,
          paymentMethod,
          date,
          slipImage,
          reason,
          month,
          status,
        });
  
        await income.save();
        res.status(201).json({ success: true, message: "Income added successfully", data: income });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  };
  

// Get all income records
export const getAllIncome = async (req, res) => {
    try {
        const incomes = await Income.find();
        res.status(200).json({ success: true, data: incomes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get income by ID
export const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ success: false, message: "Income not found" });
        }
        res.status(200).json({ success: true, data: income });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update income record
export const updateIncome = async (req, res) => {
  upload.single('slipImage')(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: "Error uploading file", error: err });
      }
      try {
          const { 
              name, 
              email, 
              amount, 
              bank, 
              branch, 
              paymentMethod, 
              date, 
              reason, 
              month, 
              status,
              removeImage // Added this to handle image removal
          } = req.body;

          // First get the existing income record
          const existingIncome = await Income.findById(req.params.id);
          if (!existingIncome) {
              return res.status(404).json({ success: false, message: "Income not found" });
          }

          // Handle the slip image
          let slipImage;
          if (removeImage === 'true') {
              // If removeImage is true, set to empty string to remove
              slipImage = '';
          } else if (req.file) {
              // If new file uploaded, use its path
              slipImage = req.file.path;
          } else {
              // Otherwise keep the existing image
              slipImage = existingIncome.slipImage;
          }

          const updatedData = {
              name,
              email,
              amount,
              bank,
              branch,
              paymentMethod,
              date,
              slipImage, // This now properly handles all cases
              reason,
              month,
              status,
          };

          const income = await Income.findByIdAndUpdate(
              req.params.id, 
              updatedData, 
              { new: true }
          );

          res.status(200).json({ 
              success: true, 
              message: "Income updated successfully", 
              data: income 
          });
      } catch (error) {
          res.status(500).json({ 
              success: false, 
              message: error.message 
          });
      }
  });
};

// Delete income record
export const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);
        if (!income) {
            return res.status(404).json({ success: false, message: "Income not found" });
        }
        res.status(200).json({ success: true, message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
