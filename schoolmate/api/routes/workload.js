import express from 'express';
import { getWorkload, assignWorkload, toggleStarTask } from '../controllers/workloadController.js';

const router = express.Router();

router.get('/workload', getWorkload); // Get tasks and teachers
router.post('/assign', assignWorkload); // Assign task to teacher
router.post('/star', toggleStarTask); // Toggle star on task

export default router;
