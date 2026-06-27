import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "India ka rashtriya pakshi kaun sa hai?",
    options: ["Kabutar", "Mor", "Tota", "Hans"],
    answer: "Mor",
  },
  {
    id: 2,
    question: "2 + 2 kitna hota hai?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    id: 3,
    question: "Suraj kis disha mein ugta hai?",
    options: ["Paschim", "Uttar", "Purv", "Dakshin"],
    answer: "Purv",
  },
  {
    id: 4,
    question: "HTML ka full form kya hai?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "None of these",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    id: 5,
    question: "JavaScript kya hai?",
    options: ["Database", "Programming Language", "Operating System", "Browser"],
    answer: "Programming Language",
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const q = questions[current];
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
  };

  const saveResult = async (finalScore) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from("quiz_results").insert({
        user_id: session.user.id,
        quiz_name: "General Knowledge",
        score: finalScore,
        total_questions: total,
      });
      setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    const isCorrect = selected === q.answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
      saveResult(newScore);
    }
  };

  // Result screen
  if (finished) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">
            {percentage >= 70 ? "🎉" : percentage >= 40 ? "😊" : "😅"}
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 mb-6">General Knowledge</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-teal-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-2xl font-bold text-teal-600">{score}</p>
              <p className="text-xs text-gray-400">out of {total}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Percentage</p>
              <p className={`text-2xl font-bold ${
                percentage >= 70 ? "text-green-500"
                : percentage >= 40 ? "text-yellow-500"
                : "text-red-500"
              }`}>
                {percentage}%
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Result</p>
              <p className={`text-lg font-bold ${percentage >= 40 ? "text-green-500" : "text-red-500"}`}>
                {percentage >= 40 ? "Pass" : "Fail"}
              </p>
            </div>
          </div>

          {saving && (
            <p className="text-gray-400 text-sm mb-4">Result save ho raha hai...</p>
          )}
          {saved && (
            <p className="text-green-500 text-sm mb-4">✅ Result dashboard mein save ho gaya!</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="flex-1 border border-teal-500 text-teal-600 py-3 rounded-xl font-medium hover:bg-teal-50 transition-colors"
            >
              Dobara Khelo
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-lg">

        {/* Progress */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Question {current + 1} of {total}
          </span>
          <span className="text-sm font-medium text-teal-600">
            Score: {score}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {q.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((option) => {
            let style =
              "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ";

            if (!selected) {
              style += "border-gray-200 hover:border-teal-400 hover:bg-teal-50";
            } else if (option === q.answer) {
              style += "border-green-500 bg-green-50 text-green-700 font-medium";
            } else if (option === selected && option !== q.answer) {
              style += "border-red-400 bg-red-50 text-red-600";
            } else {
              style += "border-gray-200 opacity-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={style}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {selected && (
          <button
            onClick={handleNext}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {current + 1 === total ? "Result Dekho" : "Agla Sawaal →"}
          </button>
        )}

      </div>
    </div>
  );
}
