const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
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
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },
    totalMarks: Number,
    marksObtained: Number,
    percentage: Number,
    grade: String, // A, B, C, D, F
    isPassed: Boolean,
    attemptNumber: {
      type: Number,
      default: 1,
    },
    resultStatus: {
      type: String,
      enum: ["pass", "fail"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
