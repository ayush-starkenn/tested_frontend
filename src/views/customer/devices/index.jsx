import React, { useState, useEffect, useRef } from "react";
import DevicesList from "./components/DevicesList";
import DevicesGrid from "./components/DevicesGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import axios from "axios";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";

const Devices = () => {
  const user_uuid = Cookies.get("user_uuid");
  const token = Cookies.get("token");

  const [data, setData] = useState([]);
  const [isListView, setIsListView] = useState(true);

  const toastRef = useRef(null);

  //Fetching all data
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/devices/get-user-devices-list/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        const formattedData = res.data.results.map((item, index) => ({
          ...item,
          serialNo: index + 1,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  const handleListView = () => {
    setIsListView(true);
  };

  const handleGridView = () => {
    setIsListView(false);
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark text-xl font-bold dark:text-white">Devices</h4>

        <div>
          <button
            className={`${
              isListView === true
                ? "list-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "list-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleListView}
          >
            <BsListUl />
          </button>
          <button
            className={`${
              isListView === false
                ? "grid-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "grid-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleGridView}
          >
            <BsGrid />
          </button>
        </div>
      </div>

      {!isListView && <DevicesGrid data={data} />}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <DevicesList data={data} />
        </div>
      )}
    </>
  );
};

export default Devices;
