import {Question, Submission} from "../model/exam.model.js";
import mongoose from 'mongoose';


// Question Controller
export const addQuestions = async (req, res) => {
    try {
        const { grade, questions, date } = req.body;
        const newQuestionSet = new Question({ grade, questions, date });
        await newQuestionSet.save();
        res.status(201).json({ message: 'Questions added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getQuestionsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const questions = await Question.find({ date });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateQuestionSet = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuestionSet = await Question.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedQuestionSet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteQuestionSet = async (req, res) => {
    try {
        const { id } = req.params;
        await Question.findByIdAndDelete(id);
        res.json({ message: "Question set deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submission Controller
export const submitAnswers = async (req, res) => {
    try {
        const { studentId, studentName, answers } = req.body;
        let marks = 0;

        for (let ans of answers) {
            // Convert questionId to ObjectId
            const questionSet = await Question.findOne({ 'questions._id': new mongoose.Types.ObjectId(ans.questionId) });

            if (!questionSet) {
                return res.status(400).json({ error: `Question with ID ${ans.questionId} not found.` });
            }

            const question = questionSet.questions.find(q => q._id.equals(ans.questionId));
            if (question.correctAnswer === ans.selectedOption) {
                marks++;
            }
        }

        const newSubmission = new Submission({ studentId, studentName, answers, marks });
        await newSubmission.save();
        res.json({ message: 'Submission successful', marks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find().populate('studentId', 'name');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubmissionByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const submissions = await Submission.find({ studentId }).populate('studentId', 'name');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        await Submission.findByIdAndDelete(id);
        res.json({ message: "Submission deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
