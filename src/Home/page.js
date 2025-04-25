import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  A11y,
  Autoplay,
  EffectCube,
  Navigation,
  Pagination,
  Scrollbar
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import necessary icons
import {
  FaArrowDown,
  FaArrowRight,
  FaChartLine,
  FaClipboardCheck,
  FaCloud,
  FaCog,
  FaCreditCard,
  FaEnvelope,
  FaGlobe,
  FaRocket,
  FaShoppingCart,
  FaSignInAlt,
  FaStar,
  FaUsers,
  FaUtensils
} from "react-icons/fa";

// Import components

// Import assets
import LogoWhite from "../Assets/LogoWhite.png";
import animatedburger from "../Assets/admin.png";
import adminscreen from "../Assets/adminscreen.png";
import c from "../Assets/c.png";
import c1 from "../Assets/c1.png";
import k from "../Assets/k.png";
import m2 from "../Assets/m2.png";

// Floating animation component
const FloatingElement = ({ children, delay, duration, distance }) => {
  return (
    <div
      className="floating-element"
      style={{
        animation: `float ${duration || 4}s ease-in-out infinite ${
          delay || 0
        }s`,
      }}
    >
      {children}
    </div>
  );
};

// Dashboard data
const dashboardData = [
  {
    image: m2,
    title: "Manager's Dashboard",
    content:
      "Nimbus360 provides a robust manager dashboard that allows you to oversee operations, manage staff, and track performance. Monitor sales, generate reports, and make data-driven decisions with our comprehensive platform.",
    icon: <FaChartLine className="text-green-400 text-5xl mb-5" />,
    color: "bg-blue-800",
  },
  {
    image: adminscreen,
    title: "Admin's Dashboard",
    content:
      "Nimbus360 offers a robust admin dashboard that allows you to manage user roles, settings, and permissions. Monitor sales, generate reports, and track performance with our comprehensive platform.",
    icon: <FaCog className="text-yellow-400 text-5xl mb-5" />,
    color: "bg-blue-800",
  },
  {
    image: c,
    title: "Cashier's Dashboard",
    content:
      "Nimbus360 provides a comprehensive point of sale dashboard for cashiers, allowing them to manage transactions with ease. Punch new orders, apply discounts, and process payments seamlessly with our intuitive interface.",
    icon: <FaCreditCard className="text-purple-400 text-5xl mb-5" />,
    color: "bg-blue-800",
  },
  {
    image: c1,
    title: "Cashier's Dashboard",
    content:
      "Cashiers can also view order history. Our platform is designed to streamline your operations and enhance the customer experience.",
    icon: <FaClipboardCheck className="text-pink-400 text-5xl mb-5" />,
    color: "bg-blue-800",
  },
  {
    image: k,
    title: "Kitchen Staff's Dashboard",
    content:
      "Nimbus360 offers a dedicated kitchen staff dashboard that allows your team to manage orders efficiently. Mark orders as ready, view order details, and communicate with cashiers seamlessly.",
    icon: <FaUtensils className="text-red-400 text-5xl mb-5" />,
    color: "bg-blue-800",
  },
];

// Features data
const features = [
  {
    icon: <FaShoppingCart className="text-4xl text-green-400" />,
    title: "Smart Order Management",
    description: "Process orders seamlessly and efficiently",
  },
  {
    icon: <FaChartLine className="text-4xl text-purple-400" />,
    title: "Real-time Analytics",
    description: "Make data-driven decisions with powerful insights",
  },
  {
    icon: <FaUsers className="text-4xl text-yellow-400" />,
    title: "Multi-role Support",
    description: "Dedicated interfaces for all staff members",
  },
  {
    icon: <FaGlobe className="text-4xl text-blue-400" />,
    title: "Cloud-based Access",
    description: "Access from anywhere, at any time",
  },
];

// Navigation component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center">
          <img src={LogoWhite} alt="Logo" className="w-12 h-12 mr-3" />
          <h2
            className={`text-2xl font-bold ${
              scrolled ? "text-blue-900" : "text-white"
            }`}
          >
            Nimbus<span className="text-green-400">360</span> Solutions
          </h2>
        </div>

        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className={`${
              scrolled ? "text-blue-900" : "text-white"
            } hover:text-green-400 transition-colors`}
          >
            Home
          </a>
          <a
            href="#features"
            className={`${
              scrolled ? "text-blue-900" : "text-white"
            } hover:text-green-400 transition-colors`}
          >
            Features
          </a>
          <a
            href="#plans"
            className={`${
              scrolled ? "text-blue-900" : "text-white"
            } hover:text-green-400 transition-colors`}
          >
            Pricing
          </a>
          <a
            href="#about"
            className={`${
              scrolled ? "text-blue-900" : "text-white"
            } hover:text-green-400 transition-colors`}
          >
            About
          </a>
        </div>

        <button
          className={`flex items-center ${
            scrolled
              ? "bg-blue-900 text-white hover:bg-blue-700"
              : "bg-white text-blue-900 hover:bg-green-400 hover:text-white"
          } py-2 px-6 rounded-full transition-colors duration-300 font-semibold`}
          onClick={() => (window.location.href = "/allinone")}
        >
          <span>Login</span> <FaSignInAlt className="ml-2" />
        </button>
      </div>
    </nav>
  );
};

