

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData) {
      navigate("/feed");
    }
  }, [userData, navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Welcome Back! " + res.data.user.name);
        dispatch(addUser(res.data.user));
        navigate("/feed");
      }
    } catch (err) {
      setError(err?.response?.data?.message);
      alert("Login failed");
      console.log(err);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/2057860611/photo/fingerprint-icon-on-digital-screen.jpg?b=1&s=1024x1024&w=0&k=20&c=en5bHJ8el8ShFweMPQwhR1P_gBjCr2fMANlxzp9qK9Q=')"
      }}
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 text-white shadow-lg">

          <h2 className="text-3xl font-bold mb-6 text-center">
            Welcome Back!
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="text"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-white text-black py-2 font-semibold rounded hover:bg-gray-300 transition"
            >
              Login
            </button>

            <p className="text-sm text-center mt-4">
              New user?{" "}
              <Link to="/signup" className="underline hover:text-gray-300">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;