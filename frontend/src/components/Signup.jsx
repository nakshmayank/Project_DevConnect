import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import signupbg from "../assets/signupbg.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    if (userData) {
      navigate("/feed");
    }
  }, [userData, navigate]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          name,
          age,
          gender,
          photoUrl,
          about,
          skills,
          interests,
          email,
          password,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        alert(
          "You are successfully registered, " +
            res.data.cust1.name +
            "! Please login.",
        );
        navigate("/login");
      } else {
        setError(res?.data?.message );
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message );
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-start justify-center bg-cover bg-center bg-no-repeat pt-28 sm:pt-32 px-4 pb-12"
      style={{
        backgroundImage: `url(${signupbg})`, // ✅ FIXED HERE
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 sm:p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Create Your Account
          </h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white text-white"
              >
                <option value="" disabled className="bg-black text-gray-400">
                  Select Gender
                </option>

                <option value="male" className="bg-black text-white">
                  Male
                </option>

                <option value="female" className="bg-black text-white">
                  Female
                </option>

                <option value="other" className="bg-black text-white">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm block mb-1">Photo URL (Image Address)</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm block mb-1">About</label>
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm block mb-1">Skills (e.g: coding,development)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm block mb-1">Interests (e.g: AI, open source, hackathons)</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-gray-600 rounded focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="w-full mt-6 bg-white text-black py-3 font-semibold rounded hover:bg-gray-300 transition"
          >
            Sign Up
          </button>
            <p className="text-sm text-center mt-4">
              Already a user?{" "}
              <Link to="/login" className="underline hover:text-gray-300">
                Sign In
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
