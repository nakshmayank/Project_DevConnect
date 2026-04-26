const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { connectionRequestModel } = require("../model/connectionRequest");
const customer = require("../model/customer");
const { validateEditData } = require("../utils/validateEditData");
const { Review } = require("../model/reviews");
const { getEmbedding, buildUserText, cosineSimilarity } = require("../utils/ai");
const { generateReason } = require("../utils/gemini");

const normalizeList = (value = []) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
};

// const getKeywordSet = (text = "") => {
//   return new Set(
//     String(text)
//       .toLowerCase()
//       .replace(/[^a-z0-9\s]/g, " ")
//       .split(/\s+/)
//       .filter((word) => word.length > 2)
//   );
// };

// const getOverlapCount = (source = [], target = []) => {
//   const sourceSet = new Set(source);
//   return target.filter((item) => sourceSet.has(item)).length;
// };

// const buildRecommendation = (loggedInUser, candidateUser) => {
//   const currentSkills = normalizeList(loggedInUser.skills);
//   const currentInterests = normalizeList(loggedInUser.interests);
//   const currentAboutKeywords = [...getKeywordSet(loggedInUser.about)];

//   const candidateSkills = normalizeList(candidateUser.skills);
//   const candidateInterests = normalizeList(candidateUser.interests);
//   const candidateAboutKeywords = [...getKeywordSet(candidateUser.about)];

//   const commonSkills = candidateSkills.filter((skill) =>
//     currentSkills.includes(skill)
//   );
//   const commonInterests = candidateInterests.filter((interest) =>
//     currentInterests.includes(interest)
//   );
//   const aboutOverlapCount = getOverlapCount(currentAboutKeywords, candidateAboutKeywords);

//   const skillScore = Math.min(commonSkills.length * 25, 50);
//   const interestScore = Math.min(commonInterests.length * 20, 30);
//   const aboutScore = Math.min(aboutOverlapCount * 5, 10);

//   let communityScore = 0;
//   if ((candidateUser.followersCount || 0) > 0) {
//     communityScore += 5;
//   }
//   if ((candidateUser.followingCount || 0) > 0) {
//     communityScore += 5;
//   }

//   const recommendationScore = skillScore + interestScore + aboutScore + communityScore;
//   const recommendationReasons = [];

//   if (commonSkills.length > 0) {
//     recommendationReasons.push(
//       `Common skills: ${commonSkills.slice(0, 3).join(", ")}`
//     );
//   }

//   if (commonInterests.length > 0) {
//     recommendationReasons.push(
//       `Shared interests: ${commonInterests.slice(0, 3).join(", ")}`
//     );
//   }

//   if (aboutOverlapCount > 0) {
//     recommendationReasons.push("Profile bio shows similar working interests");
//   }

//   if (communityScore > 0) {
//     recommendationReasons.push("Active in the DevConnect community");
//   }

//   if (recommendationReasons.length === 0) {
//     recommendationReasons.push("Recommended from overall profile similarity");
//   }

//   return {
//     recommendationScore,
//     recommendationReasons,
//     commonSkills,
//     commonInterests,
//   };
// };

userRouter.get("/profile", userAuth, async (req, res) => {
  try {
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
      followingCount
    } = req.user;
    const userData = {
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
      followingCount
    };
    res.send(userData);
  } catch (err) {
    res.status(401).send("User Not Found,Please Register/Login First");
  }
});

