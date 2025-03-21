import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ]
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
