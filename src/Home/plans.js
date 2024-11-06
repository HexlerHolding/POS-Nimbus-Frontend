import React from "react";
import { FaCircle } from "react-icons/fa";
const plans = [
  {
    name: "Get Nimbus360",
    price: "$30.00",
  },
];
const Membership = () => {
  return (
    <div className="flex flex-col pt-0 pb-0 p-20 bg-blue-900 items-center text-center">
      <h1 className="text-3xl mt-2 italic font-semibold text-white">
        MEMBERSHIP PLAN
      </h1>
      <h1
        className="text-sm font-bold italic text-gray-200"
        style={{ letterSpacing: "7px" }}
      >
        START YOUR JOURNEY WITH US TODAY!
      </h1>
      <div className="flex flex-col md:flex-row justify-between mt-2">
        {plans.map((plan) => (
          <div
            className={`flex flex-col w-full ${
              plan.name === "Premium Plan" ? "premium" : ""
            }`}
            key={plan.name}
          >
            <h1 className="text-6xl text-blue-100 font-bold italic mt-5">
              {plan.price}
            </h1>

            <p className="text-gray-100 mt-1">
              The plan is available on a month-to-month basis with no time
              restrictions.
            </p>
            <div className="mt-5 text-gray-500">
              <button className="text-md text-white bg-blue-500 py-3 px-8 sm:px-12 md:px-24 lg:px-36 mt-4 rounded-0 hover:bg-blue-700">
                SUBSCRIBE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
