import React, { useRef, useEffect, useState } from "react";
import home1 from "../Assets/home_background.png";
import home1bottom from "../Assets/home1bottom.png";
import aboutusicon from "../Assets/aboutusicon.png";
import { MdArrowForward } from "react-icons/md";
import AboutUs from "./aboutus";
import Services from "./services";
import HowItWorks from "./howItWorks";
import Section from "./section";

const Home = () => {
  const categories = [
    "Aerial Machines",
    "Excavators",
    "Wheel Loaders",
    "Backhoe Loaders",
    "Skid Steer Loaders",
    "Compactors",
    "Telehandlers",
    "Forklifts",
    "Attachments",
    "Parts",
    "Services",
    "Rental",
    "Financing",
    "Training",
    "Safety",
  ];
  const locations = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [show, doShow] = useState(false);
  const [showEnd, doShowEnd] = useState(false);
  return (
    <div>
      <div
        className=" flex flex-col justify-center items-center bg-purple-900"
        style={{ backgroundColor: "#388c8c" }}
      >
        <div className="w-1/2 text-center p-10">
          <h1 className="text-white text-5xl font-bold p-10">
            Power at your Fingertips
          </h1>
          <p className="text-white text-2xl">
            Easy online rentals of heavy machinery, plus premium lubrication
            <br></br>
            products and spare parts for your construction and industrial needs.
          </p>
          <div className="flex justify-center items-center mt-10">
            <button
              className="text-white py-3 px-6 rounded-0 font-semibold hover:text-gray-900"
              style={{ backgroundColor: "#EFB007" }}
              onClick={() => (window.location.href = "/categories")}
            >
              Shop Now
            </button>
            <button
              className="bg-transparent text-white py-3 px-6 rounded-0 ml-5 border border-white font-semibold hover:bg-white hover:text-gray-900"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
      <div className="mt-36">
        <AboutUs />
      </div>
      <div className="mt-0">
        <Services />
      </div>

      <div className="mt-0">
        <h1 className="text-4xl font-bold text-slate-900 text-center">
          How It Works
        </h1>
        <p className="text-lg text-gray-500 text-center mt-5">
          Ready to power your project?<br></br> Join Dyno Dash today and access
          top equipment and talent instantly!
        </p>
        <HowItWorks />
      </div>
      <Section />
    </div>
  );
};

export default Home;
