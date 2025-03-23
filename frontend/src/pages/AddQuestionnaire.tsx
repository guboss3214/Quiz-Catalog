import axios from "../config/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Answer {
  text: string;
}

interface Question {
  id: number;
  name: string;
  description: string;
  type: "Text" | "Single choice" | "Multiple choices";
  options: Answer[];
}

const AddQuestionnaire = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const addQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: newId, name: "", description: "", type: "Text", options: [] },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addAnswer = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...q.options, { text: "" }],
            }
          : q
      )
    );
  };

  const removeAnswer = (questionId: number, answerId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, index) => index !== answerId),
            }
          : q
      )
    );
  };

  const updateQuestionType = (
    questionId: number,
    newType: "Text" | "Single choice" | "Multiple choices"
  ) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, type: newType } : q))
    );
  };

  const updateQuestionText = (questionId: number, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, name: text } : q))
    );
  };

  const updateAnswerText = (
    questionId: number,
    answerId: number,
    text: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((a, index) =>
                index === answerId ? { ...a, text } : a
              ),
            }
          : q
      )
    );
  };

  const saveQuize = async () => {
    const data = {
      name: name,
      description: description,
      questions: questions.map((question) => ({
        type: question.type,
        question: question.name,
        options: question.options.map((option) => option.text),
      })),
    };

    try {
      if (!data.name || !data.description) {
        toast.error("Please fill all fields");
        return;
      }
      if (data.name && data.description && data.questions.length === 0) {
        toast.error("Quiz must have at least one question");
        return;
      }
      await axios.post("/api/questionnaire", data);
      toast.success("Questionnaire created successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create questionnaire");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Quiz</h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new quiz.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Quiz Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter quiz name"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter quiz description"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Question {index + 1}
                </h3>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.name}
                    onChange={(e) =>
                      updateQuestionText(question.id, e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your question"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question Type
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      updateQuestionType(
                        question.id,
                        e.target.value as
                          | "Text"
                          | "Single choice"
                          | "Multiple choices"
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Text">Text</option>
                    <option value="Single choice">Single choice</option>
                    <option value="Multiple choices">Multiple choices</option>
                  </select>
                </div>
              </div>

              {(question.type === "Single choice" ||
                question.type === "Multiple choices") && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Answer Options
                  </label>
                  <div className="space-y-3">
                    {question.options.map((answer, answerIndex) => (
                      <div
                        key={answerIndex}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            updateAnswerText(
                              question.id,
                              answerIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder={`Option ${answerIndex + 1}`}
                        />
                        <button
                          onClick={() => removeAnswer(question.id, answerIndex)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addAnswer(question.id)}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={addQuestion}
            className="w-full flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Question
          </button>
          <button
            onClick={saveQuize}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionnaire;
