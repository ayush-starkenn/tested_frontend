import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { TabView, TabPanel } from "primereact/tabview";
import FeatureSet from "./FeatureSet";
import VehicleTrips from "./VehicleTrips";

export default function VehiclesList({ data }) {
  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [myData, setMyData] = useState();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  //global search
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

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        className="px-3"
        value={
          parseInt(rowData.vehicle_status) === 1
            ? "Active"
            : parseInt(rowData.vehicle_status) === 2
            ? "Deactive"
            : ""
        }
        severity={getSeverity(rowData)}
      ></Tag>
    );
  };
  //opens vehicle details dialog
  const openDialog = (rowData) => {
    setMyData(rowData);
    setVisible(true);
  };
  //closes vehicle details dialog
  const closeDialog = () => {
    setVisible(false);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          rounded
          tooltip="View"
          tooltipOptions={{ position: "mouse" }}
          className="border border-blue-500 text-blue-500 dark:text-blue-500"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog(rowData)}
        />
      </React.Fragment>
    );
  };
  //

  const getSeverity = (data) => {
    switch (data.vehicle_status) {
      case 1:
        return "success";

      case 2:
        return "danger";

      default:
        return null;
    }
  };

  const header = (
    <div className="align-items-center flex flex-wrap justify-end gap-2 py-3 dark:bg-gray-950">
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

  const renderCellWithNA = (data) => {
    return data ? data : "--";
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card mt-4 rounded-lg bg-none dark:bg-gray-950">
        <DataTable
          removableSort
          value={data}
          selection={selectedVehicles}
          onSelectionChange={(e) => setSelectedVehicles(e.value)}
          dataKey="vehicle_uuid"
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
          emptyMessage="No vehicles found."
          header={header}
        >
          <Column
            key="serialNo"
            field="serialNo"
            header="Sr.No."
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "4rem", textAlign: "center" }}
          ></Column>
          <Column
            key="vehicle_name"
            field="vehicle_name"
            header="Vehicle Name"
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "10rem", border: "none !important" }}
          ></Column>
          <Column
            key="vehicle_registration"
            field="vehicle_registration"
            header="Registration No."
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "12rem" }}
            body={(rowData) => renderCellWithNA(rowData.ecu)}
          ></Column>
          <Column
            key="dms"
            field="dms"
            header="DMS"
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "9rem" }}
            body={(rowData) => renderCellWithNA(rowData.dms)}
          ></Column>
          <Column
            key="iot"
            field="iot"
            header="IoT"
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "9rem" }}
            body={(rowData) => renderCellWithNA(rowData.iot)}
          ></Column>
          <Column
            key="ecu"
            field="ecu"
            header="ECU"
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "9rem" }}
            body={(rowData) => renderCellWithNA(rowData.ecu)}
          ></Column>
          <Column
            key="vehicle_status"
            field="vehicle_status"
            header="Status"
            body={statusBodyTemplate}
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "7rem" }}
          ></Column>
          <Column
            key="action"
            body={actionBodyTemplate}
            header="Action"
            exportable={false}
            className="border-b dark:bg-navy-800"
            style={{ minWidth: "6rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={visible}
        onHide={closeDialog}
        header="Vehicle Details"
        style={{ width: "82vw" }}
      >
        <TabView>
          <TabPanel header="Completed Trips" leftIcon="pi pi-truck mr-2">
            <VehicleTrips myData={myData} />
          </TabPanel>
          {myData?.dms === null && (
            <TabPanel header="Feature Set" leftIcon="pi pi-cog mr-2">
              <FeatureSet myData={myData} closeDialog={closeDialog} />
            </TabPanel>
          )}
        </TabView>
      </Dialog>
    </div>
  );
}