// Hero section
const HeroSection = () => {
  return (
    <div
      id="home"
      className="relative bg-gradient-to-r from-blue-900 to-blue-800 min-h-screen pt-24 overflow-hidden"
    >
      {/* Floating elements */}
      <div className="absolute top-20 left-20 opacity-10">
        <FloatingElement delay={0} duration={4} distance={20}>
          <FaCloud className="text-white text-7xl" />
        </FloatingElement>
      </div>
      <div className="absolute bottom-40 left-40 opacity-10">
        <FloatingElement delay={1} duration={5} distance={15}>
          <FaCloud className="text-white text-5xl" />
        </FloatingElement>
      </div>
      <div className="absolute top-40 right-20 opacity-10">
        <FloatingElement delay={0.5} duration={6} distance={25}>
          <FaCloud className="text-white text-6xl" />
        </FloatingElement>
      </div>
      <div className="absolute bottom-60 right-60 opacity-10">
        <FloatingElement delay={1.5} duration={4.5} distance={20}>
          <FaCloud className="text-white text-5xl" />
        </FloatingElement>
      </div>

      <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center">
        <div className="text-left mt-20 lg:mt-0 lg:w-1/2 z-10">
          <div className="inline-block px-3 py-1 rounded-full bg-opacity-20 bg-white text-white text-sm mb-6">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" /> Cloud-based business
              solution
            </span>
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Nimbus<span className="text-green-400">360</span> Solutions
          </h1>

          <p className="text-white text-xl italic mb-8">
            Easy online order management for your business. Get started today!
          </p>

          <p className="text-gray-200 text-lg mb-10 max-w-xl">
            Nimbus360 Solutions is a cloud-based platform that provides
            businesses with the tools they need to manage their orders online.
            Our platform is easy to use and can be accessed from anywhere, at
            any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="bg-green-400 text-blue-900 py-3 px-8 rounded-full font-semibold hover:bg-green-500 transition-colors flex items-center"
              onClick={() => (window.location.href = "/contact")}
            >
              <span>Get Started</span> <FaArrowRight className="ml-2" />
            </button>

            <button
              className="bg-transparent text-white py-3 px-8 rounded-full border border-white font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          <FloatingElement delay={0} duration={4} distance={15}>
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-20 transform -translate-x-10 translate-y-10"></div>
              <img
                src={animatedburger}
                alt="animatedburger"
                className="relative z-10 max-w-full h-auto"
              />
            </div>
          </FloatingElement>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <a
          href="#features"
          className="animate-bounce p-2 bg-white bg-opacity-20 rounded-full"
        >
          <FaArrowDown className="text-white" />
        </a>
      </div>
    </div>
  );
};

