import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getReview, addReview, deleteReview, updateReview } from "../utils/reviewSlice";

const Review = ({ toUserId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(3);
  const [editingId, setEditingId] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const reviews = useSelector((store) => store.review);

  const reviewArray = Array.isArray(reviews) ? reviews : [];

  /* ================= ADD / EDIT REVIEW ================= */

  const handleAddReview = async () => {
    try {
      if (!review.trim()) return alert("Please write something");

      if (editingId) {
        const response = await axios.patch(
          BASE_URL + "/review/" + editingId,
          { comment: review, rating },
          { withCredentials: true }
        );

        dispatch(updateReview(response.data.data)); // ✅ update instead of add
        setEditingId(null);
      } else {
        const response = await axios.post(
          BASE_URL + "/review",
          { toUserId, comment: review, rating },
          { withCredentials: true }
        );

        dispatch(addReview(response.data.data)); // ✅ append
      }

      setReview("");
      setRating(3);
    } catch (err) {
      console.log(err.message);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    try {
      await axios.delete(BASE_URL + "/review/" + id, {
        withCredentials: true,
      });

      dispatch(deleteReview(id));
    } catch (err) {
      console.log(err.message);
    }
  };

  /* ================= FETCH REVIEWS ================= */

  const getReviews = async () => {
    try {
      if (!toUserId) return;

      const response = await axios.get(
        BASE_URL + "/review/" + toUserId,
        { withCredentials: true }
      );

      dispatch(getReview(response.data.data)); // ✅ set full array
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getReviews();
  }, [toUserId,editingId]); 

  /* ================= UI ================= */

  return (
    <div className="w-full max-w-xl mx-auto bg-black text-white p-6 rounded-2xl border border-zinc-800 shadow-xl">

      {reviewArray.length === 0 && (
        <p className="text-center text-zinc-400 mb-6">No reviews yet</p>
      )}

      <div className="space-y-6 mb-8">
        {reviewArray.map((r) => {
          const isOwner = r?.fromUserId?._id === user?._id;

          return (
            <div
              key={r._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-700">
                  <img
                    alt="profile"
                    src={
                      r?.fromUserId?.photoUrl ||
                      "https://dummyimage.com/200x200/000/fff&text=User"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + Date */}
                <div className="flex-1">
                  <div className="font-semibold">
                    {r?.fromUserId?.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {new Date(r?.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Rating */}
                <div className="text-yellow-400 text-sm">
                  ★ {r?.rating}
                </div>

                {/* Edit/Delete */}
                {isOwner && (
                  <div className="flex gap-3 text-zinc-400">
                    <button
                      onClick={() => {
                        setReview(r.comment);
                        setRating(r.rating);
                        setEditingId(r._id);
                      }}
                      className="hover:text-white transition"
                    >
                      ✍🏽
                    </button>

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="hover:text-red-500 transition"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-3 text-zinc-300 text-sm leading-relaxed">
                {r?.comment}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Section */}
      <div className="space-y-4">
        <label className="text-sm text-zinc-400">
          {editingId ? "Edit Review" : "Write a Review"}
        </label>

        <textarea
          placeholder="Write your comment here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full h-24 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
        />

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition ${
                star <= rating ? "text-yellow-400" : "text-zinc-600"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <button
          onClick={handleAddReview}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
        >
          {editingId ? "Update Review" : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default Review;