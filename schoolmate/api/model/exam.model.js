import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    grade: { type: String, required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true }
    }],
    date: { type: Date, required: true }
});

const Question = mongoose.model("Question", QuestionSchema);

// models/Submission.js
const SubmissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    answers: [{ questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, selectedOption: { type: String, required: true } }],
    marks: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model("Submission", SubmissionSchema);

export { Question, Submission };
