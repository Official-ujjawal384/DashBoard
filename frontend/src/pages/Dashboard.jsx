import { useEffect, useState } from "react";
// import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { supabase } from "../supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
      } else {
        setSession(data.session);
      }
    };
    getSession();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;

    const fetchQuiz = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-quiz-results`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        // ✅ FIX: Edge function { data: [...] } return karta hai
        setQuizData(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Quiz fetch error:", err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [session]);

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // ✅ Stats calculate
  const totalAttempts = quizData.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(quizData.reduce((sum, q) => sum + q.score, 0) / totalAttempts)
      : 0;
  const avgTotal =
    totalAttempts > 0
      ? Math.round(quizData.reduce((sum, q) => sum + q.total_questions, 0) / totalAttempts)
      : 0;
  const avgPercentage = avgTotal > 0 ? Math.round((avgScore / avgTotal) * 100) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...quizData.map((q) => q.score)) : 0;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  const userName =
    session.user.user_metadata?.full_name || session.user.email || "User";

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-x-hidden">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col z-50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-teal-600">Quiz Dashboard</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-teal-50 text-teal-600 font-medium">
            Overview
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100">
            Quiz History
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100">
            Profile
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 flex items-center gap-2">
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <button
          onClick={logout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 w-full md:ml-64 px-3 py-4 md:p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden bg-white p-2 rounded-lg shadow"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard 👋</h1>
              <p className="text-gray-500 text-sm md:text-base">
                Welcome back, {userName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors">
              <Settings />
            </button>
            <label className="cursor-pointer" title="Profile photo change karo">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-teal-500"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Quiz Start Button */}
        <div className="bg-teal-500 rounded-2xl shadow p-4 md:p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Quiz Shuru Karo! 🚀</h2>
            <p className="text-teal-100 text-sm">General Knowledge quiz do aur score dekho</p>
          </div>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-white text-teal-600 font-bold px-5 py-2 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Start →
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 mb-6">
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {session.user.email}
          </p>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">Name:</span>{" "}
            {session.user.user_metadata?.full_name || "—"}
          </p>
        </div>

        {/* ✅ Stats Cards */}
        {!loading && !fetchError && totalAttempts > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-xs text-gray-400 mb-1">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-800">{totalAttempts}</p>
              <p className="text-xs text-gray-400 mt-1">quizzes diye</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-xs text-gray-400 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-teal-600">{avgScore}</p>
              <p className="text-xs text-gray-400 mt-1">out of {avgTotal}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-xs text-gray-400 mb-1">Average %</p>
              <p className={`text-2xl font-bold ${
                avgPercentage >= 70 ? "text-green-500"
                : avgPercentage >= 40 ? "text-yellow-500"
                : "text-red-500"
              }`}>
                {avgPercentage}%
              </p>
              <p className="text-xs text-gray-400 mt-1">overall performance</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-xs text-gray-400 mb-1">Best Score</p>
              <p className="text-2xl font-bold text-purple-500">{bestScore}</p>
              <p className="text-xs text-gray-400 mt-1">highest ever</p>
            </div>
          </div>
        )}

        {/* Quiz History Table */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Quiz History</h2>

          {loading && (
            <p className="text-gray-400 text-sm py-6 text-center">
              Quiz data load ho raha hai...
            </p>
          )}

          {!loading && fetchError && (
            <div className="text-red-500 bg-red-50 rounded-xl p-4 text-sm">
              Data fetch nahi hua: {fetchError}
            </div>
          )}

          {!loading && !fetchError && quizData.length === 0 && (
            <p className="text-gray-400 text-sm py-6 text-center">
              Abhi tak koi quiz nahi diya. Pehla quiz do!
            </p>
          )}

          {!loading && !fetchError && quizData.length > 0 && (
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500 font-medium">#</th>
                  <th className="text-left text-gray-500 font-medium">Quiz Name</th>
                  <th className="text-left text-gray-500 font-medium">Score</th>
                  <th className="text-left text-gray-500 font-medium">Total</th>
                  <th className="text-left text-gray-500 font-medium">Percentage</th>
                  <th className="text-left text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizData.map((item, i) => {
                  const pct = Math.round((item.score / item.total_questions) * 100);
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{i + 1}</td>
                      <td className="font-medium text-gray-700">{item.quiz_name || "General Quiz"}</td>
                      <td className="text-green-600 font-bold">{item.score}</td>
                      <td>{item.total_questions}</td>
                      <td>
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                          pct >= 70 ? "bg-green-100 text-green-700"
                          : pct >= 40 ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="text-gray-400 text-sm">
                        {new Date(item.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

