import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseclient";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for menu toggle

const RetrievePage = () => {
  const { user } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId, loading: authLoading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      navigate("/login");
      return;
    }

    if (userId !== user) {
      navigate("/login");
      return;
    }

    const fetchFiles = async () => {
      const { data, error } = await supabase.storage
        .from("pdfs")
        .list(`users/${userId}/`);

      if (error) {
        console.error("Error fetching files:", error.message);
      } else {
        setFiles(data || []);
      }
      setLoading(false);
    };

    fetchFiles();
  }, [userId, authLoading, user, navigate]);

  const handleOpenFlipbook = (fileName) => {
    const encodedPdfUrl = encodeURIComponent(
      `https://vbkdzpaotbnygsuglctw.supabase.co/storage/v1/object/public/pdfs/users/${userId}/${fileName}`
    );
    window.open(`${window.location.origin}/flipbook.html?pdf=${encodedPdfUrl}`, "_blank");
  };

  const handleDeleteFile = async (fileName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${fileName}"?`);
    if (!confirmDelete) return;

    const { error } = await supabase.storage
      .from("pdfs")
      .remove([`users/${userId}/${fileName}`]);

    if (error) {
      alert("Failed to delete file. Please try again.");
    } else {
      setFiles(files.filter((file) => file.name !== fileName));
      alert("File deleted successfully.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center text-white px-6 pb-20">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between bg-gradient-to-r from-blue-700 to-purple-800 shadow-lg px-6 md:px-8 py-4 fixed top-0 left-0 right-0 z-10">
             
        {/* Logo & Hamburger Icon */}
        <div className="flex items-center w-full justify-between">
          <Link
            to="/Upload"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 md:px-5 py-2 rounded-lg transition duration-300 shadow-md"
          >
            Upload Pdfs
          </Link>

          {/* Centered Title (Only for PC) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-yellow-400 text-lg md:text-2xl font-extrabold tracking-wider">
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

      {/* File List Section */}
      <div className="mt-24 text-center w-full max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 drop-shadow-lg">Your Uploaded PDFs</h2>

        {files.length === 0 ? (
          <p className="text-lg opacity-90">No PDFs found. Upload some files to see them here.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => (
              <div key={file.name} className="bg-white text-gray-900 p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                <span className="font-semibold truncate text-sm md:text-base">{file.name}</span>
                <div className="flex gap-2 mt-2 md:mt-0 w-full md:w-auto">
                  <button
                    onClick={() => handleOpenFlipbook(file.name)}
                    className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md text-sm md:text-base"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md text-sm md:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetrievePage;
