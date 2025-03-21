import { useContext, useState } from "react";
import { supabase } from "../supabaseclient";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; 
const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); 
  const handleUpload = async () => {
    if (!userId) {
      toast.error("Please log in to upload files!");
      navigate("/login");
      return;
    }

    // Fetch uploaded file list
    const { data, error: fetchError } = await supabase.storage
      .from("pdfs")
      .list(`users/${userId}/`);

    if (fetchError) {
      toast.error("Error checking uploaded files!");
      return;
    }

    if (!file) {
      toast.warn("Please select a PDF file to upload!");
      return;
    }

    const fileName = file.name;

    // Check if file already exists
    const fileExists = data.some((existingFile) => existingFile.name === fileName);

    if (data.length >= 10) {
      if (fileExists) {
        toast.warn("File already exists!");
      } else {
        toast.warn("Maximum upload limit (10 files) reached!");
      }
      return;
    }

    setUploading(true);

    const { error } = await supabase.storage
      .from("pdfs")
      .upload(`users/${userId}/${fileName}`, file, {
        contentType: "application/pdf",
      });

    setUploading(false);

    if (error) {
      toast.error(`Upload failed: ${error.message}`);
    } else {
      toast.success("Upload successful!");
      setFile(null);
      document.getElementById("fileInput").value = "";
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col text-white">
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
               <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-yellow-400 text-3xl md:text-2xl font-extrabold tracking-wider">
                 <Link to="/">Flipper</Link>
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
               <Link
                 to="/"
                 className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 md:px-5 py-2 rounded-lg transition duration-300 shadow-md"
               >
                 Home
               </Link>
             </div>
           </nav>
     
           {/* Mobile Menu (Dropdown) */}
           {menuOpen && (
             <div className="fixed top-16 left-0 w-full bg-blue-700 md:hidden flex flex-col items-center gap-4 py-4 shadow-lg z-20">
               <Link
                 to="/login"
                 className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg transition duration-300 shadow-md w-40 text-center"
                 onClick={() => setMenuOpen(false)}
               >
                 Sign Up / Login
               </Link>
               <Link
                 to="/"
                 className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition duration-300 shadow-md w-40 text-center"
                 onClick={() => setMenuOpen(false)}
               >
                 Home
               </Link>
             </div>
           )}

      {/* Main Content */}
      
   

      <div className="flex flex-col items-center justify-center flex-grow px-6 mt-10 mb-10">
     
        <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Upload Your PDF</h2>
        <p className="text-lg opacity-90 mb-6 text-center">Store your important files securely and access them anytime.</p>

        <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Welcome, {userId}</span>

          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            onClick={handleUpload}
            className={`w-full py-3 text-lg font-bold text-white rounded-lg transition duration-300 shadow-md ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default UploadPage;
