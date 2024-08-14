import React from "react";
import homeAboutUs from "../Assets/admin01.png";
import aboutusicon from "../Assets/aboutusicon.png";
const AboutUs = () => {
  return (
    <div className="flex flex-row justify-between items-center pt-10 bg-blue-900 p-10">
      <div className="w-1/2">
        <img src={homeAboutUs} alt="homeAboutUs" style={{ height: "auto" }} />
      </div>
      <div className="w-1/2 flex-col">
        <p className="text-2xl font-semibold mb-3 text-white">
          About Us - Nimbus360
        </p>
        <p className="text-md text-white mb-3 mr-20 ">
          At Nimbus360, we provide a comprehensive, cloud-based platform
          designed to streamline your business operations, whether you manage a
          single location or a chain of branches. Our SaaS solution is tailored
          for all key roles within your establishment—managers, cashiers,
          admins, and kitchen staff—ensuring a seamless experience across the
          board. <br></br>
          <br></br> Managers can oversee operations efficiently, cashiers can
          handle transactions smoothly, admins can manage user roles and
          settings, and kitchen staff can mark orders as ready with ease. Our
          platform is built to scale with your business, offering robust
          features that adapt to your unique needs. <br></br>
          <br></br> Register your shop with Nimbus360 today, no matter how many
          branches you have, and take the first step towards transforming your
          business operations.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
