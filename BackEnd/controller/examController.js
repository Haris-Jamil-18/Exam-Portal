const Exam = require("../model/exam");
const Submission = require("../model/submission");
const Result = require("../model/result");

// @desc    Create Exam (Admin only)
// @route   POST /api/exam
// @access  Private/Admin
exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks,
      passingMarks,
      questions,
      startDate,
      endDate,
      isPublished,
    } = req.body;

    // Validation
    if (!title || !duration || !totalMarks || !passingMarks) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const exam = await Exam.create({
      title,
      description,
      duration,
      totalMarks,
      passingMarks,
      questions,
      startDate,
      endDate,
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all exams
// @route   GET /api/exam
// @access  Public
exports.getAllExams = async (req, res) => {
  try {
    let exams;

    // 👨‍💼 Admin: see all exams
    if (req.user.role === "admin") {
      exams = await Exam.find().populate("createdBy", "email");
    }
    // 👩‍🎓 User: see only published exams
    else {
      exams = await Exam.find({ isPublished: true }).populate(
        "createdBy",
        "email",
      );
    }

    // 👩‍🎓 Add hasAttempted ONLY for users
    if (req.user.role === "user") {
      const examsWithAttemptStatus = await Promise.all(
        exams.map(async (exam) => {
          const attempted = await Result.exists({
            examId: exam._id,
            userId: req.user.id,
          });

          return {
            ...exam.toObject(),
            hasAttempted: !!attempted,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        count: examsWithAttemptStatus.length,
        exams: examsWithAttemptStatus,
      });
    }

    // 👨‍💼 Admin response (no hasAttempted)
    res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.getAllExams = async (req, res) => {
//   try {
//     const exams = await Exam.find({ isPublished: true }).populate(
//       "createdBy",
//       "email",
//     );

//     res.status(200).json({
//       success: true,
//       count: exams.length,
//       exams,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// @desc    Get single exam
// @route   GET /api/exam/:id
// @access  Public
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Exam (Admin only)
// @route   PUT /api/exam/:id
// @access  Private/Admin
exports.updateExam = async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check if user is the creator
    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this exam",
      });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete Exam (Admin only)
// @route   DELETE /api/exam/:id
// @access  Private/Admin
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check if user is the creator or admin
    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this exam",
      });
    }

    await Exam.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Publish Exam (Admin only)
// @route   PUT /api/exam/:id/publish
// @access  Private/Admin
exports.publishExam = async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // ✅ TOGGLE publish / unpublish
    exam.isPublished = !exam.isPublished;
    await exam.save();

    res.status(200).json({
      success: true,
      message: `Exam ${exam.isPublished ? "published" : "unpublished"} successfully`,
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.publishExam = async (req, res) => {
//   try {
//     let exam = await Exam.findById(req.params.id);

//     if (!exam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found",
//       });
//     }

//     exam = await Exam.findByIdAndUpdate(
//       req.params.id,
//       { isPublished: true },
//       { new: true },
//     );

//     res.status(200).json({
//       success: true,
//       message: "Exam published successfully",
//       exam,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// @desc    Start Exam (User)
// @route   POST /api/exam/:id/start
// @access  Private/User
exports.startExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check if exam is published
    if (!exam.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Exam is not published yet",
      });
    }

    // IF ALREADY ATTEMPTED, PREVENT MULTIPLE ATTEMPTS
    const existingResult = await Result.findOne({
      examId: req.params.id,
      userId: req.user.id,
    });

    if (existingResult) {
      return res.status(400).json({ message: "Exam already attempted" });
    }

    // Check if user already has an active submission
    let submission = await Submission.findOne({
      examId: req.params.id,
      userId: req.user.id,
      status: "in-progress",
    });

    // if (submission) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "Continuing existing submission",
    //     submission,
    //   });
    // }

    if (submission) {
      return res.status(200).json({
        success: true,
        message: "Continuing existing submission",
        submission,
        exam: {
          id: exam._id,
          title: exam.title,
          duration: exam.duration,
          totalMarks: exam.totalMarks,
          questions: exam.questions,
        },
      });
    }

    // Create new submission
    submission = await Submission.create({
      examId: req.params.id,
      userId: req.user.id,
      startTime: new Date(),
      status: "in-progress",
    });

    //PREVENT LEAKING OF CORRECT OPTIONS
    const safeQuestions = exam.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      marks: q.marks,
      options: q.options,
    }));

    res.status(201).json({
      success: true,
      message: "Exam started successfully",
      submission,
      exam: {
        id: exam._id,
        title: exam.title,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit Exam (User)
// @route   POST /api/exam/submission/:submissionId
// @access  Private/User
exports.submitExam = async (req, res) => {
  try {
    const { answers } = req.body;

    const submission = await Submission.findById(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check if it's user's submission
    if (submission.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit this exam",
      });
    }

    const exam = await Exam.findById(submission.examId);

    // Time enforcement
    const now = Date.now();
    const startTime = new Date(submission.startTime).getTime();
    const timeTaken = now - startTime;
    const allowedTime = exam.duration * 60 * 1000;

    //let autoSubmitted = false;
    //     if (timeTaken > allowedTime) {
    //   autoSubmitted = true;
    // }
    if (timeTaken > allowedTime) {
      submission.status = "submitted";
    }

    // Calculate marks
    let totalMarksObtained = 0;
    let answersWithMarks = [];

    answers.forEach((answer) => {
      const question = exam.questions.find(
        (q) => q._id.toString() === answer.questionId,
      );
      if (question) {
        let isCorrect = false;
        let marksObtained = 0;

        if (question.questionType === "mcq") {
          isCorrect = answer.userAnswer === question.correctAnswer;
          if (isCorrect) {
            marksObtained = question.marks;
            totalMarksObtained += question.marks;
          }
        }

        answersWithMarks.push({
          questionId: answer.questionId,
          questionText: question.questionText,
          userAnswer: answer.userAnswer,
          isCorrect,
          marksObtained,
        });
      }
    });

    const percentage = (totalMarksObtained / exam.totalMarks) * 100;
    const isPassed = totalMarksObtained >= exam.passingMarks;

    // Update submission
    submission.answers = answersWithMarks;
    submission.totalMarksObtained = totalMarksObtained;
    submission.percentage = percentage;
    submission.isPassed = isPassed;
    submission.endTime = new Date();
    submission.status = "submitted";
    await submission.save();

    // Create result
    const result = await Result.create({
      examId: submission.examId,
      userId: submission.userId,
      submissionId: submission._id,
      totalMarks: exam.totalMarks,
      marksObtained: totalMarksObtained,
      percentage: percentage,
      isPassed: isPassed,
      resultStatus: isPassed ? "pass" : "fail",
    });

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      submission,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's result
// @route   GET /api/exam/result/:resultId
// @access  Private
exports.getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate("examId", "title totalMarks passingMarks")
      .populate("userId", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    // Check authorization
    if (
      result.userId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this result",
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's all results
// @route   GET /api/exam/my-results
// @access  Private/User
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate("examId", "title totalMarks passingMarks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all results of an exam (Admin)
// @route   GET /api/exam/:id/results
// @access  Private/Admin
exports.getExamResultsForAdmin = async (req, res) => {
  try {
    const examId = req.params.id;

    const results = await Result.find({ examId })
      .populate("userId", "name email")
      .populate("examId", "title totalMarks passingMarks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
