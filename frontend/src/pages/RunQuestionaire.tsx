import { useState, useEffect } from "react";
import axios from "../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface Question {
  _id: string;
  question: string;
  type: string;
  options?: string[];
}

interface Quiz {
  _id: string;
  name: string;
  questions: Question[];
}

interface Answer {
  [questionId: string]: string | string[];
}

interface ReviewState {
  isReviewing: boolean;
  timeElapsed: string;
}

const RunQuestionaire = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [reviewState, setReviewState] = useState<ReviewState>({
    isReviewing: false,
    timeElapsed: "0:00",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("/api/questionnaire");
        if (response.status === 200) {
          const foundQuiz = response.data.find((q: Quiz) => q._id === id);
          if (foundQuiz) {
            setQuiz(foundQuiz);
            setStartTime(Date.now());
          } else {
            setError("Quiz not found");
          }
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Error loading quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (startTime && !reviewState.isReviewing) {
      const timer = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setReviewState((prev) => ({
          ...prev,
          timeElapsed: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, reviewState.isReviewing]);

  const handleChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    if (!quiz) {
      toast.error("Quiz data is missing");
      return;
    }

    const unansweredQuestions = quiz.questions.filter(
      (q) =>
        !answers[q._id] ||
        (Array.isArray(answers[q._id]) && answers[q._id].length === 0)
    );

    if (unansweredQuestions.length > 0) {
      toast.error(
        `Please answer all questions. ${unansweredQuestions.length} questions remaining.`
      );
      return;
    }

    setReviewState((prev) => ({ ...prev, isReviewing: true }));
  };

  const handleFinalSubmit = async () => {
    const formattedAnswers = quiz!.questions.map((q) => ({
      questionId: q._id,
      response: answers[q._id],
    }));

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const responseData = {
      questionnaireId: id,
      answers: formattedAnswers,
      timeTaken,
    };

    try {
      const response = await axios.post("/api/user-answers", responseData);
      if (response.status === 201) {
        toast.success("Quiz submitted successfully");
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Submission failed";
        toast.error(errorMessage);
        console.error("Submission error:", error.response?.data);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error:", error);
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );

  if (!quiz)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Quiz not found</p>
      </div>
    );

  if (reviewState.isReviewing) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Review Your Answers
          </h2>
          <p className="text-gray-600">Time taken: {reviewState.timeElapsed}</p>
        </div>

        {quiz.questions.map((q, index) => (
          <div key={q._id} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg font-medium text-gray-700 mb-2">
              <span className="text-blue-600 font-bold">{index + 1}.</span>{" "}
              {q.question}
            </p>
            <div className="ml-6 mt-2">
              <p className="text-gray-800 font-medium">
                Your answer:{" "}
                <span className="text-blue-600">
                  {(() => {
                    const answer = answers[q._id];
                    if (Array.isArray(answer)) {
                      return answer.join(", ");
                    }
                    return answer;
                  })()}
                </span>
              </p>
            </div>
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            onClick={() =>
              setReviewState((prev) => ({ ...prev, isReviewing: false }))
            }
            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Back to Quiz
          </button>
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{quiz.name}</h1>
        <div className="text-gray-600 font-medium">
          Time: {reviewState.timeElapsed}
        </div>
      </div>
      {quiz.questions.map((q, index) => (
        <div key={q._id} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg font-medium text-gray-700 mb-4">
            <span className="text-blue-600 font-bold">{index + 1}.</span>{" "}
            {q.question}
          </p>
          {q.type.toLowerCase() === "text" ? (
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={(e) => handleChange(q._id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter your answer..."
            />
          ) : (
            <div className="space-y-2">
              {q.options &&
                q.options.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  >
                    <input
                      type={
                        q.type.toLowerCase() === "multiple choices"
                          ? "checkbox"
                          : "radio"
                      }
                      name={`question-${q._id}`}
                      value={option}
                      checked={
                        Array.isArray(answers[q._id])
                          ? answers[q._id].includes(option)
                          : answers[q._id] === option
                      }
                      onChange={(e) => {
                        if (q.type.toLowerCase() === "multiple choices") {
                          const newAnswers = Array.isArray(answers[q._id])
                            ? [...answers[q._id]]
                            : [];

                          if (e.target.checked) {
                            newAnswers.push(option);
                          } else {
                            const index = newAnswers.indexOf(option);
                            if (index !== -1) {
                              newAnswers.splice(index, 1);
                            }
                          }
                          handleChange(q._id, newAnswers);
                        } else {
                          handleChange(q._id, option);
                        }
                      }}
                      className={`${
                        q.type.toLowerCase() === "multiple choices"
                          ? "form-checkbox text-blue-600 rounded"
                          : "form-radio text-blue-600"
                      } h-5 w-5 focus:ring-blue-500 border-gray-300`}
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Review Answers
      </button>
    </div>
  );
};

export default RunQuestionaire;
