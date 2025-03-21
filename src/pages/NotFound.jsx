import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-orange-500 text-white font-extrabold text-4xl">
      <div className="text-6xl mb-6">
        <span role="img" aria-label="confused">🤷‍♂️</span>
      </div>
      <h1 className="mb-4">Oops! Looks like you're lost!</h1>
      <p className="mb-8">We couldn't find the page you're looking for.</p>
      <Link
        to="/"
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
