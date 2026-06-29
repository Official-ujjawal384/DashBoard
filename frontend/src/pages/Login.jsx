
import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://quiz-dashboard-pi.vercel.app",
      },
    });

    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex items-center justify-center bg-gray-100 px-4 py-4">

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-2/5 bg-[#06045E] text-white flex items-center justify-center p-8 min-h-[250px]">

          <div className="text-center lg:text-left">
            <p className="text-2xl md:text-3xl mb-2">
              Hello!
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Have a <br />
              GOOD DAY
            </h1>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-3/5 p-6 md:p-8">

          <h1 className="text-3xl font-bold text-center text-[#06045E] mb-6">
            Login
          </h1>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#06045E]"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#06045E]"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#06045E]"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#06045E] hover:opacity-90 text-white py-3 rounded-lg text-lg font-semibold transition"
            >
              Login
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="google"
            />

            Continue with Google
          </button>

          {/* SIGNUP LINK */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            Don't have any account?{" "}
            <Link
              to="/signup"
              className="text-[#06045E] font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;







