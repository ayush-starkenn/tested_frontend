import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { MdOnDeviceTraining } from "react-icons/md";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

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

const DriversGrid = ({ data, onDeleteDriver, onEditDriver }) => {
  const [allData, setAllData] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const totalItems = filteredData.length;
  const toastRef = useRef(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedDriverDob, setSelectedDriverDob] = useState(null);
  const [rowId, setRowId] = useState();

  const convertToIST = (dateTimeString) => {
    const dateStr = dateTimeString.toString();
    // Parse the date-time string into a Date object
    const parts = dateStr.split("T");
    const datePart = parts[0];
    const [year, month, day] = datePart.split("-");
    const dateTime = new Date(year, month - 1, day);
    dateTime.setMinutes(dateTime.getMinutes());
    return dateTime.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
                    <span>{convertToIST(item.driver_dob)}</span>
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
                  onClick={() => openDialog(item)}
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
                  onClick={() => openDeleteDialog(item)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Opens edit dialog
  const openDialog = (item) => {
    setIsDialogVisible(true);
    setEditData(item);
    setRowId(item);
    const dobDate = moment(item.driver_dob, "YYYY-MM-DD").toDate();
    setSelectedDriverDob(dobDate);
  };

  //Closes edit dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  //Update api call
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if any required field is empty
    const requiredFields = [
      "driver_first_name",
      "driver_last_name",
      "driver_email",
      "driver_mobile",
      "driver_dob",
      "driver_gender",
      "driver_auth_id",
      "driver_license_no",
      "driver_status",
    ];
    const isAnyFieldEmpty = requiredFields.some((field) => !editData[field]);

    if (isAnyFieldEmpty) {
      toastRef.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill in all required fields.",
      });
    } else {
      onEditDriver(rowId?.driver_uuid, editData);
      closeDialog();
    }
  };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e.value;
    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  //Handle Delete
  const openDeleteDialog = (item) => {
    setSelectedDriver(item);
    setDeleteDialogVisible(true);
  };
  const DeleteDriverDialog = ({ visible, onHide }) => {
    const handleConfirmDelete = async () => {
      try {
        await onDeleteDriver(selectedDriver?.driver_uuid);
        onHide();
      } catch (error) {
        console.error(error);
        onHide();
      }
    };
    // Delete dialog
    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-times"
              className="p-button-danger px-3 py-2 hover:bg-none dark:hover:bg-gray-50"
              onClick={handleConfirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-check"
              className="p-button-secondary px-3 py-2 hover:bg-none dark:hover:bg-gray-50"
              onClick={onHide}
            />
          </div>
        }
      >
        <div>
          Are you sure you want to delete {selectedDriver?.driver_first_name}?
        </div>
      </Dialog>
    );
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const handleDriverStatusChange = (event) => {
    const newValue = parseInt(event.target.value);
    setEditData({ ...editData, driver_status: newValue });
  };

  return (
    <div>
      {/* Edit Dialog */}
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Device"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form className="mx-auto">
          <div className="flex justify-evenly">
            <div className="card justify-content-center mr-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="first_name"
                  onChange={(e) => handleChange(e, "driver_first_name")}
                  value={editData?.driver_first_name || ""}
                  name="driver_first_name"
                  className={!editData?.driver_first_name ? "p-invalid" : ""}
                  autoComplete="off"
                />
                <label htmlFor="first_name">First Name</label>
              </span>
              {editData?.driver_first_name === "" && (
                <small className="p-error">First Name is required</small>
              )}
            </div>
            <div className="card justify-content-center ml-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="driver_last_name"
                  onChange={(e) => handleChange(e, "driver_last_name")}
                  name="driver_last_name"
                  value={editData?.driver_last_name}
                  className={!editData?.driver_last_name ? "p-invalid" : ""}
                  autoComplete="off"
                />
                <label htmlFor="driver_last_name">Last Name</label>
              </span>
              {editData?.driver_last_name === "" && (
                <small className="p-error">Last Name is required</small>
              )}
            </div>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="driver_email"
                onChange={(e) => {
                  handleChange(e, "driver_email");
                }}
                type="email"
                value={editData?.driver_email}
                className={!editData?.driver_email ? "p-invalid" : ""}
                name="driver_email"
                autoComplete="off"
              />
              <label htmlFor="driver_email">Email</label>
            </span>
            {editData?.driver_email === "" && (
              <small className="p-error">Email id is required</small>
            )}
          </div>
          <div className="mx-auto mb-3 mt-8">
            <span className="p-float-label">
              <InputText
                id="driver_mobile"
                type="tel"
                onChange={(e) => {
                  handleChange(e, "driver_mobile");
                }}
                value={editData?.driver_mobile}
                name="driver_mobile"
                className={!editData?.driver_mobile ? "p-invalid" : ""}
                autoComplete="off"
              />
              <label htmlFor="driver_mobile">Contact Number</label>
            </span>
            {editData?.driver_mobile === "" && (
              <small className="p-error">Contact number is required</small>
            )}
          </div>
          <div className="flex justify-evenly">
            <div className="card justify-content-center mr-2 mt-5  flex-auto">
              <span className="p-float-label">
                <Calendar
                  id="driver_dob"
                  value={selectedDriverDob}
                  onChange={(e) => {
                    setSelectedDriverDob(e.value);
                    handleChange(e, "driver_dob");
                  }}
                  dateFormat="dd/mm/yy"
                  name="driver_dob"
                  className={!editData?.driver_dob ? "p-invalid" : ""}
                  autoComplete="off"
                />

                <label
                  htmlFor="driver_dob"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Date Of Birth
                </label>
              </span>
              {editData?.driver_dob === "" && (
                <p className="p-error">Date of birth is required</p>
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
                  value={editData?.driver_gender || ""}
                  onChange={(e) => {
                    handleChange(e, "driver_gender");
                  }}
                  className={!editData?.driver_gender ? "p-invalid" : ""}
                />
                <label htmlFor="driver_gender">Gender</label>
              </span>
              {editData?.driver_gender === "" && (
                <small className="p-error">Gender is required</small>
              )}
            </div>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="driver_auth_id"
                onChange={(e) => {
                  handleChange(e, "driver_auth_id");
                }}
                name="driver_auth_id"
                value={editData?.driver_auth_id}
                className={!editData?.driver_auth_id ? "p-invalid" : ""}
                autoComplete="off"
              />
              <label htmlFor="driver_auth_id">Driver Auth ID</label>
            </span>
            {editData?.driver_auth_id === "" && (
              <small className="p-error">Auth id is required</small>
            )}
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="driver_license_no"
                onChange={(e) => {
                  handleChange(e, "driver_license_no");
                }}
                value={editData?.driver_license_no}
                name="driver_license_no"
                className={!editData?.driver_license_no ? "p-invalid" : ""}
                autoComplete="off"
              />
              <label htmlFor="driver_license_no">Driver License Number</label>
            </span>
            {editData?.driver_license_no === "" && (
              <small className="p-error">License number is required</small>
            )}
          </div>
          <div className="mx-auto mt-8">
            <input
              type="radio"
              className="inlinemx-2 mx-2"
              name="driver_status"
              id="userActive"
              value={1}
              onChange={handleDriverStatusChange}
              checked={editData?.driver_status === 1}
            />
            <label htmlFor="userActive">Active</label>
            <input
              type="radio"
              className="mx-2 inline"
              name="driver_status"
              id="userDeactive"
              value={2}
              onChange={handleDriverStatusChange}
              checked={editData?.driver_status === 2}
            />
            <label htmlFor="userDeactive">Deactive</label>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white  hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </form>
      </Dialog>
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
                className="p-button-rounded dark:hover:text-gray-50v p-button-text dark:text-gray-50"
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
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-times"
              className="p-button-danger"
            />
            <Button
              label="Cancel"
              icon="pi pi-check"
              className="p-button-secondary"
            />
          </div>
        }
      >
        <div>Are you sure you want to delete ${selectedDriver?.device_id}?</div>
      </Dialog>
      <DeleteDriverDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
      />
    </div>
  );
};

export default DriversGrid;
