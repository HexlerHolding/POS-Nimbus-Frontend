import React from "react";
import homeAboutUs from "../Assets/man1.png";
import aboutusicon from "../Assets/aboutusicon.png";
const AboutUs = () => {
  return (
    <div className="flex flex-row justify-between items-center p-24 pt-10 pb-20">
      <div className="w-2/3 flex-col">
        <p className="text-2xl font-bold mb-3">About Us</p>
        <p className="text-xl text-gray-500 mb-3 mr-20">
          Dyno Dash is your go-to online platform for heavy machinery rentals,
          premium lubrication products, and essential spare parts. We serve the
          construction and industrial sectors, making equipment access simpler
          and more efficient than ever. Our user-friendly website offers a wide
          range of high-quality machinery - from excavators to bulldozers - all
          available with just a few clicks. We complement our rental services
          with top-grade lubricants and spare parts to keep your operations
          running smoothly. At Dyno Dash, we're committed to powering your
          projects with the right tools and support. Experience the perfect
          blend of heavy-duty equipment and cutting-edge convenience.
        </p>
      </div>
      <div className="w-1/3">
        <img src={homeAboutUs} alt="homeAboutUs" style={{ height: "auto" }} />
      </div>
    </div>
  );
};

export default AboutUs;
