import express from "express";
import {
  createBankDetails,
  updateSalary,
  updateBonusAndLeaveSalary,
  updateBankDetails,
  getBankDetailsByUserId,
  getAllBankAndSalaryDetails,
  getBankAndSalaryDetailsById

} from "../controllers/StaffBankSalaryDetails.js";
import multer from "multer";

const router = express.Router();

// Multer setup for file uploads (passbook image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });


router.post("/", upload.single("passbookImage"), createBankDetails);


router.put("/update-salary", updateSalary);


router.put("/update-bonus-leave", updateBonusAndLeaveSalary);


router.put("/:userId", upload.single("passbookImage"), updateBankDetails);


router.get("/:userId", getBankDetailsByUserId);


router.get("/", getAllBankAndSalaryDetails);


router.get('/bank-salary-details/:userId', getBankAndSalaryDetailsById);




export default router;
