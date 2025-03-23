import { FC, useState } from "react";
import DeleteQuestionnaireModal from "./DeleteQuestionnaireModal";
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

interface QuestionnaireCardProps {
  questionnaire: Questionnaire;
  onRefresh: () => void;
}

const QuestionnaireCard: FC<QuestionnaireCardProps> = ({
  questionnaire,
  onRefresh,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {questionnaire.name}
            </h3>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to={`/edit-questionnaire/${questionnaire._id}`}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Link>
                    <Link
                      to={`/run-questionnaire/${questionnaire._id}`}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
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
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Run
                    </Link>
                    <button
                      onClick={() => handleDelete()}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {questionnaire.description}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">
                {questionnaire.questions.length}
              </p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">
                {questionnaire.completions}
              </p>
              <p className="text-sm text-gray-500">Completions</p>
            </div>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteQuestionnaireModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          questionnaireId={questionnaire._id}
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default QuestionnaireCard;
