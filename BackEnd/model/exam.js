const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide exam title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Please provide exam duration in minutes"],
    },
    totalMarks: {
      type: Number,
      required: [true, "Please provide total marks"],
    },
    passingMarks: {
      type: Number,
      required: [true, "Please provide passing marks"],
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["mcq", "shortAnswer", "essay"],
          default: "mcq",
        },
        marks: {
          type: Number,
          required: true,
        },
        options: [String], // For MCQ
        correctAnswer: String, // For MCQ
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