//============GET SENT CONNECTION REQUEST=============================
userRouter.get("/sent/requests", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const sentConnections = await connectionRequestModel
      .find({
        fromUserId: loggedInUserId,
        status: { $in: ["interested", "ignored"] },
      })
      .populate("toUserId", [
        "name",
        "age",
        "photoUrl",
        "gender",
        "skills",
        "interests",
        "about",
      ]);

    if (!sentConnections || sentConnections.length <= 0) {
      return res.status(404).json({
        message: "You have not sent connection request to anyone. Send Now!",
      });
    }

    res.status(200).json({
      message: "success",
      data: sentConnections,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= GET INTERESTED CONNECTIONS =================

userRouter.get("/interested/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await connectionRequestModel
      .find({
        toUserId: loggedInUserId,
        status: { $in: ["interested"] }
      })
      .populate("fromUserId", [
        "name",
        "age",
        "photoUrl",
        "gender",
        "about",
        "skills",
        "interests",
        "email"
      ]);

    if (!connections || connections.length === 0) {
      return res.status(404).json({
        message: "No users are interested in you yet",
      });
    }
    // =========WE WILL HANDLE THIS CASE FROM FRONTEND

    res.status(200).json({
      message: "Interested connections fetched successfully",
      data: connections,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch interested connections",
      error: err.message,
    });
  }
});
//===================================Search Bar===================================

// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {

//     const loggedInUserId = req.user._id;
//     const { search } = req.query;

//     let filter = {
//       _id: { $ne: loggedInUserId } // exclude self
//     };

//     if (search && search.trim() !== "") {
//       filter.name = {
//         $regex: search.trim(),
//         $options: "i"
//       };
//     }
//     console.log(search);

//     const searchedUsers = await customer.findOne(filter).select("-password");

//     res.json({
//       message: "true",
//       data: searchedUsers
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// //====================FEED=====================================

// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit; // ✅ FIXED (was global before)

//     const USER_SAFE_DATA = [
//       "name",
//       "age",
//       "photoUrl",
//       "gender",
//       "about",
//       "skills",
//       "email",
//       "followersCount",
//       "followingCount"
//     ];

//     console.log("LoggedInUser:", loggedInUser._id);

//     const connectionRequests = await connectionRequestModel.find({
//       $or: [
//         { fromUserId: loggedInUser._id },
//         { toUserId: loggedInUser._id },
//       ],
//     });

//     console.log(connectionRequests);

//     // ✅ Keep ObjectId type (NO toString)
//     const hiddenUserFromFeed = new Set([loggedInUser._id]);

//     connectionRequests.forEach((cr) => {
//       hiddenUserFromFeed.add(cr.fromUserId);
//       hiddenUserFromFeed.add(cr.toUserId);
//     });

//     console.log("Hidden users:", [...hiddenUserFromFeed]);

//     const usersAll = await customer
//       .find({
//         _id: { $nin: [...hiddenUserFromFeed] }, // ✅ Spread properly
//       })
//       .select(USER_SAFE_DATA)
//       .skip(skip)
//       .limit(limit);

//     console.log("Feed users:", usersAll.length);

//     res.json(usersAll);

//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

const reasonCache = new Map();

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;
    const { search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const USER_SAFE_DATA = [
      "name",
      "age",
      "photoUrl",
      "gender",
      "about",
      "skills",
      "interests",
      "email",
      "followersCount",
      "followingCount"
    ];

    const connectionRequests = await connectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    });

    const hiddenUserFromFeed = new Set([loggedInUser._id]);

    connectionRequests.forEach((cr) => {
      // ❗ Only hide active relationships
      if (["interested", "accepted"].includes(cr.status)) {
        hiddenUserFromFeed.add(cr.fromUserId);
        hiddenUserFromFeed.add(cr.toUserId);
      }
    });

    // 🔥 MAIN FILTER
    let filter = {
      _id: { $nin: [...hiddenUserFromFeed] }
    };

    // 🔥 ADD SEARCH CONDITION
    if (search && search.trim() !== "") {
      filter.name = {
        $regex: search.trim(),
        $options: "i"
      };
    }

    const usersAll = await customer
      .find(filter)
      .select(USER_SAFE_DATA)
    // .skip(skip)
    // .limit(limit);

    let currentUser = loggedInUser;

    if (!loggedInUser.embedding || loggedInUser.embedding.length === 0) {
      const text = buildUserText(loggedInUser);
      const embedding = await getEmbedding(text);

      currentUser = { ...loggedInUser, embedding };
    }

    // 🔥 STEP 1: AI ranking (already added)
    const recommendedUsers = await Promise.all(
      usersAll.map(async (user) => {
        let userEmbedding = user.embedding;

        if (!userEmbedding || userEmbedding.length === 0) {
          const text = buildUserText(user);
          userEmbedding = await getEmbedding(text);
        }

        if (!Array.isArray(userEmbedding) || !Array.isArray(currentUser.embedding)) {
          return {
            ...user.toObject(),
            aiScore: 0,
          };
        }

        const score = cosineSimilarity(currentUser.embedding, userEmbedding);

        return {
          ...user.toObject(),
          aiScore: score * 100,
        };
      })
    );

    recommendedUsers.sort((a, b) => b.aiScore - a.aiScore);


    // 🔥 STEP 2: Gemini explanation (ADD HERE)
    // 🔥 STEP 2: Gemini explanation + cache

    const topUsers = recommendedUsers.slice(0, 3);

    await Promise.all(
      topUsers.map(async (user) => {

        const key = `${loggedInUser._id}_${user._id}`;

        // ✅ cache hit
        if (reasonCache.has(key)) {
          user.reason = reasonCache.get(key);
          return;
        }

        try {
          const reason = await generateReason(loggedInUser, user);

          user.reason = reason || `Matches your interest in ${user.skills?.[0] || "technology"}`;

          // ✅ store in cache
          reasonCache.set(key, reason);

          if (reasonCache.size > 1000) {
            reasonCache.clear();
          }

        } catch {
          user.reason = `Matches your interest in ${user.skills?.[0] || "technology"}`;
        }
      })
    );

    // 🔥 STEP 3: SEND RESPONSE (unchanged)
    res.json({
      message: "success",
      data: recommendedUsers,
    });

  } catch (err) {
    console.error("FEED ERROR:", err); // ✅ ADD
    res.status(500).json({
      message: "Failed to fetch feed",
    });
  }
});

