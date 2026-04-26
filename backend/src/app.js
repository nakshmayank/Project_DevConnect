require("dotenv").config(); 
const express =require("express");
const DBconnect = require("./config/database");
const customer = require("./model/customer");
const jwt = require ("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app =express();
const {userAuth} = require("./middleware/userAuth");
const bcrypt =require("bcrypt");
const revalidate = require("./scripts/revalidate");
const { validateSignUpData } = require("./utils/validateIncomingData");
const {authRouter} = require("./routes/authRoutes");
const {requestRouter} = require("./routes/requestRoutes");
const {userRouter} = require("./routes/userRoutes");
const {reviewRouter} =require("./routes/reviewRoutes");
const {postRouter} = require("./routes/postRoutes");
const { messageRouter } = require("./routes/messageRoutes");
const initializeSocket = require("./utils/socket");
const { loadModel } = require("./utils/ai");
const http = require("http");
const server= http.createServer(app);

initializeSocket(server);

app.use(cors({
    origin:"http://localhost:5173", //this is whitelisting the domain name
    credentials:true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));
app.use("/",authRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",reviewRouter);
app.use("/",postRouter);
app.use("/messages", messageRouter);

app.get("/",async(req,res)=>{
    res.send("Server is setup")
});

app.get("/profile",userAuth,async(req,res)=>{
    const {name,age,email} =req.user;
    res.send({
        "message":`Welcome ${name}`,
        "age":age,
        "email":email
    })
})

async function startServer(){
    try{
        await DBconnect();
        console.log("Successfully connected to DB");
        console.log(process.env.PORT);

        await loadModel();
        console.log("AI model loaded");

        server.listen(process.env.PORT, () => {
            console.log("Server running on port 9193" );
        });

    } catch(err){
        console.log(err);
    }
}

startServer();
