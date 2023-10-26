import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { MdOnDeviceTraining } from "react-icons/md";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import { Tag } from "primereact/tag";

const applyFilters = (filters, allData) => {
  let filteredData = allData;
  //condition to exclude these fields for global search
  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "_id" &&
          key !== "status" &&
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
      )
    );
  }

  return filteredData;
};

export default function DevicesGrid({ data, onDeleteDevice, onEditDevice }) {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editedDevice, setEditedDevice] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [listCustomers, setListCustomers] = useState([]);
  const totalItems = filteredData.length;
  const toastRef = useRef(null);
  const token = Cookies.get("token");
  //dropdown options
  const devicesOptions = [
    { label: "ECU", value: "ECU" },
    { label: "IoT", value: "IoT" },
    { label: "DMS", value: "DMS" },
  ];

  const stateOptions = [
    { label: "Active", value: 1 },
    { label: "Deactive", value: 2 },
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

  //global search
  useEffect(() => {
    setAllData(data);
    const filteredData = applyFilters(filters, data);
    setFilteredData(filteredData);
  }, [data, filters]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    const updatedFilters = {
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const updatedFilters = {
      ...filters,
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  //edit api call
  const handleEdit = (device) => {
    setEditedDevice(device);
    setIsEditDialogVisible(true);
  };

  //delete api call
  const handleDelete = (device) => {
    setSelectedDevice(device);
    setIsDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await onDeleteDevice(selectedDevice.device_id);

      const updatedData = allData.filter(
        (device) => device.device_id !== selectedDevice.device_id
      );

      setAllData(updatedData);
      const filteredData = applyFilters(filters, updatedData);
      setFilteredData(filteredData);
      setSelectedDevice(null);
      setIsDeleteDialogVisible(false);
      toastRef.current.show({
        severity: "success",
        summary: "Device Deleted",
        detail: "Customer has been deleted successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setIsDeleteDialogVisible(false);
      toastRef.current.show({
        severity: "danger",
        summary: "Error",
        detail: "Error while deleting",
        life: 3000,
      });
    }
  };

  //card
  const itemTemplate = (item) => {
    const tagSeverity = item?.device_status === 1 ? "success" : "danger";
    return (
      <div className="p-col-12 mb-6 rounded-lg bg-gray-50 transition duration-300 ease-in-out hover:shadow-lg dark:bg-gray-900 dark:text-gray-150">
        <div className="card">
          <div className="card-header flex justify-between">
            <div className="p-text-bold">{item.device_id}</div>
            <div className="p-text-bold">
              <Tag
                value={item.device_status === 1 ? "Active" : "Deactive"}
                severity={tagSeverity}
              />
            </div>
          </div>
          <div className="card-body py-3">
            <div className="flex items-center justify-between">
              <div style={{ width: "-webkit-fill-available" }}>
                <div className="flex justify-between pb-1 font-semibold ">
                  <div className="whitespace-nowrap">
                    <span>Device Type</span>
                  </div>
                  <div>
                    <span>{item.device_type}</span>
                  </div>
                </div>
                <div className="flex justify-between py-1 font-semibold ">
                  <div className="mr-6 whitespace-nowrap">
                    <span>Customer</span>
                  </div>
                  <div>
                    <span>{item.full_name}</span>
                  </div>
                </div>
                <div className="text-bold flex justify-between py-1 font-semibold ">
                  <div className=" whitespace-nowrap">
                    <span>Sim Number</span>
                  </div>
                  <div>
                    <span>{item.sim_number}</span>
                  </div>
                </div>
              </div>
              <div className="pl-3">
                <MdOnDeviceTraining className="text-6xl text-gray-500" />
              </div>
            </div>
            <div className="mt-4 flex justify-center rounded">
              <div>
                <Button
                  icon="pi pi-pencil"
                  rounded
                  tooltip="Edit"
                  tooltipOptions={{ position: "mouse" }}
                  className="mr-3 border border-gray-700 text-gray-700"
                  style={{ width: "2rem", height: "2rem" }}
                  onClick={() => handleEdit(item)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  tooltip="Delete"
                  tooltipOptions={{ position: "mouse" }}
                  style={{ width: "2rem", height: "2rem" }}
                  className="border border-red-600 text-red-600"
                  onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Dialog

  const EditDeviceDialog = ({ visible, onHide, device }) => {
    const [editedDeviceData, setEditedDeviceData] = useState(device || {});
    const isFormValid = Object.values(editedDeviceData).every((val) => {
      // Check if val is a string and is not an empty string
      return typeof val === "string" && val.trim() !== "";
    });
    const onSave = async () => {
      if (!isFormValid) {
        toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please fill in all required fields.",
          life: 3000,
        });
        return;
      }
      try {
        await onEditDevice(device?.device_id, editedDeviceData);

        const updatedData = allData.map((item) =>
          item.device_id === device.device_id
            ? { ...item, ...editedDeviceData }
            : item
        );

        setAllData(updatedData);
        const filteredData = applyFilters(filters, updatedData);
        setFilteredData(filteredData);
        setEditedDevice(null);
        setIsEditDialogVisible(false);
      } catch (error) {
        console.error("Save error:", error);
        toastRef.current.show({
          severity: "danger",
          summary: "Error",
          detail: "Error while saving",
          life: 3000,
        });
      }
    };

    const handleInputChange = (e, name) => {
      const value = e.target.value;
      const updatedEditedDeviceData = { ...editedDeviceData, [name]: value };
      setEditedDeviceData(updatedEditedDeviceData);
    };

    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Device"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <div className="mx-auto mt-8 w-[34.5vw]">
          <span className="p-float-label">
            <InputText
              id="device_id"
              name="device_id"
              onChange={(e) => handleInputChange(e, "device_id")}
              value={editedDeviceData?.device_id || ""}
              className={`border py-2 pl-2
                ${
                  !editedDeviceData.device_id && !isFormValid
                    ? "border-red-600"
                    : ""
                }
              `}
            />
            <label htmlFor="device_id" className="dark:text-gray-300">
              DeviceId
            </label>
          </span>
        </div>
        <div className="mx-auto mt-8 w-[34.5vw]">
          <span className="p-float-label">
            <Dropdown
              id="device_type"
              name="device_type"
              options={devicesOptions}
              optionLabel="label"
              optionValue="value"
              value={editedDeviceData?.device_type || ""}
              placeholder={selectedDevice?.device_type}
              className="p-dropdown border"
              onChange={(e) => handleInputChange(e, "device_type")}
            />
            <label htmlFor="device_type" className="dark:text-gray-300">
              Device_type
            </label>
          </span>
        </div>

        <div className="mx-auto mt-8 w-[34.5vw]">
          <span className="p-float-label">
            <Dropdown
              id="user_uuid"
              name="user_uuid"
              options={Customersoptions()}
              optionLabel="label"
              optionValue="value"
              className="p-dropdown border"
              value={editedDeviceData?.user_uuid || ""}
              onChange={(e) => handleInputChange(e, "user_uuid")}
            />

            <label htmlFor="customer_id" className="dark:text-gray-300">
              Customer List
            </label>
          </span>
        </div>
        <div className="mx-auto mt-8 w-[34.5vw]">
          <span className="p-float-label">
            <Dropdown
              id="status"
              name="device_status"
              options={stateOptions}
              optionLabel="label"
              optionValue="value"
              className="p-dropdown border"
              value={editedDeviceData?.device_status || ""}
              placeholder={selectedDevice?.device_status}
              onChange={(e) => handleInputChange(e, "device_status")}
            />
            <label htmlFor="status" className="dark:text-gray-300">
              Status
            </label>
          </span>
        </div>
        <div className="mx-auto mt-8 w-[34.5vw]">
          <span className="p-float-label">
            <InputText
              id="sim_number"
              name="sim_number"
              keyfilter="pint"
              value={editedDeviceData?.sim_number || ""}
              placeholder={selectedDevice?.sim_number}
              onChange={(e) => handleInputChange(e, "sim_number")}
              className={`border py-2 pl-2 ${
                !editedDeviceData.sim_number && !isFormValid
                  ? "border-red-600"
                  : ""
              }`}
            />
            <label htmlFor="sim_number" className="dark:text-gray-300">
              Sim Number
            </label>
          </span>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            onClick={onSave}
          >
            Edit Device
          </button>
        </div>
      </Dialog>
    );
  };

  //Searchbox
  return (
    <div>
      <div className="my-4 mr-7  flex justify-end">
        <div className="justify-content-between align-items-center flex flex-wrap gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              className="searchbox w-[25vw] cursor-pointer rounded-full border py-3 pl-8 dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text dark:text-gray-50 dark:hover:text-gray-50"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {/* Gridview */}
      <DataView
        value={filteredData}
        layout="grid"
        itemTemplate={itemTemplate}
        paginator
        rows={6}
        emptyMessage="No devices found."
      />
      <p className="text-center text-gray-700">Total Items : {totalItems}</p>
      {/* Delete dialog */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={confirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={() => setIsDeleteDialogVisible(false)}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {selectedDevice?.device_id}?</div>
      </Dialog>
      <EditDeviceDialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        device={editedDevice}
      />
    </div>
  );
}
