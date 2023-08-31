import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { FaMale, FaFemale } from "react-icons/fa";

const DriversList = ({ data }) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const convertToIST = (dateTimeString) => {
    // Parse the date-time string into a Date object
    const parts = dateTimeString.split("T");
    const datePart = parts[0];
    const timePart = parts[1];
    const [year, month, day] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");

    const dateTime = new Date(year, month - 1, day, hours, minutes, seconds);

    const IST_OFFSET = 5 * 60 + 30; // IST offset in minutes
    dateTime.setMinutes(dateTime.getMinutes() + IST_OFFSET);
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
                className="p-button-rounded p-button-text"
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
          //   onClick={() => openDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          style={{ width: "2rem", height: "2rem" }}
          severity="danger"
          //   onClick={() => openDeleteDialog(rowData)}
        />
      </>
    );
  };
  return (
    <>
      {/* List View  */}
      <DataTable
        value={data}
        removableSort
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
          field="serialNo"
          header="Sr. No."
          className="border-none dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "5rem", textAlign: "center" }}
        ></Column>
        <Column
          field="full_name"
          header="Driver Name"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="driver_auth_id"
          header="Driver AUTH ID"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="driver_email"
          header="Email"
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="driver_mobile"
          header="Contact"
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="driver_license_no"
          header="License Number"
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="driver_status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="driver_dob"
          header="DOB"
          sortable
          body={(rowData) => convertToIST(rowData.driver_dob)}
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="driver_gender"
          header="Gender"
          sortable
          body={genderBody}
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
      </DataTable>
    </>
  );
};

export default DriversList;
