import React, { useState, useEffect } from "react";
import VehiclesList from "./components/VehiclesList";
import VehiclesGrid from "./components/VehiclesGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import "../../../assets/css/vehicles.css";
import axios from "axios";
import Cookies from "js-cookie";

const VehiclesAdmin = () => {
  const token = Cookies.get("token");
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [data, setData] = useState([]);

  const handleToggleView = () => {
    const newView = !isListView;
    setIsListView(newView);
    // Store the view preference in localStorage
    localStorage.setItem("viewPreference", newView ? "list" : "grid");
  };
  // Fetching all data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/vehicles/get-all-vehicles`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        const formattedData = res.data.results.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          key: index + 1,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <>
      <div className="flex justify-between">
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Vehicles
        </h4>

        <div className="pt-3">
          <button
            className={`${
              isListView === true
                ? "list-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "list-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsListUl />
          </button>
          <button
            className={`${
              isListView === false
                ? "grid-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "grid-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsGrid />
          </button>
        </div>
      </div>
      {!isListView && <VehiclesGrid data={data} />}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <VehiclesList data={data} />
        </div>
      )}
    </>
  );
};

export default VehiclesAdmin;
