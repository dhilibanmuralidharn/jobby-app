import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Jobs from "./components/jobs/Jobs";

import "./App.css";
import JobDetailedView from "./components/jobDetailedView/JobDetailedView";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobslist" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetailedView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
