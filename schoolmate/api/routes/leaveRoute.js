import express from 'express';
import { createLeaveRequest, assignTeacherForLeave, getLeaveRequests, getAllLeaveRequests } from '../controllers/leaveController.js';

const router = express.Router();


router.post('/', createLeaveRequest);
router.post('/assign', assignTeacherForLeave);
router.get('/', getLeaveRequests);
router.get('/all', getAllLeaveRequests);

export default router;
