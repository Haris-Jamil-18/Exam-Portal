const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionId: String,
        questionText: String,
        userAnswer: String,
        isCorrect: Boolean,
        marksObtained: Number,
      },
    ],
    totalMarksObtained: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isPassed: Boolean,
    startTime: Date,
    endTime: Date,
    status: {
      type: String,
      enum: ["in-progress", "submitted", "graded"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
