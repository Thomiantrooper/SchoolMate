import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      type: String, // you can store file URLs or filenames
    }
  ],
}, {
  timestamps: true,
});

const Homework = mongoose.model("Homework", homeworkSchema);

export default Homework;
