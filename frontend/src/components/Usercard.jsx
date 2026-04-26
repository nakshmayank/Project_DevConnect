import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUserFromFeed } from "../utils/feedSlice";

const Usercard = ({
  user,
  handleNext,
  handlePrevious,
  isFirst,
  isLast,
  disableActions = false,
}) => {
  const dispatch = useDispatch();
  const {
    _id,
    name,
    age,
    photoUrl,
    gender,
    about,
    skills,
    interests,
    email,
    followersCount,
    followingCount,
  } = user;

  const HandleSendRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transition hover:scale-[1.02] duration-300">
        {/* Image Section */}
        <div className="w-full h-80 overflow-hidden p-3.5">
          <img
            src={
              photoUrl || "https://dummyimage.com/600x800/000/fff&text=No+Image"
            }
            alt="User"
            className="w-full h-full rounded-xl object-cover"
          />
        </div>
        {/*Buttons*/}
        <div className="grid grid-cols-2 gap-4 pt-4 w-full px-4">
          <button
            className="
      flex flex-col items-center justify-center
      py-3 px-2
      rounded-xl
      bg-zinc-800
      border border-zinc-700
      text-white
      hover:bg-zinc-700
      transition
      duration-200
      ease-in-out
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
          >
            <span className="text-lg font-semibold">{followingCount}</span>
            <span className="text-sm text-gray-400">Followings</span>
          </button>

          <button
            className="
      flex flex-col items-center justify-center
      py-3 px-2
      rounded-xl
      bg-zinc-800
      border border-zinc-700
      text-white
      hover:bg-zinc-700
      transition
      duration-200
      ease-in-out
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
          >
            <span className="text-lg font-semibold">{followersCount}</span>
            <span className="text-sm text-gray-400">Followers</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            {age && gender && (
              <p className="text-gray-400 text-sm">
                {age}, {gender}, {email}
              </p>
            )}
          </div>

          {about && (
            <p className="text-gray-300 text-sm leading-relaxed">{about}</p>
          )}

          {typeof user.aiScore === "number" && (
            <div className="rounded-xl border border-green-700/40 bg-green-950/40 p-4 space-y-2">
              <p className="text-green-400 text-sm font-semibold">
                AI Match: {user.aiScore.toFixed(1)}%
              </p>

              {user.reason && (
                <p className="text-gray-300 text-sm italic">{user.reason}</p>
              )}
            </div>
          )}

          {skills && (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {(Array.isArray(skills)
                ? skills
                : typeof skills === "string"
                  ? skills.split(",")
                  : []
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

          {interests && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Interests
              </p>
              <div className="flex flex-wrap gap-2 md:justify-start">
                {(Array.isArray(interests)
                  ? interests
                  : typeof interests === "string"
                    ? interests.split(",")
                    : []
                ).map((interest, index) => (
                  <span
                    key={index}
                    className="bg-emerald-900/60 text-emerald-200 text-xs px-3 py-1 rounded-full"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={disableActions}
              onClick={() =>
                !disableActions && HandleSendRequest("ignored", _id)
              }
              className={`flex-1 py-2 rounded-lg font-semibold transition
  ${
    disableActions
      ? "bg-gray-600 cursor-not-allowed opacity-50"
      : "bg-red-600 hover:bg-red-700 text-white"
  }`}
            >
              Ignore
            </button>

            <button
              disabled={disableActions}
              onClick={() =>
                !disableActions && HandleSendRequest("interested", _id)
              }
              className={`flex-1 py-2 rounded-lg font-semibold transition
  ${
    disableActions
      ? "bg-gray-600 cursor-not-allowed opacity-50"
      : "bg-green-600 hover:bg-green-700 text-white"
  }`}
            >
              Interested
            </button>
          </div>
          {/* <div className="join grid grid-cols-2">
            <button onClick={()=>handlePrevious} className="join-item btn btn-outline">« Previous</button>
            <button onClick={()=>handleNext} className="join-item btn btn-outline">Next »</button>
          </div> */}

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className="py-2 rounded-lg border border-gray-600 text-white disabled:opacity-40"
            >
              « Previous
            </button>

            <button
              onClick={handleNext}
              disabled={isLast}
              className="py-2 rounded-lg border border-gray-600 text-white disabled:opacity-40"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usercard;
