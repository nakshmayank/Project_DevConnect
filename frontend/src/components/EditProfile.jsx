import React, { useEffect, useState } from "react";
import Usercard from "./Usercard";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const existingUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
  );
  const [interests, setInterests] = useState(
    Array.isArray(user.interests) ? user.interests.join(", ") : user.interests || "",
  );
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [notif, setNotif] = useState("");
  const followersCount = existingUser?.followersCount || 0;
  const followingCount = existingUser?.followingCount || 0;

  const handleSaveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          name,
          age,
          photoUrl,
          gender,
          about,
          skills,
          interests,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      setNotif(res?.data?.message);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => {
        setError("");
      }, 3000);
      console.log(err.message);
    }
  };

  useEffect(() => {
    existingUser;
  }, [followersCount, followingCount]);

  return (
    <>
      <div className="min-h-screen bg-black text-white px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* EDIT FORM */}
          <div className="w-full lg:w-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Edit Profile
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Age</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  About
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="3"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(interests) ? interests.join(", ") : interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleSaveProfile}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-300 transition mt-4"
              >
                Save Profile
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Usercard
              user={{
                name,
                age,
                photoUrl,
                gender,
                about,
                skills,
                interests,
                email,
                followingCount,
                followersCount,
              }}
              disableActions={true}  
            />
          </div>
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notif}
        </div>
      )}
    </>
  );
};

export default EditProfile;
