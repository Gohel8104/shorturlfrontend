import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi"; 

const Secret = () => {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const fetchUserId = async () => {
      const token = Cookies.get("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const { data } = await axios.post(
          "https://pdf-flipper.vercel.app/checkAuth",
          { token },
          { withCredentials: true }
        );
        setUserId(data.userId);
        if (!localStorage.getItem("loggedIn")) {
          toast.success("Logged in successfully!");
          localStorage.setItem("loggedIn", "true");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        navigate("/login");
      }
    };
    fetchUserId();
  }, [navigate, setUserId]);

  const handleLogout = () => {
    Cookies.remove("jwtToken", { path: "/" });
    localStorage.removeItem("loggedIn");
    toast.info("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-blue-600 to-purple-700 flex flex-col items-center justify-center text-white">
      
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between bg-gradient-to-r from-blue-700 to-purple-800 shadow-lg px-6 md:px-8 py-4 fixed top-0 left-0 right-0 z-10">
        
        {/* Logo & Hamburger Icon */}
        <div className="flex items-center w-full justify-between">
          <Link
            to={`/retrieve/${userId}`}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 md:px-5 py-2 rounded-lg transition duration-300 shadow-md"
          >
            Your PDFs
          </Link>

          {/* Centered Title (Only for PC) */}
          <div className="hidden text-4xl  md:block absolute left-1/2 transform -translate-x-1/2 text-yellow-400  md:text-2xl font-extrabold tracking-wider">
            <Link to="/">📖</Link>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Auth Buttons for Desktop */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="bg-teal-500 hover:bg-teal-600 h-10 w-40 text-white font-semibold px-3 md:px-5 py-2 rounded-lg transition duration-300 shadow-md"
          >
            Sign Up / Login
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 md:px-5 py-2 rounded-lg transition duration-300 shadow-md"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Updated for better UI) */}
      <div
        className={`fixed top-16 left-0 w-full bg-blue-800 text-white py-5 shadow-lg transition-transform transform ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } md:hidden flex flex-col items-center space-y-4`}
      >
        <Link
          to="/login"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 shadow-md"
        >
          Sign Up / Login
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 shadow-md"
        >
          Logout
        </button>
      </div>

    
      <div className="flex flex-col items-center text-center px-4 md:px-6 mt-10">
  <h1 className="absolute left-1/2 transform -translate-x-1/2 text-yellow-400 text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-wider mb-20">
    Flipper
  </h1>
  </div>


 <div className="flex flex-col items-center text-center px-4 md:px-6 mt-32 md:mt-40">
<h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
  Welcome To The Pdf Flipper 
</h1>
<p className="text-md md:text-lg max-w-3xl mb-8 opacity-90">
  Read PDFs like a pro! You can also store and manage your PDFs easily.
</p>
<Link
  to="/upload"
  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg text-lg md:text-xl transition duration-300 shadow-lg"
>
  Go to Upload Page
</Link>
</div> 





      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Secret;



