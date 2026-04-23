const { pipeline } = require("@xenova/transformers");

let extractor;

// load model once
const loadModel = async () => {
  extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
};

// convert profile → embedding
const getEmbedding = async (text) => {
  if (!extractor) throw new Error("Model not loaded");

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};

// cosine similarity
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

// build text
const buildUserText = (user) => {
  return `
  Skills: ${(user.skills || []).join(", ")}
  Interests: ${(user.interests || []).join(", ")}
  About: ${user.about || ""}
  `;
};

module.exports = {
  loadModel,
  getEmbedding,
  cosineSimilarity,
  buildUserText,
};