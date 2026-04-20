import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/devLogo2.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") {
      navigate("/feed");
    } else {
      navigate(`/feed?search=${searchText}`);
      setSearchText("");
    }
  };

  return (
    <div className="w-full">
      {!user && (
        <div className="absolute top-0 left-0 w-full z-50 px-6 py-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevConnect Logo"
              className="w-20 h-20 sm:w-10 sm:h-10 rounded-full object-cover opacity-90"
            />
            <h1 className="text-white text-xl sm:text-4xl font-bold tracking-tight">
              Dev Connect
            </h1>
          </div>
        </div>
      )}

      {user && (
        <div className="navbar bg-[#1C1C1C]/90 backdrop-blur-sm text-white px-4 md:px-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/feed" className="text-xl font-semibold">
                Home
              </Link>
              <Link
                to="/posts"
                className="text-sm px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
              >
                Problem Posts
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden transition focus-within:ring-2 focus-within:ring-white/20">
              <input
                type="text"
                placeholder="Search developers..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="bg-transparent px-4 py-2 text-sm sm:text-base text-white placeholder-gray-400 outline-none w-28 sm:w-44 md:w-64"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-300 transition"
              >
                Search
              </button>
            </div>

            <div className="relative flex items-center gap-3" ref={dropdownRef}>
              <p className="hidden md:block text-sm">Welcome, {user.name}</p>

              <div
                role="button"
                onClick={() => setOpen(!open)}
                className="cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                  <img
                    src={user.photoUrl}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {open && (
                <ul className="absolute right-0 top-14 bg-[#1C1C1C] border border-gray-700 rounded-xl w-52 p-2 shadow-xl z-50">
                  {[
                    { to: "/profile", label: "My Profile" },
                    { to: "/posts", label: "Community Posts" },
                    { to: "/accepted/followers", label: "My Followers" },
                    { to: "/sent/requests", label: "Sent Requests" },
                    { to: "/accepted/followings", label: "My Followings" },
                    { to: "/interested/connections", label: "Incoming Requests" },
                    { to: "/logout", label: "Logout" },
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 hover:bg-gray-800 rounded-lg transition"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
