import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Body from "./components/Body";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Logout from "./components/Logout";
import Connection from "./components/Connection";
import Request from "./components/Request";
import LandingPage from "./components/LandingPage";
import SentRequest from "./components/SentRequest";
import Followings from "./components/Followings";
import Chat from "./components/Chat";
import Posts from "./components/Posts";

function App() {
  const user = useSelector((store) => store.user);

  return (
    <BrowserRouter basename="/">
      <Routes>

        {/* Landing Route Guard */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/feed" replace /> : <LandingPage />
          }
        />

        {/* App Layout */}
        <Route element={<Body />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sent/requests" element={<SentRequest/>}/>
          <Route path="/interested/connections" element={<Request />} />
          <Route path="/accepted/followers" element={<Connection />} />
          <Route path="/accepted/followings" element={<Followings/>}/>
          <Route path="/chat/:targetUserId" element ={<Chat/>}/>
          <Route path="/posts" element={<Posts/>}/>
        </Route>

        {/* 404 */}
        <Route path="*" element={<p>This page doesn't exist</p>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
