import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Controller,
} from "swiper/modules";
import "swiper/css"; // basic Swiper styles
import "swiper/css/navigation";
import "swiper/css/pagination";
import Membership from "./plans";
import AboutUs from "./aboutus";
import Services from "./services";
import HowItWorks from "./howItWorks";
import Section from "./section";
import animatedburger from "../Assets/animated.png";

const data = [
  {
    title: "Friendly Chatbot",
    content:
      "Redefining mental wellness with a minimalist and soft dashboard: your partner in the fight against anxiety and depression",
  },
  {
    title: "Customized Lessons",
    content:
      "Redefining mental wellness with a minimalist and soft dashboard: your partner in the fight against anxiety and depression",
  },
  {
    title: "Daily Progress",
    content:
      "Redefining mental wellness with a minimalist and soft dashboard: your partner in the fight against anxiety and depression",
  },
];

const Home = () => {
  return (
    <div>
      <div className=" flex flex-row justify-between items-center bg-blue-900 p-20 pb-0 min-h-screen">
        <div className="text-left p-10 w-1/2">
          <h1 className="text-white text-5xl font-semibold mb-5">
            Nimbus<span className="text-green-400">360 </span>
            Solutions
          </h1>
          <p className="text-white text-2xl italic">
            Easy online order management for your business. Get started today!
          </p>
          <p className="text-white text-md mt-5">
            Nimbus360 Solutions is a cloud-based platform that provides
            businesses with the tools they need to manage their orders online.
            Our platform is easy to use and can be accessed from anywhere, at
            any time. With Nimbus360 Solutions, you can streamline your order
            management process, reduce errors, and improve customer
            satisfaction. Sign up today and start managing your orders online
            with Nimbus360 Solutions!
          </p>
          <div className="mt-10">
            <button
              className="bg-transparent text-white py-3 px-6 rounded-0 border border-white font-semibold hover:bg-white hover:text-gray-900"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img
            src={animatedburger}
            alt="animatedburger"
            style={{ width: "1200px", height: "650px" }}
          />
        </div>
      </div>
      <div className="mt-0">
        <Membership />
      </div>
      <div className="mt-0">
        <AboutUs />
      </div>
      <div>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Controller]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="items-center flex flex-col justify-center h-screen mx-auto mt-0 pt-0">
                <img
                  src={item.image}
                  alt="Display"
                  className=" Display text-center justify-center"
                />
                <div className="text">
                  <h3 className="text-4xl font-bold py-3">{item.title}</h3>
                  <p className="text-2xl mt-10">{item.content}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
    </div>
  );
};

export default Home;
