const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Text", "Single choice", "Multiple choices"],
  },
  question: { type: String, required: true },
  options: { type: [String], default: [] },
});

const questionnaireSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [questionSchema], default: [] },
    completions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questionnaire", questionnaireSchema);
