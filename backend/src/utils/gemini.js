const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReason = async (userA, userB) => {
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-latest" });

        const prompt = `
Compare their skills, interests, and goals and explain in 1 short sentence why they should connect:

User A:
Skills: ${userA.skills?.join(", ")}
Interests: ${userA.interests?.join(", ")}
About: ${userA.about}

User B:
Skills: ${userB.skills?.join(", ")}
Interests: ${userB.interests?.join(", ")}
About: ${userB.about}
`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Gemini error:", err.message);
        return "Good match based on profile similarity";
    }
};

module.exports = { generateReason };