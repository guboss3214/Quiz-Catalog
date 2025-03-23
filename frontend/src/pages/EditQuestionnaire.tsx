import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface Question {
  _id?: string;
  type: string;
  question: string;
  options: string[];
}

interface Questionnaire {
  _id: string;
  name: string;
  description: string;
  questions: Question[];
}

const EditQuestionnaire = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
    _id: "",
    name: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get("/api/questionnaire");
        const found = response.data.find((q: Questionnaire) => q._id === id);
        if (found) {
          setQuestionnaire(found);
        } else {
          toast.error("Questionnaire not found");
        }
      } catch (error) {
        toast.error("Error fetching questionnaire");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [id]);

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    setQuestionnaire((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value,
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestionnaire((prev) => {
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = value;
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions,
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const addOption = (questionIndex: number) => {
    setQuestionnaire((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options.push("");
      return { ...prev, questions: newQuestions };
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestionnaire((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setQuestionnaire((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { type: "Text", question: "", options: [] },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setQuestionnaire((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/questionnaire/${id}`, questionnaire, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Questionnaire updated successfully");
      navigate("/"); // or wherever you want to redirect
    } catch (error) {
      toast.error("Failed to update questionnaire");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Edit Questionnaire</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={questionnaire.name}
              onChange={(e) =>
                setQuestionnaire((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={questionnaire.description}
              onChange={(e) =>
                setQuestionnaire((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-6">
          {questionnaire.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "question", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "type", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Text">Text</option>
                      <option value="Single choice">Single Choice</option>
                      <option value="Multiple choices">Multiple Choices</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="ml-4 p-2 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>

              {question.type !== "Text" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(qIndex)}
                    className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          + Add Question
        </button>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionnaire;
