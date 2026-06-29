import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSubmitting = useRef(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    isSubmitting.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data?.user) {
        alert("Signup successful! Check your email.");
        navigate("/");
      }

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://quiz-dashboard-pi.vercel.app/dashboard",
      },
    });

    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="md:w-2/5 bg-gradient-to-br from-teal-400 to-green-400 text-white flex flex-col items-center justify-center p-10">
          <h1 className="text-4xl font-bold mb-5">Welcome Back!</h1>

          <p className="text-center text-sm mb-8 opacity-90">
            To keep connected with us please login with your personal info
          </p>

          <Link
            to="/"
            className="border border-white px-10 py-3 rounded-full hover:bg-white hover:text-teal-500 transition"
          >
            SIGN IN
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">

          <h1 className="text-4xl font-bold text-center text-teal-500 mb-6">
            Create Account
          </h1>

          {/* GOOGLE LOGIN */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-12 h-12 border rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mb-6">
            or use your email for registration
          </p>

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="block mx-auto bg-teal-500 text-white px-12 py-3 rounded-full hover:bg-teal-600 transition"
            >
              {loading ? "Creating..." : "SIGN UP"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}


