import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { BsGrid, BsListUl } from "react-icons/bs";
import { Button } from "primereact/button";
import DriversGrid from "./components/DriversGrid";
import DriversList from "./components/DriversList";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Cookies from "js-cookie";
import axios from "axios";
import { Calendar } from "primereact/calendar";

const Drivers = () => {
  const [isListView, setIsListView] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const toastRef = useRef(null);
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");
  //   const [drivers, setDrivers] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/drivers/get-driverslist/${userUUID}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data.results);
        const formattedData = res.data.results.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          full_name: item.driver_first_name + " " + item.driver_last_name,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, userUUID]);
  const handleListView = () => {
    setIsListView(true);
  };

  const handleGridView = () => {
    setIsListView(false);
  };

  //Add driver dialog open
  const openDialog = () => {
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark text-xl font-bold dark:text-white">Devices</h4>
        <Dialog
          visible={isDialogVisible}
          onHide={closeDialog}
          style={{ width: "45rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Add Device"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form className="mx-auto">
            <div className="flex justify-evenly">
              <div className="card justify-content-center mr-1 mt-5 flex-auto">
                <span className="p-float-label">
                  <InputText id="driver_first_name" name="driver_first_name" />
                  <label htmlFor="driver_first_name">First Name</label>
                </span>
              </div>
              <div className="card justify-content-center ml-1 mt-5 flex-auto">
                <span className="p-float-label">
                  <InputText id="driver_last_name" name="driver_last_name" />
                  <label htmlFor="driver_last_name">Last Name</label>
                </span>
              </div>
            </div>
            <div className="mx-auto mt-8">
              <span className="p-float-label">
                <InputText id="driver_email" type="email" name="driver_email" />
                <label htmlFor="driver_email">Email</label>
              </span>
            </div>
            <div className="mx-auto mb-3 mt-8">
              <span className="p-float-label">
                <InputText id="driver_mobile" type="tel" name="driver_mobile" />
                <label htmlFor="driver_mobile">Contact Number</label>
              </span>
            </div>
            <div className="flex justify-evenly">
              <div className="card justify-content-center mr-2 mt-5  flex-auto">
                <span className="p-float-label">
                  <Calendar
                    inputId="start_date"
                    value={selectedDate}
                    name="driver_dob"
                    onChange={(e) => setSelectedDate(e.value)}
                  />
                  <label
                    htmlFor="start_date"
                    className="text-gray-150 dark:text-gray-150"
                  >
                    Date Of Birth
                  </label>
                </span>

                <small className="text-gray-400 dark:text-gray-150">
                  Click to Select
                </small>
              </div>
              <div className="card justify-content-center mt-5  w-[15vw] flex-auto">
                <span className="p-float-label">
                  <Dropdown
                    id="driver_gender"
                    name="driver_gender"
                    options={genderOptions}
                    optionLabel="label"
                    optionValue="value"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.value)}
                  />
                  <label htmlFor="driver_gender">Gender</label>
                </span>
              </div>
            </div>
            <div className="mx-auto mt-8">
              <span className="p-float-label">
                <InputText
                  id="driver_auth_id"
                  type="email"
                  name="driver_auth_id"
                />
                <label htmlFor="driver_auth_id">Driver Auth ID</label>
              </span>
            </div>
            <div className="mx-auto mt-8">
              <span className="p-float-label">
                <InputText
                  id="driver_license_no"
                  type="email"
                  name="driver_license_no"
                />
                <label htmlFor="driver_license_no">Driver License Number</label>
              </span>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white  hover:bg-blue-600"
              >
                Add Driver
              </button>
            </div>
          </form>
        </Dialog>
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
      <Button
        label="New Device"
        icon="pi pi-plus"
        severity="Primary"
        className="mt-2 h-10 px-3 py-0 text-left dark:hover:text-white"
        onClick={openDialog}
      />
      {!isListView && (
        <DriversGrid
        //   data={data}
        //   onEditDevice={handleEditDevice}
        //   onDeleteDevice={handleDeleteDevice}
        />
      )}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <DriversList
            data={data}
            // onEditDevice={handleEditDevice}
            // onDeleteDevice={handleDeleteDevice}
          />
        </div>
      )}
    </>
  );
};

export default Drivers;
