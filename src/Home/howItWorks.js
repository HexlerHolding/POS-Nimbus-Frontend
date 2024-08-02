import React from "react";
import homeWorks from "../Assets/homeWorks.png";
import aboutusicon from "../Assets/aboutusicon.png";
import homeServiceTick from "../Assets/homeServiceTick.png";

const points = [
  "Sign Up: Create a Dyno Dash account with your email and basic information.",
  "Build Your Profile: Add your contact details and company information (if applicable).",
  "Verification Steps: • Upload a government-issued ID",
  "Provide proof of equipment ownership",
  "Submit insurance documentation",
  "List Your Equipment: • Add photos and detailed descriptions of your machinery",
  "Set availability dates and rental rates",
  "Await Approval: Our team will review and verify your information, typically within 24-48 hours.",
  "Start Earning: Once approved, your equipment becomes visible to potential renters.",
];

const HowItWorks = () => {
  return (
    <div className="flex flex-row justify-center items-center p-24 pt-10 pb-20">
      <div className="w-1/2">
        <img src={homeWorks} alt="homeAboutUs" style={{ height: "auto" }} />
      </div>
      <div className="w-1/2 flex-col ml-10">
        <p className="text-lg font-semibold text-gray-500 mb-3">
          How It Works Dyno Dash Equipment Rentals
        </p>
        <h1 className="text-4xl font-bold text-slate-900">
          Over 15,000+ Rental Deals <br></br>Dyno Dash Is The Best Choice
        </h1>
        <div className="flex flex-row items-center mt-10 mb-10">
          <img src={aboutusicon} alt="aboutusicon" style={{ height: "auto" }} />
        </div>
        <p className="text-lg font-semibold text-gray-500">
          How It Works Dyno Dash Equipment Rentals
        </p>
        <div className="flex flex-col justify-center items-center mt-10 text-md">
          {points.map((point) => (
            <div className="flex-row w-full flex mt-4 items-center">
              <img
                src={homeServiceTick}
                alt="homeServiceTick"
                style={{ height: "20px" }}
              />
              <p className=" text-slate-900 ml-3">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
