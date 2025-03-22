import express from 'express';
import { 
    addQuestions, 
    getAllQuestions, 
    getQuestionsByDate, 
    updateQuestionSet, 
    deleteQuestionSet 
} from '../controllers/exam.controller.js';

import { 
    submitAnswers, 
    getAllSubmissions, 
    getSubmissionByStudent, 
    deleteSubmission 
} from '../controllers/exam.controller.js';

const router = express.Router();

// Question Routes
router.post('/questions', addQuestions);
router.get('/questions', getAllQuestions);
router.get('/questions/:date', getQuestionsByDate);
router.put('/questions/:id', updateQuestionSet);
router.delete('/questions/:id', deleteQuestionSet);

// Submission Routes
router.post('/submissions', submitAnswers);
router.get('/submissions', getAllSubmissions);
router.get('/submissions/:studentId', getSubmissionByStudent);
router.delete('/submissions/:id', deleteSubmission);

export default router;
