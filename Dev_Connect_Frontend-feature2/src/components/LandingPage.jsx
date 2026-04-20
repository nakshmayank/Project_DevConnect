import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import logo from "../assets/devLogo2.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) navigate("/feed");
  }, [user, navigate]);

  const featuredDevelopers = [
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      img: "https://img.freepik.com/premium-photo/crossed-arms-business-portrait-happy-man-city-confident-startup-goals-commute-travel-professional-job-face-male-entrepreneur-urban-town-career-working-success_590464-211042.jpg"
    },
    {
      name: "Priya Sharma",
      role: "AI Engineer",
      img: "https://img.freepik.com/premium-photo/portrait-happy-successful-manager-working-office_219285-43.jpg"
    },
    {
      name: "Michael Lee",
      role: "DevOps Specialist",
      img: "https://img.freepik.com/free-photo/indian-man-black-suit-by-window-modern-building_496169-2868.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      name: "Robert Brown",
      role: "Frontend Architect",
      img: "https://media.istockphoto.com/id/1415537841/photo/asian-graphic-designer-working-in-office-artist-creative-designer-illustrator-graphic-skill.jpg?s=612x612&w=0&k=20&c=Cot30JpGiYsAA0SdsNtusecbHTKu_fyMBi1BT5i8GyY="
    },
    {
      name: "Daniel White",
      role: "Backend Engineer",
      img: "https://img.freepik.com/free-photo/attractive-woman-enjoying-modern-technology-home_329181-4288.jpg?semt=ais_hybrid&w=740&q=80"
    }
  ];

  return (
    <div
      className="text-white min-h-screen font-sans bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://dummyimage.com/1920x1080/000000/222222&text=Replace+Background+Image')"
      }}
    >
      {/* Overlay */}
      <div className="bg-black/70 min-h-screen">

        {/* NAVBAR */}
        <nav className="fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent">
          <div className="px-4 sm:px-8 py-4 flex justify-between items-center">

            {/* Left: Logo + Text */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="DevConnect Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <h1 className="text-xl sm:text-2xl font-bold">
                DevConnect
              </h1>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition rounded-md"
            >
              Sign In
            </button>

          </div>
        </nav>

        {/* HERO */}
        <section className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            The Developer Network.
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
            Connect, collaborate, and build the future of code.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-300 transition rounded-lg"
          >
            Get Started
          </button>

          {/* Dummy UserCard */}
          <div className="mt-16 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-64">
              <img
                src="https://hips.hearstapps.com/hmg-prod/images/facebook-founder-and-ceo-mark-zuckerberg-delivers-the-news-photo-1740153091.pjpeg"
                alt="Hero User"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 text-black">
              <h3 className="text-xl font-bold">Mark Zukerberg</h3>
              <p className="text-sm text-gray-600 mt-1">41, Male</p>
              <p className="text-sm mt-3">
                CEO of Meta (formly facebook)
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED DEVELOPERS */}
        <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Featured Developers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

            {featuredDevelopers.map((dev, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"
              >
                <div className="h-56">
                  <img
                    src={dev.img}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 text-center">
                  <h4 className="font-semibold">{dev.name}</h4>
                  <p className="text-sm text-gray-600">{dev.role}</p>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-800 py-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} devConnect. All rights reserved.
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;