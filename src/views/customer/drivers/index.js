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
  const [drivers, setDrivers] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [data, setData] = useState([]);
  const [addData, setAddData] = useState({
    driver_first_name: "",
    driver_last_name: "",
    driver_email: "",
    driver_mobile: "",
    driver_dob: "",
    driver_gender: "",
    driver_auth_id: "",
    driver_license_no: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    driver_first_name: false,
    driver_last_name: false,
    driver_email: false,
    driver_mobile: false,
    driver_dob: false,
    driver_gender: false,
    driver_auth_id: false,
    driver_license_no: false,
  });
  const requiredFields = [
    "driver_first_name",
    "driver_last_name",
    "driver_email",
    "driver_mobile",
    "driver_dob",
    "driver_gender",
    "driver_auth_id",
    "driver_license_no",
  ];

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
  }, [token, userUUID, drivers]);
  const handleListView = () => {
    setIsListView(true);
  };

  const handleGridView = () => {
    setIsListView(false);
  };

  const resetFormData = () => {
    setAddData({
      driver_first_name: "",
      driver_last_name: "",
      driver_email: "",
      driver_mobile: "",
      driver_dob: "",
      driver_gender: "",
      driver_auth_id: "",
      driver_license_no: "",
    });
  };
  //Add driver dialog open
  const openDialog = () => {
    resetFormData();
    setValidationErrors(false);
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setSelectedDate(null);
    setSelectedGender(null);
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  // Check if all fields are valid
  const isFormValid = () => {
    return requiredFields.every(
      (field) => !!addData[field] && addData[field] !== ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/drivers/add-driver/${userUUID}`,
          { ...addData, userUUID: userUUID },
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          setDrivers(addData);
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: `Device ${addData.device_id} Added successfully`,
            life: 3000,
          });
          closeDialog();
        })
        .catch((err) => {
          console.log(err);
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: `${err.response.data.message || err.message}`,
            life: 3000,
          });
        });
    } else {
      toastRef.current.show({
        severity: "warn",
        summary: "Incomplete form",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
      // Set validation errors for the required fields
      const errors = {};
      requiredFields.forEach((field) => {
        errors[field] = !addData[field].trim();
      });
      setValidationErrors(errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddData({ ...addData, [name]: value });
  };
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Update the selected date
  };

  const handleGenderChange = (e) => {
    handleChange(e);
    setSelectedGender(e.value); // Update the selected date
  };
  const handleCombinedChangeG = (e) => {
    handleChange(e); // Call the handleChange function
    handleGenderChange(e);
  };

  const handleCombinedChange = (e) => {
    handleChange(e); // Call the handleChange function
    handleDateChange(e);
  };

  //Edit driver API call
  const handleEditDriver = (driver_uuid, editedDriver) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/drivers/edit-driver/${driver_uuid}`,
        { ...editedDriver, userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res);
        setDrivers(editedDriver);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Driver ${editedDriver.driver_first_name} updated successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: `${err.response.data.message || err.message}`,
          life: 3000,
        });
      });
  };

  // Delete api call
  const handleDeleteDriver = (driver_uuid) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/drivers/delete-driver/${driver_uuid}`,
        { user_uuid: userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDrivers(data);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${addData.driver_first_name} deleted successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        console.error(err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete device. Please try again later.",
          life: 3000,
        });
      });
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark text-xl font-bold dark:text-white">Drivers</h4>
        <Dialog
          visible={isDialogVisible}
          onHide={closeDialog}
          style={{ width: "45rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Add Driver"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form className="mx-auto">
            <div className="flex justify-evenly">
              <div className="card justify-content-center mr-1 mt-5 flex-auto">
                <span className="p-float-label">
                  <InputText
                    id="driver_first_name"
                    onChange={handleChange}
                    name="driver_first_name"
                    className={
                      validationErrors.driver_first_name ? "p-invalid" : ""
                    }
                  />
                  <label htmlFor="driver_first_name">First Name</label>
                </span>
                {validationErrors.driver_first_name && (
                  <p className="p-error">First Name is required</p>
                )}
              </div>
              <div className="card justify-content-center ml-1 mt-5 flex-auto">
                <span className="p-float-label">
                  <InputText
                    id="driver_last_name"
                    onChange={handleChange}
                    name="driver_last_name"
                    className={
                      validationErrors.driver_last_name ? "p-invalid" : ""
                    }
                  />
                  <label htmlFor="driver_last_name">Last Name</label>
                </span>
                {validationErrors.driver_last_name && (
                  <p className="p-error">Last Name is required</p>
                )}
              </div>
            </div>
            <div className="mx-auto mt-8">
              <span className="p-float-label">
                <InputText
                  id="driver_email"
                  onChange={handleChange}
                  type="email"
                  className={validationErrors.driver_email ? "p-invalid" : ""}
                  name="driver_email"
                />
                <label htmlFor="driver_email">Email</label>
              </span>
              {validationErrors.driver_email && (
                <p className="p-error">Email id is required</p>
              )}
            </div>
            <div className="mx-auto mb-3 mt-8">
              <span className="p-float-label">
                <InputText
                  id="driver_mobile"
                  type="tel"
                  onChange={handleChange}
                  name="driver_mobile"
                  className={validationErrors.driver_mobile ? "p-invalid" : ""}
                />
                <label htmlFor="driver_mobile">Contact Number</label>
              </span>
              {validationErrors.driver_mobile && (
                <p className="p-error">Contact Number is required</p>
              )}
            </div>
            <div className="flex justify-evenly">
              <div className="card justify-content-center mr-2 mt-5  flex-auto">
                <span className="p-float-label">
                  <Calendar
                    inputId="start_date"
                    value={selectedDate}
                    name="driver_dob"
                    onChange={handleCombinedChange}
                    className={validationErrors.driver_dob ? "p-invalid" : ""}
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
                {validationErrors.driver_dob && (
                  <p className="p-error">DOB is required</p>
                )}
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
                    onChange={handleCombinedChangeG}
                    className={
                      validationErrors.driver_gender ? "p-invalid" : ""
                    }
                  />
                  <label htmlFor="driver_gender">Gender</label>
                </span>
                {validationErrors.driver_gender && (
                  <p className="p-error">Gender is required</p>
                )}
              </div>
            </div>
            <div className="mx-auto mt-8">
              <span className="p-float-label">
                <InputText
                  id="driver_auth_id"
                  onChange={handleChange}
                  name="driver_auth_id"
                  className={validationErrors.driver_auth_id ? "p-invalid" : ""}
                />
                <label htmlFor="driver_auth_id">Driver Auth ID</label>
              </span>
              {validationErrors.driver_auth_id && (
                <p className="p-error">Auth ID is required</p>
              )}
            </div>
            <div className="mx-auto mt-8">
              <span className="p-float-label">
                <InputText
                  id="driver_license_no"
                  onChange={handleChange}
                  name="driver_license_no"
                  className={
                    validationErrors.driver_license_no ? "p-invalid" : ""
                  }
                />
                <label htmlFor="driver_license_no">Driver License Number</label>
              </span>
              {validationErrors.driver_license_no && (
                <p className="p-error">License Number is required</p>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white  hover:bg-blue-600"
                onClick={handleSubmit}
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
        label="New Driver"
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
            onEditDriver={handleEditDriver}
            onDeleteDriver={handleDeleteDriver}
          />
        </div>
      )}
    </>
  );
};

export default Drivers;
