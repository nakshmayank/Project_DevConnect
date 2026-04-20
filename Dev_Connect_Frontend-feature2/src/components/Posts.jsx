import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";

const MAX_ATTACHMENTS = 4;
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

const categoryOptions = [
  "Development",
  "Design",
  "Integration",
  "Deployment",
  "Debugging",
  "Career",
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

const formatDate = (value) =>
  new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Posts = () => {
  const user = useSelector((store) => store.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Development",
    tags: "",
    images: [],
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/posts", {
        withCredentials: true,
      });
      setPosts(res.data?.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const remainingSlots = MAX_ATTACHMENTS - form.images.length;

    if (remainingSlots <= 0) {
      setError(`You can upload up to ${MAX_ATTACHMENTS} screenshots only`);
      event.target.value = "";
      return;
    }

    const limitedFiles = selectedFiles.slice(0, remainingSlots);
    const oversizedFile = limitedFiles.find((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      setError("Each screenshot must be smaller than 1.5 MB");
      event.target.value = "";
      return;
    }

    try {
      const dataUrls = await Promise.all(
        limitedFiles.map((file) => readFileAsDataUrl(file)),
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...dataUrls].slice(0, MAX_ATTACHMENTS),
      }));
      setError("");
    } catch (err) {
      setError(err.message || "Unable to process selected screenshots");
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        images: form.images,
      };

      const res = await axios.post(BASE_URL + "/posts", payload, {
        withCredentials: true,
      });

      setPosts((prev) => [res.data.data, ...prev]);
      setForm({
        title: "",
        description: "",
        category: "Development",
        tags: "",
        images: [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to publish post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-7xl mx-auto grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl h-fit xl:sticky xl:top-8">
          <div className="space-y-2 mb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
              Community Help
            </p>
            <h1 className="text-3xl font-bold">Ask the developer community</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Share blockers, design doubts, integration issues, or debugging
              problems and let other developers connect with you directly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Query title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Example: React build breaks after socket integration"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-zinc-500"
                maxLength={120}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-zinc-500"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Describe the problem
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Explain what you tried, what broke, and what kind of help you need."
                className="w-full min-h-40 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 resize-y"
                maxLength={3000}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="react, api, ui, mongodb"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Screenshots
              </label>
              <label className="flex items-center justify-center w-full min-h-28 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-center px-4 cursor-pointer hover:border-zinc-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-zinc-400">
                  Upload up to {MAX_ATTACHMENTS} screenshots to show the issue
                </span>
              </label>
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {form.images.map((image, index) => (
                  <div
                    key={`${image.slice(0, 20)}-${index}`}
                    className="relative rounded-2xl overflow-hidden border border-zinc-800"
                  >
                    <img
                      src={image}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition disabled:opacity-60"
            >
              {submitting ? "Publishing..." : "Post my query"}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                Recent Queries
              </p>
              <h2 className="text-3xl font-bold">Developer problem board</h2>
            </div>
            <p className="text-sm text-zinc-400">
              {posts.length} {posts.length === 1 ? "post" : "posts"} available
            </p>
          </div>

          {loading ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
              <p className="text-zinc-400">
                Be the first developer to share a blocker or ask for help.
              </p>
            </div>
          ) : (
            posts.map((post) => {
              const isOwnPost = post.author?._id === user?._id;

              return (
                <article
                  key={post._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          post.author?.photoUrl ||
                          "https://dummyimage.com/200x200/000/fff&text=User"
                        }
                        alt={post.author?.name || "Developer"}
                        className="w-14 h-14 rounded-2xl object-cover border border-zinc-700"
                      />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm px-3 py-1 rounded-full bg-zinc-800 text-zinc-200">
                            {post.category || "Development"}
                          </span>
                          {isOwnPost && (
                            <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
                              Your post
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-semibold">{post.title}</h3>
                        <p className="text-sm text-zinc-400">
                          Posted by {post.author?.name || "Unknown developer"} on{" "}
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {!isOwnPost && post.author?._id && (
                      <Link
                        to={`/chat/${post.author._id}`}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-medium"
                      >
                        Help in chat
                      </Link>
                    )}
                  </div>

                  <p className="mt-5 text-zinc-200 leading-7 whitespace-pre-wrap">
                    {post.description}
                  </p>

                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={`${post._id}-${tag}`}
                          className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {Array.isArray(post.images) && post.images.length > 0 && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      {post.images.map((image, index) => (
                        <a
                          key={`${post._id}-image-${index}`}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition"
                        >
                          <img
                            src={image}
                            alt={`${post.title} attachment ${index + 1}`}
                            className="w-full h-64 object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-zinc-400">
                      {post.author?.about || "Open to helping with development problems."}
                    </div>
                    {!isOwnPost && post.author?._id && (
                      <Link
                        to={`/chat/${post.author._id}`}
                        className="text-sm text-zinc-100 hover:text-zinc-300 transition"
                      >
                        Open personal chat to discuss a solution
                      </Link>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default Posts;
