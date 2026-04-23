const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReason = async (userA, userB) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Explain in 1 short sentence why these two developers should connect:

User A: ${userA.about}
User B: ${userB.about}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { generateReason };