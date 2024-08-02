import React from "react";
import homeService from "../Assets/homeService.png";
import Logo from "../Assets/Logo.png";
import { MdArrowForward } from "react-icons/md";
import ServicesLink1 from "../Assets/ServicesLink1.png";
import ServicesLink2 from "../Assets/ServicesLink2.png";
const Services = () => {
  return (
    <div className="flex flex-row justify-center items-center p-36 pt-10 pb-20">
      <div className="w-1/2 flex-col ">
        <img src={Logo} alt="homeAboutUs" style={{ height: "auto" }} />
        <h1 className="text-4xl font-bold text-slate-900">
          Helping the Industry with 10k+ Equipments available for Rentals
          Anytime
        </h1>
        <p className="text-lg mt-3 text-gray-500">
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words.
        </p>
        <div className="flex flex-row items-center mt-20">
          <button
            className=" text-white px-8 py-3 rounded-0 h-full flex justify-center items-center "
            style={{ backgroundColor: "#EFB007" }}
            onClick={() => window.location.href= "/categories"}
          >
            GET STARTED <MdArrowForward className="ml-4" />
          </button>
          <img
            className="ml-5"
            src={ServicesLink1}
            alt="ServicesLink1"
            style={{ height: "50px" }}
          />
          <img
            className="ml-5"
            src={ServicesLink2}
            alt="ServicesLink2"
            style={{ height: "50px" }}
          />
        </div>
      </div>
      <div className="w-1/2 ml-20">
        <img src={homeService} alt="homeAboutUs" style={{ height: "auto" }} />
      </div>
    </div>
  );
};

export default Services;