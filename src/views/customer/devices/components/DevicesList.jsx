import React, { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";

export default function DevicesList({ data }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [deviceTypeFilter, setDeviceTypeFilter] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toastRef = useRef(null);
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

  const handleDeviceTypeFilterChange = (selectedDeviceTypes) => {
    // Update the 'device_type' filter with the selected device types
    const updatedFilters = { ...filters };
    updatedFilters["device_type"].value = selectedDeviceTypes;
    setFilters(updatedFilters);

    // Update the device type filter state
    setDeviceTypeFilter(selectedDeviceTypes);
  };

  const deviceTypeOptions = [
    ...new Set(data.map((item) => item.device_type)),
  ].map((deviceType) => ({
    label: deviceType,
    value: deviceType,
  }));

  const clearSelected = () => {
    // Clear the selected device types
    handleDeviceTypeFilterChange([]);
  };

  const representativeFilterTemplate = () => {
    return (
      <div className="my-4 flex justify-end">
        <div className="justify-content-between align-items-center flex flex-wrap gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-filter" />
            <MultiSelect
              value={deviceTypeFilter}
              options={deviceTypeOptions}
              onChange={(e) => handleDeviceTypeFilterChange(e.value)}
              className="filter-dropdown border px-6"
              placeholder="Select any"
            />
          </span>
          <span className="text-end">
            <button
              className="rounded bg-gray-300 px-2 py-1"
              onClick={clearSelected}
            >
              Clear Selection
            </button>
          </span>
        </div>
      </div>
    );
  };
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
              className="searchbox w-[25vw] cursor-pointer rounded-full border py-3 pl-8 dark:bg-gray-950 dark:text-gray-50"
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
  const renderStatusCell = (rowData) => {
    console.log(rowData);

    const tagValue = rowData?.device_status === 1 ? "Active" : "Deactive";
    const tagSeverity = rowData?.device_status === 1 ? "success" : "danger";
    return <Tag value={tagValue} severity={tagSeverity} />;
  };

  return (
    <div className="card">
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <DataTable
        value={data}
        removableSort
        paginator
        dataKey="id"
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "device_id",
          "device_type",
          "sim_number",
          "customer_id",
        ]}
        emptyMessage="No devices found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          key="serialNo"
          field="serialNo"
          header="Sr. No."
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="device_id"
          header="Device ID"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="device_type"
          header="Device Type"
          sortField="device_type"
          filter
          filterElement={representativeFilterTemplate}
          className="border-b dark:bg-navy-800  dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>

        <Column
          field="sim_number"
          header="Sim Number"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="device_status"
          header="Status"
          sortable
          sortField="device_status"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={renderStatusCell}
        ></Column>
      </DataTable>
    </div>
  );
}
