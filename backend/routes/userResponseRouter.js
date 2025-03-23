const express = require("express");
const router = express.Router();
const Response = require("../models/Response");
const mongoose = require("mongoose");
const Questionnaire = require("../models/Questionnaire");

router.post("/user-answers", async (req, res) => {
  const { questionnaireId, answers, timeTaken } = req.body;

  if (!questionnaireId || !answers || typeof timeTaken !== "number") {
    return res.status(400).json({
      message: "All fields are required and timeTaken must be a number",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
    return res.status(400).json({ message: "Invalid questionnaire ID format" });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res
      .status(400)
      .json({ message: "Answers must be a non-empty array" });
  }

  for (const answer of answers) {
    if (
      !answer.questionId ||
      !mongoose.Types.ObjectId.isValid(answer.questionId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid question ID format in answers" });
    }
    if (answer.response === undefined || answer.response === null) {
      return res
        .status(400)
        .json({ message: "Each answer must have a response" });
    }
  }

  try {
    const newResponse = new Response({
      questionnaireId,
      answers,
      timeTaken,
    });

    await newResponse.save();

    await Questionnaire.findByIdAndUpdate(
      questionnaireId,
      { $inc: { completions: 1 } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Response saved successfully", response: newResponse });
  } catch (error) {
    console.error("Error saving response:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