//==================Edit Profile ===============================

userRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    await validateEditData(req);
    const { _id } = req.user;
    const { name, age, photoUrl, gender, about, skills, interests } = req.body;
    const updatedUser = await customer.findByIdAndUpdate(
      { _id: _id },
      {
        $set: {
          name: name,
          age: age,
          photoUrl: photoUrl,
          gender: gender,
          about: about,
          skills: Array.isArray(skills) ? skills : normalizeList(skills),
          interests: Array.isArray(interests) ? interests : normalizeList(interests),
        },
      },
      { new: true },
    );

    const text = buildUserText(updatedUser);

    const embedding = await getEmbedding(text);

    updatedUser.embedding = embedding;
    await updatedUser.save();

    res.send({
      message: `${updatedUser.name} ,Your profile is successfully edited`,
      data: updatedUser,
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Invalid Edit Request" });
  }
});

//=====================GET FOLLOWERS CONNECTIONS ROUTE=============================

userRouter.get("/accepted/followers", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const followers = await connectionRequestModel
      .find({
        status: "accepted",
        toUserId: loggedInUserId
      })
      .populate("fromUserId", [
        "name",
        "age",
        "photoUrl",
        "gender",
        "about",
        "skills",
        "interests",
      ])
      .populate("toUserId", [
        "name",
        "age",
        "photoUrl",
        "gender",
        "about",
        "skills",
        "interests",
      ]);

    res.status(200).json({
      message: " Followers fetched successfully",
      data: followers,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch accepted connections",
      error: err.message,
    });
  }
});

//======================GET FOLLOWING CONNECTION ROUTE==================================
userRouter.get("/accepted/followings", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const followings = await connectionRequestModel
      .find({
        status: "accepted",
        fromUserId: loggedInUserId
      })
      .populate("fromUserId", [
        "name",
        "age",
        "photoUrl",
        "gender",
        "about",
        "skills",
        "interests",
      ])
      .populate("toUserId", [
        "name",
        "age",
        "photoUrl",
        "gender",
        "about",
        "skills",
        "interests",
      ]);

    res.status(200).json({
      message: " Followers fetched successfully",
      data: followings,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch accepted connections",
      error: err.message,
    });
  }


})

//==============Remove Followers=============================

// userRouter.delete(
//   "/accepted/connection/delete/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const loggedInUserId = req.user._id;
//       const {toUserId} = req.params;
//       const deletedConnection = await connectionRequestModel.findOneAndDelete({
//         toUserId:loggedInUserId, // logged in user
//         fromUserId:toUserId, //other user
//         status:"accepted"
//       })
//       res.send({
//         message: "The connection deleted Successfully",
//         data: deletedConnection,
//       });
//     } catch (err) {
//       res.send(err);
//     }
//   },
// );

//======================Remove Following============================
// userRouter.delete(
//   "/accepted/connection/delete/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const loggedInUserId = req.user._id;
//       const {toUserId} = req.params;
//       const deletedConnection = await connectionRequestModel.findOneAndDelete({
//         toUserId:toUserId,// other user
//         fromUserId:loggedInUserId , //logged in user
//         status:"accepted"
//       })
//       res.send({
//         message: "The connection deleted Successfully",
//         data: deletedConnection,
//       });
//     } catch (err) {
//       res.send(err);
//     }
//   },
// );




//=====================reviews=======================

userRouter.get("/review/:toUserId", userAuth, async (req, res) => {
  const { toUserId } = req.params;
  const reviews = await Review.find({ toUserId: toUserId })
    .populate("fromUserId", ["name", "age", "photoUrl"])
    .sort({ createdAt: -1 });
  res.send({ message: "Reviews Fetched successfully", data: reviews });
});

//===================================Search Bar===================================

userRouter.get("/feed/user", userAuth, async (req, res) => {
  try {

    const loggedInUserId = req.user._id;
    const { search } = req.query;

    let filter = {
      _id: { $ne: loggedInUserId } // exclude self
    };

    if (search && search.trim() !== "") {
      filter.name = {
        $regex: search.trim(),
        $options: "i"
      };
    }
    console.log(search);

    const searchedUsers = await customer.findOne(filter).select("-password");

    res.json({
      message: "true",
      data: searchedUsers
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = { userRouter };

//========================followers count==================================


//demo3