// Features section
const FeaturesSection = () => {
  return (
    <div id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">
            Why Choose Us
          </h2>
          <h3 className="text-4xl font-bold text-blue-900 mb-4">
            Powerful Features
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nimbus360 provides a comprehensive set of features to help you
            streamline your operations and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-blue-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard showcase section
const DashboardShowcase = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-blue-900 to-blue-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">
            Designed for Everyone
          </h2>
          <h3 className="text-4xl font-bold text-white mb-4">Our Dashboards</h3>
          <p className="text-gray-200 max-w-2xl mx-auto">
            We provide dedicated dashboards for all key roles within your
            establishment - managers, cashiers, kitchen staff, and admins.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Scrollbar,
              A11y,
           
              Autoplay,
              EffectCube,
            ]}
            effect="cube"
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={{ delay: 5000 }}
            className="pb-16"
          >
            {dashboardData.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="md:w-1/2">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl transform rotate-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                  </div>

                  <div className="md:w-1/2 text-left">
                    <div className="mb-6">{item.icon}</div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-xl text-gray-200 mb-8">{item.content}</p>
                    <button className="inline-flex items-center bg-green-400 text-blue-900 py-3 px-6 rounded-full font-semibold hover:bg-green-500 transition-colors">
                      Learn More <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

// Enhanced Membership component
const EnhancedMembership = () => {
  return (
    <div id="plans" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">
            Pricing
          </h2>
          <h3 className="text-4xl font-bold text-blue-900 mb-4">
            Membership Plan
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start your journey with us today with our affordable pricing plan!
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <div className="p-8 text-center">
              <div className="inline-block bg-green-400 rounded-full p-4 mb-6">
                <FaRocket className="text-blue-900 text-3xl" />
              </div>

              <h4 className="text-2xl font-bold text-white mb-2">
                Get Nimbus360
              </h4>
              <div className="flex justify-center items-center gap-2">
                <span className="text-6xl font-bold text-white">$30</span>
                <div className="text-left">
                  <span className="text-green-400 font-semibold">.00</span>
                  <span className="block text-gray-300">/month</span>
                </div>
              </div>

              <p className="text-gray-300 mt-6 mb-8">
                The plan is available on a month-to-month basis with no time
                restrictions.
              </p>

              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <FaStar className="text-green-400 mr-3" /> Unlimited orders
                </li>
                <li className="flex items-center text-white">
                  <FaStar className="text-green-400 mr-3" /> All dashboards
                  included
                </li>
                <li className="flex items-center text-white">
                  <FaStar className="text-green-400 mr-3" /> 24/7 customer
                  support
                </li>
                <li className="flex items-center text-white">
                  <FaStar className="text-green-400 mr-3" /> Regular updates
                </li>
              </ul>

              <button className="w-full bg-green-400 text-blue-900 py-4 px-6 rounded-full font-bold text-lg hover:bg-green-500 transition-colors">
                SUBSCRIBE NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced About Us section
const EnhancedAboutUs = () => {
  return (
    <div id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">
            Our Story
          </h2>
          <h3 className="text-4xl font-bold text-blue-900 mb-4">
            About Nimbus360 Solutions
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ready to power your business? Nimbus360 Solutions is here to help
            you streamline your operations and grow your business.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-900 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
              <div className="absolute inset-0 bg-green-400 rounded-2xl transform -translate-x-4 -translate-y-4 -z-10"></div>
              <img
                src={adminscreen}
                alt="About Nimbus360"
                className="rounded-2xl shadow-xl relative z-10"
              />
            </div>
          </div>

          <div className="lg:w-1/2">
            <h4 className="text-2xl font-bold text-blue-900 mb-6">
              About Us - Nimbus360
            </h4>

            <p className="text-gray-700 mb-6 text-lg">
              At Nimbus360, we provide a comprehensive, cloud-based platform
              designed to streamline your business operations, whether you
              manage a single location or a chain of branches. Our SaaS solution
              is tailored for all key roles within your establishment—managers,
              cashiers, admins, and kitchen staff—ensuring a seamless experience
              across the board.
            </p>

            <p className="text-gray-700 mb-6 text-lg">
              Managers can oversee operations efficiently, cashiers can handle
              transactions smoothly, admins can manage user roles and settings,
              and kitchen staff can mark orders as ready with ease. Our platform
              is built to scale with your business, offering robust features
              that adapt to your unique needs.
            </p>

            <div className="flex items-center gap-6 mt-10">
              <button className="bg-blue-900 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-800 transition-colors flex items-center">
                Get Started <FaArrowRight className="ml-2" />
              </button>

              <button className="flex items-center text-blue-900 font-semibold hover:text-green-400 transition-colors">
                Learn more <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <img src={LogoWhite} alt="Logo" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-bold">
                Nimbus<span className="text-green-400">360</span>
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              Cloud-based platform designed to streamline your business
              operations, whether you manage a single location or a chain of
              branches.
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-blue-800 p-2 rounded-full hover:bg-green-400 transition-colors"
              >
                <FaEnvelope />
              </a>
              <a
                href="#"
                className="bg-blue-800 p-2 rounded-full hover:bg-green-400 transition-colors"
              >
                <FaGlobe />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Order Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Sales Reporting
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Inventory Control
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Staff Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Analytics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <p className="text-gray-300 mb-4">
              Ready to get started? Contact us today!
            </p>
            <button className="bg-green-400 text-blue-900 py-3 px-6 rounded-full font-semibold hover:bg-green-500 transition-colors w-full flex justify-center items-center">
              <FaEnvelope className="mr-2" /> Contact Us
            </button>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 Nimbus360 Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Add custom CSS for floating animation
const CustomCSS = () => {
  return (
    <style jsx>{`
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      .floating-element {
        animation: float 4s ease-in-out infinite;
      }
    `}</style>
  );
};

// Main Home component
const Home = () => {
  return (
    <div className="font-sans">
      <CustomCSS />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardShowcase />
      <EnhancedMembership />
      <EnhancedAboutUs />
      <Footer />
    </div>
  );
};

export default Home;
