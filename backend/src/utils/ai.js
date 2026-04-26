const { pipeline } = require("@xenova/transformers");

let extractor;

const loadModel = async () => {
  extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
};

const getEmbedding = async (text) => {
  try {
    if (!extractor) {
      console.warn("Model not loaded yet");
      return [];
    }

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (err) {
    console.error("Embedding error:", err.message);
    return [];
  }
};

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

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