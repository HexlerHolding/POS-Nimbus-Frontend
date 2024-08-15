import Layout from "./Layout";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useStore from "./Store/store";

const App = () => {
  const { userRole } = useStore();

  useEffect(() => {
    if (userRole && userRole !== "null") {
      localStorage.setItem("role", userRole);
    } else {
      localStorage.removeItem("role");
    }

    const handlebeforeunload = () => {
      if (userRole && userRole !== "null") {
        localStorage.setItem("role", userRole);
      }
    };

    window.addEventListener("beforeunload", handlebeforeunload);

    return () => {
      window.removeEventListener("beforeunload", handlebeforeunload);
    };
  }, [userRole]);

  return (
    <div className="App">
      <Layout />
    </div>
  );
};

export default App;
