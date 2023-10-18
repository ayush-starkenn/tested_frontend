import React, { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { FaMale, FaFemale } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import moment from "moment";

const DriversList = ({ data, onEditDriver, onDeleteDriver }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editData, setEditData] = useState();
  const [rowId, setRowId] = useState();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toastRef = useRef(null);
  const [selectedDriverDob, setSelectedDriverDob] = useState(null);
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

  //Global search logic
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearSearch = () => {
    setGlobalFilterValue(""); // Clear the search input value
    const _filters = { ...filters };
    _filters["global"].value = null; // Clear the global filter value
    setFilters(_filters);
  };

  // Status body
  const getStatusSeverity = (option) => {
    switch (option) {
      case 1:
        return "success";

      case 2:
        return "danger";

      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.driver_status === 1 ? "Active" : "Deactive"}
        severity={getStatusSeverity(rowData.driver_status)}
      />
    );
  };

  //Gender body

  const genderBody = (rowData) => {
    const genderLabel = rowData.driver_gender === "male" ? "Male" : "Female";

    const GenderIcon = rowData.driver_gender === "male" ? FaMale : FaFemale;

    const tagStyle = {
      color: "#444",
      padding: "5px 10px",
      borderRadius: "18px",
      fontWeight: "bold",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    return (
      <Tag
        value={genderLabel}
        className="p-tag-rounded bg-gray-150"
        style={tagStyle}
      >
        <GenderIcon
          className={`${
            rowData.driver_gender === "male"
              ? "text-xl text-blue-500"
              : "text-xl text-red-400"
          }`}
        />
      </Tag>
    );
  };

  //Searchbox
  const renderHeader = () => {
    return (
      <div className="my-4 flex justify-end">
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
                className="p-button-rounded p-button-text dark:text-gray-50 dark:hover:text-gray-50"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
    );
  };
  const header = renderHeader();

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          style={{ width: "2rem", height: "2rem" }}
          severity="danger"
          onClick={() => openDeleteDialog(rowData)}
        />
      </>
    );
  };

  // Opens edit dialog
  const openDialog = (rowData) => {
    setIsDialogVisible(true);
    setEditData(rowData);
    setRowId(rowData);
    const dobDate = moment(rowData.driver_dob, "YYYY-MM-DD").toDate();
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
  const openDeleteDialog = (rowData) => {
    setSelectedDriver(rowData);
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
    <>
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
                />

                <label htmlFor="driver_dob" className="text-gray-150 ">
                  Date Of Birth
                </label>
              </span>
              {editData?.driver_dob === null && (
                <small className="p-error">Date of birth is required</small>
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
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {/* List View  */}
      <DataTable
        value={data}
        removableSort
        dataKey="driver_uuid"
        paginator
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "full_name",
          "driver_auth_id",
          "driver_email",
          "driver_mobile",
          "driver_license_no",
        ]}
        emptyMessage="No drivers found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          key="serialNo"
          field="serialNo"
          header="Sr. No."
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem", textAlign: "center" }}
        ></Column>
        <Column
          key="full_name"
          field="driver_first_name"
          header="Driver Name"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
          body={(rowData) => (
            <>
              {rowData.driver_first_name.charAt(0).toUpperCase() +
                rowData.driver_first_name.slice(1)}{" "}
              {rowData.driver_last_name.charAt(0).toUpperCase() +
                rowData.driver_last_name.slice(1)}
            </>
          )}
        />

        <Column
          key="driver_email"
          field="driver_email"
          header="Email"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          key="driver_mobile"
          field="driver_mobile"
          header="Contact"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "7rem" }}
        ></Column>
        <Column
          key="driver_license_no"
          field="driver_license_no"
          header="License Number"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          key="driver_status"
          field="driver_status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          key="driver_dob"
          field="driver_dob"
          header="DOB"
          sortable
          body={(rowData) => convertToIST(rowData.driver_dob)}
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "7rem" }}
        ></Column>
        <Column
          key="driver_gender"
          field="driver_gender"
          header="Gender"
          sortable
          body={genderBody}
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "7rem" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "7rem" }}
        ></Column>
      </DataTable>
      <DeleteDriverDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
      />
    </>
  );
};

export default DriversList;
