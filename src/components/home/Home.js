import React from "react";
import { Link } from "react-router-dom";
import Nav from "../navbar/Nav";

const Home = () => {
  return (
    <div>
      <Nav />
      <div
        className="bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            "url('https://assets.ccbp.in/frontend/react-js/home-sm-bg.png')",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full  bg-opacity-70 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-4">
            Find the Job That Fits Your Life
          </h1>
          <p className="text-white mb-6">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
