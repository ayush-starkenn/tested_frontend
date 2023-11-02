import React, { useState, useEffect, useRef } from "react";
import DevicesList from "./components/DevicesList";
import DevicesGrid from "./components/DevicesGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Cookies from "js-cookie";
import { FiPlus } from "react-icons/fi";

const DevicesAdmin = () => {
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");
  const [devices, setDevices] = useState(true);
  const [data, setData] = useState([]);
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    device_id: false,
    device_type: false,
    user_uuid: false,
    status: false,
    sim_number: false,
  });
  const requiredFields = [
    "device_id",
    "device_type",
    "user_uuid",
    "status",
    "sim_number",
  ];
  const [addData, setAddData] = useState({
    device_id: "",
    device_type: "",
    user_uuid: "",
    status: "",
    sim_number: "",
  });
  const [listCustomers, setListCustomers] = useState([]);
  const toastRef = useRef(null);

  //Fetching all data

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/devices/list-devices`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        const formattedData = res.data.devices.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          key: index + 1,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, devices]);

  // Edit Devices
  const handleEditDevice = (deviceId, editedDevice) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/devices/edit-device/${deviceId}`,
        { ...editedDevice, userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDevices(editedDevice);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${deviceId} updated successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        if (err.response.data === 404) {
          toastRef.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Device not found",
            life: 3000,
          });
        }
        if (err.response.data === 500) {
          toastRef.current.show({
            severity: "danger",
            summary: "Error",
            detail: "Failed to update device",
            life: 3000,
          });
        }
      });
  };

  // Delete api call
  const handleDeleteDevice = (deviceId) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/devices/delete-device/${deviceId}`,
        { userUUID: userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDevices(data);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${deviceId} deleted successfully`,
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

  const resetFormData = () => {
    setAddData({
      device_id: "",
      device_type: "",
      user_uuid: "",
      status: "",
      sim_number: "",
    });
  };

  const handleToggleView = () => {
    const newView = !isListView;
    setIsListView(newView);
    // Store the view preference in localStorage
    localStorage.setItem("viewPreference", newView ? "list" : "grid");
  };

  //Add device dialog open
  const openDialog = () => {
    resetFormData();
    setIsDialogVisible(true);
  };

  //Add device dialog close
  const closeDialog = () => {
    resetFormData();
    setValidationErrors(false);
    setIsDialogVisible(false);
  };

  //Dropdown options
  const devicesOptions = [
    { label: "ECU", value: "ECU" },
    { label: "IoT", value: "IoT" },
    { label: "DMS", value: "DMS" },
  ];

  const stateOptions = [
    { label: "Active", value: "1" },
    { label: "Deactive", value: "2" },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/devices/get-customerlist`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      key: el.user_uuid,
      label: el.first_name + " " + el.last_name,
      value: el.user_uuid,
    }));
  };

  // Add customer api call
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/devices/add-device`,
          { ...addData, userUUID: userUUID },
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          setDevices(addData);
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: `Device ${addData.device_id} Added successfully`,
            life: 3000,
          });
          closeDialog();
        })
        .catch((err) => {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Device Already exists.",
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

  const handleValidation = (name, value) => {
    const errors = { ...validationErrors };
    errors[name] = !value.trim();
    setValidationErrors(errors);
  };

  // Check if all fields are valid
  const isFormValid = () => {
    return requiredFields.every((field) => !!addData[field].trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddData({ ...addData, [name]: value });
    handleValidation(name, value);
  };

  //add device dialog
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Devices
        </h4>
        <Dialog
          visible={isDialogVisible}
          onHide={closeDialog}
          style={{ width: "45rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Fill the details"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit} className="mx-auto">
            <div
              className={`mx-auto mt-8 w-[34.5vw] ${
                validationErrors.device_id ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <InputText
                  id="device_id"
                  name="device_id"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    validationErrors.device_id ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="device_id" className="dark:text-gray-300">
                  Device ID
                </label>
              </span>
              {validationErrors.device_id && (
                <small className="text-red-600">Device ID is required</small>
              )}
            </div>
            <div
              className={`mx-auto mt-8 w-[34.5vw] ${
                validationErrors.device_type ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <Dropdown
                  id="device_type"
                  name="device_type"
                  options={devicesOptions}
                  optionLabel="label"
                  optionValue="value"
                  className={`p-dropdown border ${
                    validationErrors.device_type ? "border-red-600" : ""
                  }`}
                  onChange={handleChange}
                  value={addData.device_type}
                />
                <label htmlFor="device_type" className="dark:text-gray-300">
                  Device Type
                </label>
              </span>
              {validationErrors.device_type && (
                <small className="text-red-600">Device Type is required</small>
              )}
            </div>

            <div
              className={`mx-auto mt-8 w-[34.5vw] ${
                validationErrors.user_uuid ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <Dropdown
                  id="user_uuid"
                  name="user_uuid"
                  options={Customersoptions()}
                  optionLabel="label"
                  optionValue="value"
                  className={`p-dropdown border ${
                    validationErrors.user_uuid ? "border-red-600" : ""
                  }`}
                  onChange={handleChange}
                  value={addData.user_uuid}
                />
                <label htmlFor="user_uuid" className="dark:text-gray-300">
                  Select Customer
                </label>
              </span>
              {validationErrors.user_uuid && (
                <small className="text-red-600">Customer is required</small>
              )}
            </div>
            <div
              className={`mx-auto mt-8 w-[34.5vw] ${
                validationErrors.status ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <Dropdown
                  id="status"
                  name="status"
                  options={stateOptions}
                  optionLabel="label"
                  optionValue="value"
                  className={`p-dropdown border ${
                    validationErrors.status ? "border-red-600" : ""
                  }`}
                  onChange={handleChange}
                  value={addData.status}
                />
                <label htmlFor="status" className="dark:text-gray-300">
                  Status
                </label>
              </span>
              {validationErrors.status && (
                <small className="text-red-600">Status is required</small>
              )}
            </div>
            <div
              className={`mx-auto mt-8 w-[34.5vw] ${
                validationErrors.sim_number ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <InputText
                  id="sim_number"
                  name="sim_number"
                  keyfilter="pint"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    validationErrors.sim_number ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="device_id" className="dark:text-gray-300">
                  Sim Number
                </label>
              </span>
              {validationErrors.sim_number && (
                <small className="text-red-600">Sim number is required</small>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Add Device
              </button>
            </div>
          </form>
        </Dialog>
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
      <button
        className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
        onClick={openDialog}
      >
        <FiPlus className="mr-2" />
        New Device
      </button>
      {!isListView && (
        <DevicesGrid
          data={data}
          onEditDevice={handleEditDevice}
          onDeleteDevice={handleDeleteDevice}
        />
      )}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <DevicesList
            data={data}
            onEditDevice={handleEditDevice}
            onDeleteDevice={handleDeleteDevice}
          />
        </div>
      )}
    </>
  );
};

export default DevicesAdmin;
