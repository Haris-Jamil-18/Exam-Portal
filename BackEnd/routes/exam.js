const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  startExam,
  submitExam,
  getResult,
  getUserResults,
  getExamResultsForAdmin
} = require("../controller/examController");

// Result routes - Must come before /:id routes
router.get("/result/my-results", protect, authorize("user"), getUserResults);
router.get("/result/:resultId", protect, getResult);

// Admin routes - Create, Update, Delete, Publish exams
router.post("/", protect, authorize("admin"), createExam);
router.put("/:id", protect, authorize("admin"), updateExam);
router.delete("/:id", protect, authorize("admin"), deleteExam);
router.put("/:id/publish", protect, authorize("admin"), publishExam);
router.get("/:id/results", protect, authorize("admin"), getExamResultsForAdmin);

// Public routes - View exams
//router.get("/", getAllExams);
router.get("/", protect, authorize("user", "admin"), getAllExams);
router.get("/:id", getExamById);

// User routes - Start exam, Submit, View results
router.post("/:id/start", protect, authorize("user"), startExam);
router.post(
  "/submission/:submissionId",
  protect,
  authorize("user"),
  submitExam,
);

module.exports = router;
