import bgSectionbg from "../Assets/bgSectionReal.jpg";
import Section1 from "../Assets/section1.png";
import Section2 from "../Assets/section2.png";
import SectionLink from "../Assets/ServiceLink.png";
const Section = () => {
  return (
    <div
      className="flex flex-row justify-between items-center p-36 pt-5 pb-5"
      style={{
        backgroundImage: `url(${bgSectionbg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "55vh",
      }}
    >
      <div className="flex-col p-10">
        <h1 className="text-white text-4xl font-bold mt-10">
        Reasons to Choose Dyno Dash
        </h1>
        <div className="flex flex-row items-center mt-10 mb-10">
          <img src={SectionLink} alt="SectionLink" style={{ height: "auto" }} />
          <p className="text-gray-300">
            We're dedicated to helping our customers find the perfect equipment
            <br></br>and talent for their projects, streamlining operations and
            boosting
            <br></br>
            efficiency - experience the Dyno Dash difference today
          </p>
        </div>
      </div>
      <div className="w-1/2 flex-row flex">
        <div className="w-1/2">
          <img src={Section1} alt="Section1" style={{ height: "auto" }} />
          <h1 className="text-white text-xl font-bold mt-2">
            Out Class Performance
          </h1>
          <p className="text-gray-300 mt-2">
            Choose Dyno Dash for our extensive network of verified equipment and
            professionals, user-friendly platform, and competitive pricing
          </p>
        </div>
        <div className="w-1/2 text-left ml-10">
          <img src={Section2} alt="Section2" style={{ height: "auto" }} />
          <h1 className="text-white text-xl font-bold mt-2">
            Out Class Performance
          </h1>
          <p className="text-gray-300 mt-2">
            Our efficient matching system, flexible rental options, and
            dedicated customer support ensure you find the right resources for
            your project quickly and easily, saving you time and money.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section;
