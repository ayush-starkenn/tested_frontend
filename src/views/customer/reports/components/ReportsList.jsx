import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

const ReportList = ({ data }) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const renderCellWithNA = (data) => {
    return data ? data : "--";
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const _filters = { ...filters };
    _filters["global"].value = null;
    setFilters(_filters);
  };

  const header = (
    <div className="align-items-center flex flex-wrap justify-end gap-2 py-3">
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
  );

  const openDeleteDialog = (rowData) => {
    setSelectedReport(rowData);
    setDeleteDialogVisible(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          tooltip="Delete"
          tooltipOptions={{ position: "mouse" }}
          style={{ width: "2rem", height: "2rem" }}
          className="mr-3 border border-red-600 text-red-600"
          onClick={() => openDeleteDialog(rowData)}
        />
        {rowData.reports_type === "1" && (
          <Button
            icon="pi pi-eye"
            rounded
            tooltip="View"
            tooltipOptions={{ position: "mouse" }}
            className="border border-blue-500 text-blue-500 dark:text-blue-500"
            style={{ width: "2rem", height: "2rem" }}
            onClick={(e) =>
              window.open(
                `http://localhost:3000/customer/report/${rowData.report_uuid}`
              )
            }
          />
        )}
      </React.Fragment>
    );
  };

  const DeleteDeviceDialog = ({ visible, onHide }) => {
    const handleConfirmDelete = async () => {
      try {
        // await onDeleteDevice(selectedDevice?.device_id);
        onHide();
      } catch (error) {
        console.error(error);
        onHide();
      }
    };

    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={handleConfirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={onHide}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {selectedReport?.title}?</div>
      </Dialog>
    );
  };
  return (
    <>
      <DataTable
        removableSort
        value={data}
        dataKey="report_uuid"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        filterDisplay="menu"
        filters={filters}
        globalFilterFields={[
          "vehicle_name",
          "vehicle_registration",
          "dms",
          "iot",
          "ecu",
        ]}
        emptyMessage="No reports found."
        header={header}
      >
        <Column
          header="Sr. No."
          field="serialNo"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem" }}
        ></Column>
        {/* <Column
          field="r_id"
          header="Report ID"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem", border: "none !important" }}
        ></Column> */}

        <Column
          field="title"
          header="Report Title"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="report_created_at"
          header="Created On"
          sortable
          body={(rowData) => {
            if (rowData.report_created_at) {
              const date = new Date(rowData.report_created_at);
              const formattedDate = `${String(date.getDate()).padStart(
                2,
                "0"
              )}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${date.getFullYear()}`;
              return formattedDate;
            } else {
              return "--";
            }
          }}
          className="dark-bg-navy-800 dark-text-gray-200 border-b"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="reports_type"
          header="Report Type"
          body={(rowData) =>
            rowData.reports_type === "1" ? "Generated" : "Scheduled"
          }
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "9rem" }}
        ></Column>
        <Column
          field="reports_schedule_type"
          header="Report Type"
          sortable
          body={(rowData) => {
            if (rowData.reports_schedule_type) {
              return renderCellWithNA(
                rowData.reports_schedule_type.charAt(0).toUpperCase() +
                  rowData.reports_schedule_type.slice(1)
              );
            } else {
              return renderCellWithNA(rowData.reports_schedule_type);
            }
          }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "9rem" }}
        ></Column>

        <Column
          body={actionBodyTemplate}
          header="Action"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
        ></Column>
      </DataTable>
      <DeleteDeviceDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
      />
    </>
  );
};

export default ReportList;
