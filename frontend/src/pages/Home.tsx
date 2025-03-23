import axios from "../config/axios";
import { useEffect, useState } from "react";
import QuestionnaireCard from "../components/QuestionnaireCard";
import { Link } from "react-router-dom";

interface Questionnaire {
  _id: number;
  name: string;
  description: string;
  questions: {
    id: number;
    text: string;
    type: string;
    options: string[];
  }[];
  completions: number;
  numberOfQuestions: number;
  numberOfCompletions: number;
}

const Home = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get("/api/questionnaire");
        if (response.status === 200) {
          setQuestionnaires(response.data);
        } else {
          console.log("Error: ", response.status);
        }
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
        setError("Failed to fetch questionnaires");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaires();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Quiz Catalog</h1>
            <div className="flex space-x-3">
              <Link
                to="/add-questionnaire"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Quizzes
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {questionnaires.length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Completions
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {questionnaires.reduce(
                  (acc, curr) => acc + (curr.completions || 0),
                  0
                )}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Quizzes
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {questionnaires.length}
              </dd>
            </div>
          </div>
        </div>
        {questionnaires.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {questionnaires.map((questionnaire) => (
              <QuestionnaireCard
                key={questionnaire._id}
                questionnaire={questionnaire}
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No quizzes
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new quiz.
            </p>
            <div className="mt-6">
              <Link
                to="/add-questionnaire"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Quiz
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
