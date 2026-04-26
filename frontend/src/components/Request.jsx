


import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { increaseFollowers } from "../utils/userSlice";

const Request = () => {
  const request = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true); // ✅ loading state

  const requestArray = Array.isArray(request) ? request : [];

  const handleAcceptedRequest = async (status,r) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + r.fromUserId._id,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      dispatch(removeRequests(r._id));
      dispatch(increaseFollowers());
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleRejectedStatus=async(status,r)=>{
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + r.fromUserId._id,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequests(r._id));
      // dispatch(increaseFollowers());
      alert(res.data.message);
    } catch (err) {
      console.log(err.message);
    }

  }

  const fetchRequests = async () => {
    try {
      setLoading(true); // ✅ start loading

      // ✅ clear old requests immediately
      dispatch(addRequests([]));

      const res = await axios.get(
        BASE_URL + "/interested/connections",
        { withCredentials: true }
      );

      dispatch(addRequests(res.data?.data || []));
    } catch (err) {
      console.log(err.message);
      dispatch(addRequests([])); // ensure state cleared even on error
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* =================== LOADING STATE =================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading Requests...
      </div>
    );
  }

  /* =================== EMPTY STATE =================== */

  if (requestArray.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        No Incoming Requests
      </div>
    );
  }

  /* =================== MAIN UI =================== */

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Incoming Requests
        </h1>

        <div className="space-y-8">
          {requestArray.map((r) => {

            const { name, age, photoUrl, gender, about, skills } =
              r.fromUserId || {};

            return (
              <div
                key={r._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl transition hover:border-zinc-700"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">

                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-zinc-700">
                      <img
                        src={
                          photoUrl ||
                          "https://dummyimage.com/200x200/000/fff&text=User"
                        }
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-xl font-semibold">{name}</h2>

                    {age && gender && (
                      <p className="text-sm text-zinc-400">
                        {age}, {gender}
                      </p>
                    )}

                    {about && (
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {about}
                      </p>
                    )}

                    {skills && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {(Array.isArray(skills)
                          ? skills
                          : skills.split(",")
                        ).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-zinc-800 text-xs px-3 py-1 rounded-full"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                      onClick={() => handleRejectedStatus("rejected", r)}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleAcceptedRequest("accepted", r)}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
                    >
                      Accept
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Request;