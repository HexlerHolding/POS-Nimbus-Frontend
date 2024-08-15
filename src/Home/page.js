import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
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
import animatedburger from "../Assets/borger.png";

import c from "../Assets/c.png";
import c1 from "../Assets/c1.png";
import adminscreen from "../Assets/adminscreen.png";
import k from "../Assets/k.png";
import m2 from "../Assets/m2.png";

const data = [
  {
    image: m2,
    title: "Manager's Dashboard",
    content:
      "Nimbus360 provides a robust manager dashboard that allows you to oversee operations, manage staff, and track performance. Monitor sales, generate reports, and make data-driven decisions with our comprehensive platform.",
  },
  {
    image: adminscreen,
    title: "Admin's Dashboard",
    content:
      "Nimbus360 offers a robust admin dashboard that allows you to manage user roles, settings, and permissions. Monitor sales, generate reports, and track performance with our comprehensive platform.",
  },
  {
    image: c,
    title: "Cashier's Dashboard",
    content:
      "Nimbus360 provides a comprehensive point of sale dashboard for cashiers, allowing them to manage transactions with ease. Punch new orders, apply discounts, and process payments seamlessly with our intuitive interface.",
  },
  {
    image: c1,
    title: "Cashier's Dashboard",
    content:
      "Cashiers can also view order history. Our platform is designed to streamline your operations and enhance the customer experience.",
  },
  {
    image: k,
    title: "Kitchen Staff's Dashboard",
    content:
      "Nimbus360 offers a dedicated kitchen staff dashboard that allows your team to manage orders efficiently. Mark orders as ready, view order details, and communicate with cashiers seamlessly.",
  },
];

const Home = () => {
  return (
    <div>
      <div className="bg-white w-full flex justify-between items-center p-5">
        <h2 className="text-2xl font-semibold text-gray-900">
          Nimbus360 Solutions
        </h2>
        <div className="flex flex-row">
          <button
            className="bg-transparent text-gray-900 py-2 px-4 rounded-0 border border-gray-900 font-semibold hover:bg-gray-900 hover:text-white"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
        </div>
      </div>
      <div className=" flex flex-row justify-between items-center bg-blue-900 pb-0 min-h-screen">
        <div className="text-left p-20 w-1/2">
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
            className="mb-5"
            style={{ width: "1200px", height: "650px" }}
          />
        </div>
      </div>
      <div className="mt-0">
        <Membership />
      </div>
      <div className="pt-40 bg-blue-900">
        <h1 className="text-4xl font-bold text-white text-center">
          About Nimbus360 Solutions
        </h1>
        <p className="text-lg text-gray-200 text-center mt-5">
          Ready to power your business? <br></br> Nimbus360 Solutions is here to
          help you streamline your operations and grow your business.
        </p>
        <AboutUs />
      </div>
      <div className="pt-20 bg-blue-900 pb-20">
        <h1 className="text-4xl font-bold text-white text-center">
          How It Works
        </h1>
        <p className="text-lg text-gray-200 text-center mt-5 mb-20">
          We provide a cashiers dashboard, managers dashboard, kitchen staff
          dashboard, and admin dashboard. <br></br> Our platform is designed to
          incorporate all key roles within your establishment.
        </p>
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
            Controller,
            Autoplay,
          ]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          autoplay={{ delay: 3000 }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="items-center flex flex-row justify-center mx-auto mt-0 pt-0 bg-blue-900 p-20"
                style={{ height: "500px" }}
              >
                <img
                  src={item.image}
                  alt="Display"
                  className=" Display text-center justify-center object-center object-fit w-1/2"
                />
                <div className="text-md text-left justify-center object-center object-fit h-1/2 w-1/2 p-10 text-white">
                  <h3 className="text-2xl font-bold py-3">{item.title}</h3>
                  <p className="text-xl mt-10">{item.content}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
