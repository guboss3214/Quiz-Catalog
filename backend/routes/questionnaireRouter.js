const express = require("express");
const Questionnaire = require("../models/Questionnaire");
const router = express.Router();

router.post("/questionnaire", async (req, res) => {
  try {
    const { name, description, questions } = req.body;
    const newQuestionnaire = new Questionnaire({
      name,
      description,
      questions,
    });
    await newQuestionnaire.save();
    res.status(201).send({ message: "Questionnaire added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Questionnaire creation failed" });
  }
});

router.get("/questionnaire", async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({});
    res.status(200).json(questionnaires);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error in fetching questionnaires", error });
  }
});

router.put("/questionnaire/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, questions } = req.body;

    if (!name || !description || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      { name, description, questions },
      { new: true, runValidators: true }
    );

    if (!updatedQuestionnaire) {
      return res.status(404).json({ message: "Questionnaire not found" });
    }

    res.status(200).json({
      message: "Questionnaire updated successfully",
      questionnaire: updatedQuestionnaire,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/questionnaire/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Questionnaire.findByIdAndDelete(id);
    res.status(200).json({ message: "Questionnaire deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
