import Cookies from "js-cookie";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { MdOnDeviceTraining } from "react-icons/md";

const applyFilters = (filters, allData) => {
  let filteredData = allData;
  //condition to exclude these fields for global search
  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "driver_auth_id" &&
          key !== "driver_created_at" &&
          key !== "driver_created_by" &&
          key !== "driver_id" &&
          key !== "driver_modified_at" &&
          key !== "driver_modified_by" &&
          key !== "driver_uuid" &&
          key !== "user_uuid" &&
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
      )
    );
  }

  return filteredData;
};

const DriversGrid = ({ data, onDeleteDevice, onEditDevice }) => {
  const [allData, setAllData] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const totalItems = filteredData.length;
  const toastRef = useRef(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const token = Cookies.get("token");

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

  const itemTemplate = (item) => {
    return (
      <div className="p-col-11 mb-6 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-150">
        <div className="card">
          <div className="card-body px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="mt-4 flex justify-between font-semibold">
                  <div className="mr-16">
                    <span>Driver Name</span>
                  </div>
                  <div>
                    <span>{item.full_name}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold ">
                  <div className="mr-16">
                    <span>Email</span>
                  </div>
                  <div>
                    <span>{item.driver_email}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold ">
                  <div className="mr-6">
                    <span>Contact</span>
                  </div>
                  <div>
                    <span>{item.driver_mobile}</span>
                  </div>
                </div>
                <div className="text-bold flex justify-between font-semibold ">
                  <div className="mr-16">
                    <span>License Number</span>
                  </div>
                  <div>
                    <span>{item.driver_license_no}</span>
                  </div>
                </div>
                <div className="text-bold flex justify-between font-semibold ">
                  <div className="mr-16">
                    <span>Date Of Birth</span>
                  </div>
                  <div>
                    <span>{item.driver_dob}</span>
                  </div>
                </div>
                <div className="text-bold flex justify-between font-semibold ">
                  <div className="mr-16">
                    <span>Gender</span>
                  </div>
                  <div>
                    <span>{item.driver_gender}</span>
                  </div>
                </div>
                <div className="text-bold flex justify-between font-semibold ">
                  <div className="mr-16">
                    <span>Status</span>
                  </div>
                  <div>
                    <span>
                      {item.driver_status === 1 ? "Active" : "Deactive"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <MdOnDeviceTraining className="text-6xl text-gray-500" />
              </div>
            </div>
            <div className="mt-4 flex justify-end rounded">
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-text mr-2"
                  style={{
                    borderColor: "#6E70F2",
                    width: "2.2rem",
                    height: "2.2rem",
                  }}
                  // onClick={() => openDialog(item)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  outlined
                  style={{
                    borderColor: "#F18080",
                    width: "2.2rem",
                    height: "2.2rem",
                  }}
                  className="p-button-rounded p-button-text p-button-danger"
                  // onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              className="searchbox w-[25vw] cursor-pointer rounded-full dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {/* Gridview */}
      <DataView
        value={data}
        layout="grid"
        itemTemplate={itemTemplate}
        paginator
        rows={6}
        emptyMessage="No devices found."
      />
      <p className="text-center text-gray-700">Total Items : {totalItems}</p>
      {/* Delete dialog */}
      <Dialog
        // visible={isDeleteDialogVisible}
        // onHide={() => setIsDeleteDialogVisible(false)}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-times"
              className="p-button-danger"
              // onClick={confirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-check"
              className="p-button-secondary"
              // onClick={() => setIsDeleteDialogVisible(false)}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete ${selectedDriver?.device_id}?</div>
      </Dialog>
      {/* <EditDeviceDialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        device={editedDevice}
      /> */}
    </div>
  );
};

export default DriversGrid;
