import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { DataView } from "primereact/dataview";
import { GiMineTruck } from "react-icons/gi";
import { TabPanel, TabView } from "primereact/tabview";
import FeatureSet from "./FeatureSet";
import VehicleTrips from "./VehicleTrips";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

export default function VehiclesGrid({ data }) {
  const [viewDialog, setViewDialog] = useState(false);
  const [myData, setMyData] = useState(data);
  const totalItems = data.length;
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const ViewDialog = (rowData) => {
    setMyData(rowData);
    setViewDialog(true);
  };
  const closeViewDialog = () => {
    setViewDialog(false);
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    applyFilters({
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const _filters = { ...filters };
    _filters["global"].value = null;
    setFilters(_filters);
    applyFilters(_filters); // Apply filters after clearing search
  };

  const applyFilters = (filters) => {
    let filteredData = myData;
    if (myData) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
        )
      );
    }
    if (filters.device_type.value) {
      filteredData = filteredData.filter((item) =>
        filters.device_type.value.includes(item.device_type)
      );
    }
    setMyData(filteredData);
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-col-12 vehicle-card mb-6 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-150">
        <div className="card">
          <div className="card-header">
            <div className="p-text-bold">{`${item.vehicle_name} - ${item.vehicle_registration}`}</div>
          </div>
          <div className="card-body flex-grow">
            <div className="flex-col">
              <div className=" flex justify-around">
                <div>
                  <div>
                    <GiMineTruck
                      className="text-red-450 dark:text-red-550"
                      style={{
                        fontSize: "4rem",
                      }}
                    />
                  </div>
                </div>
                <div></div>
                <div className="p-grid">
                  <div className="p-col">
                    {item.ecu && <h1 className="p-text-bold">ECU:</h1>}
                    {item.iot && <h1 className="p-text-bold">IoT:</h1>}
                    {item.dms && <h1 className="p-text-bold">DMS:</h1>}
                    <h1 className="p-text-bold">Status:</h1>
                  </div>

                  <div className="p-col">
                    {item.ecu && <p>{item.ecu}</p>}
                    {item.iot && <p>{item.iot}</p>}
                    {item.dms && <p>{item.dms}</p>}
                    <Tag
                      value={item?.vehicle_status === 1 ? "Active" : "Deactive"}
                      severity={
                        item?.vehicle_status === 1 ? "success" : "danger"
                      }
                      rounded
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-card-footer mb-2">
            <div className="flex justify-center">
              <Button
                icon="pi pi-eye"
                rounded
<<<<<<< HEAD
                outlined
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                className="border border-blue-500 text-blue-500 dark:text-blue-500"
                severity="help"
=======
                className="border border-blue-500 text-blue-500 dark:text-blue-500"
                style={{ width: "2rem", height: "2rem" }}
>>>>>>> main
                onClick={() => ViewDialog(item)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
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
      {/* GridView */}
      <DataView
        value={data}
        layout="grid"
        itemTemplate={itemTemplate}
        paginator
        rows={6}
        emptyMessage="No vehicle found."
      />
      <p className="text-center text-gray-700">Total Items : {totalItems}</p>
      {/* ViewDialog */}
      <Dialog
        visible={viewDialog}
        onHide={closeViewDialog}
        header="View Page"
        style={{ width: "70vw" }}
      >
        <TabView>
          <TabPanel header="Vehicle's Trips" leftIcon="pi pi-truck mr-2">
            <VehicleTrips myData={myData} />
          </TabPanel>
          <TabPanel header="Feature Set" leftIcon="pi pi-cog mr-2">
            <FeatureSet myData={myData} closeDialog={closeViewDialog} />
          </TabPanel>
        </TabView>
      </Dialog>
    </div>
  );
}
