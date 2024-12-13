import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedOption, setSelectedOption] = useState(() => {
    switch (location.pathname) {
      case "/": return "map";
      case "/physicaldata": return "physicalData";
      case "/sitedata": return "siteData";
      case "/caredata": return "careData";
      case "/inventory": return "inventory";
      default: return "map";
    }
  });

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if ((selectedValue === "map" & "location.pathname" !== "/") ||
      (selectedValue === "physicalData" & "location.pathname" !== "/physicaldata") ||
      (selectedValue === "siteData" & "location.pathname" !== "/siteData") ||
      (selectedValue === "careData" & "location.pathname" !== "/caredata") ||
      (selectedValue === "inventory" & "location.pathname" !== "/inventory")) {
      switch (selectedValue) {
        case "map":
          navigate("/");
          break;
        case "physicalData":
          navigate("/physicaldata");
          break;
        case "siteData":
          navigate("/sitedata");
          break;
        case "careData":
          navigate("/caredata");
          break;
        case "inventory":
          navigate("/inventory");
          break;
        default:
          navigate("/");
          break;
      }
    }
  };

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setSelectedOption("map");
        break;
      case "/physicaldata":
        setSelectedOption("physicalData");
        break;
      case "/sitedata":
        setSelectedOption("siteData");
        break;
      case "/caredata":
        setSelectedOption("careData");
        break;
      case "/inventory":
        setSelectedOption("inventory");
        break;
      default:
        setSelectedOption("map");
        break;
    }
  }, [location.pathname]);

  return (
    <nav id="navbar">
      <div className="radiobuttonlist">
        <label className="radiooption">
          <input
            type="radio"
            name="nav"
            value="map"
            checked={selectedOption === "map"}
            onChange={handleRadioChange}
          />
          <span className="tooltip">Map</span>
        </label>
        <label className="radiooption">
          <input
            type="radio"
            name="nav"
            value="physicalData"
            checked={selectedOption === "physicalData"}
            onChange={handleRadioChange}
          />
          <span className="tooltip">Physical data</span>
        </label>
        <label className="radiooption">
          <input
            type="radio"
            name="nav"
            value="siteData"
            checked={selectedOption === "siteData"}
            onChange={handleRadioChange}
          />
          <span className="tooltip">Site data</span>
        </label>
        <label className="radiooption">
          <input
            type="radio"
            name="nav"
            value="careData"
            checked={selectedOption === "careData"}
            onChange={handleRadioChange}
          />
          <span className="tooltip">Care data</span>
        </label>
        <label className="radiooption">
          <input
            type="radio"
            name="nav"
            value="inventory"
            checked={selectedOption === "inventory"}
            onChange={handleRadioChange}
          />
          <span className="tooltip">Inventory</span>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;