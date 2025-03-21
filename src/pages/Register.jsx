import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const showError = (msg) => toast.error(msg, { position: "bottom-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("https://pdf-flipper.vercel.app/register", values, {
        withCredentials: true,
      });

      if (data.errors) showError(data.errors.email || data.errors.password);
      else {
        Cookies.set("jwtToken", data.user, { path: "/", secure: false });
        toast.success("Registration successful!", { position: "bottom-right" });
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      showError("Something went wrong. Try again!");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center w-96">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["email", "password"].map((field) => (
            <input
              key={field}
              type={field}
              name={field}
              placeholder={`Enter ${field}`}
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
              required
            />
          ))}
          <button
            type="submit"
            className={`w-full p-3 text-lg font-bold text-white rounded-lg transition-all ${
              loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-3 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default Register;
