import React from "react";
import homeService from "../Assets/man2.png";
import machinery from "../Assets/machinery.png";
import rent from "../Assets/rent.png";
import search from "../Assets/search.png";
import usersettings from "../Assets/usersettings.png";

const data = [
  {
    image: machinery,
    heading: "List Your Machinery",
    data: " Easily showcase your unused heavy machinery on our platform.",
  },
  {
    image: rent,
    heading: "Reach Renters",
    data: "Connect with businesses and individuals seeking short-term equipment solutions.",
  },
  {
    image: search,
    heading: "Flexible Rentals Terms",
    data: "Set your own availability and rental terms.",
  },
  {
    image: usersettings,
    heading: "Integrated Management",
    data: "Use our built-in tools to track rentals and manage your listings.",
  },
];
const Services = () => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center p-24 pt-10 pb-20">
        <div className="w-1/3 mr-20">
          <img src={homeService} alt="homeAboutUs" style={{ height: "auto" }} />
        </div>
        <div className="w-2/3 flex-col ">
          <h1 className="text-4xl font-bold text-slate-900">
            We Offer Smarter & More Affordable Access To Rent Construction
            Equipment
          </h1>
          <p className="text-lg mt-3 text-gray-500">
            Renting equipment from Dyno Dash is effortless, designed to
            streamline your project workflow regardless of scale. Our intuitive
            online platform allows you to browse, select, and secure the
            machinery you need in minutes, not hours. Whether you're tackling a
            small renovation or managing a large-scale industrial project, we
            have the right equipment to fit your needs. Our competitive pricing
            ensures that you get top-quality machinery without breaking your
            budget, allowing you to allocate resources more efficiently. With
            Dyno Dash, you're not just renting equipment; you're gaining a
            flexible, cost-effective solution that adapts to your project's
            demands, helping you complete jobs on time and within budget.
          </p>
          <div className="border-t border-gray-500 mt-10 flex items-center">
            <div className="border-r border-gray-500 w-1/2">
              <ul className="flex flex-col list-disc pl-10 pt-10 pr-2">
                <li className="text-gray-500">
                  Instant Accessibility: Browse and book equipment 24/7 from any
                  device, eliminating time-consuming phone calls and paperwork.
                </li>
                <li className="text-gray-500">
                  Competitive Pricing: Get the best rates on high-quality
                  machinery, allowing you to maximize your budget.
                </li>
              </ul>
            </div>
            <div className="border-l border-gray-500 w-1/2">
              <ul className="flex flex-col list-disc pl-10 pt-10 pr-2">
                <li className="text-gray-500">
                  Instant Accessibility: Browse and book equipment 24/7 from any
                  device, eliminating time-consuming phone calls and paperwork.
                </li>
                <li className="text-gray-500">
                  Competitive Pricing: Get the best rates on high-quality
                  machinery, allowing you to maximize your budget.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-slate-900 text-center">
        Dyno Dash: Turning Idle Equipment into Income
      </h1>
      <p className="text-lg text-gray-500 text-center mt-5">
        Whether you're an equipment owner looking to monetize idle machinery or
        a project<br></br> manager seeking cost-effective rental options, Dyno
        Dash streamlines the process, <br></br>maximizing equipment utilization
        and project efficiency.
      </p>
      <div className="flex flex-row justify-center mt-10 p-40 pt-0">
        {data.map((card) => (
          <div
            className="w-1/3 flex flex-col text-left  mr-10 shadow-2xl p-10  rounded-3xl"
            style={{ backgroundColor: "#252525" }}
          >
            <img src={card.image} alt="card" className="h-20 w-20"></img>
            <h1 className=" text-white text-2xl font-bold mt-5 mb-4">
              {card.heading}
            </h1>

            <p className=" text-lg" style={{ color: "#EAEAEA" }}>
              {card.data}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
