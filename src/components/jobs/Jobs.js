import { useState } from "react";
import Nav from "../navbar/Nav";

import JobList from "../jobList/JobList";
import Footer from "../footer/Footer";




export default function Jobs() {
  return (
    <div className="bg-white">
      <Nav />
      <JobList />
      <Footer />
    </div>
  );
}
