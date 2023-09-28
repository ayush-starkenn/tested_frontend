import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import axios from "axios";
import Cookies from "js-cookie";

const VehicleTrips = ({ myData }) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [data, setData] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const token = Cookies.get("token");
  const [hoveredTripId, setHoveredTripId] = useState(null);

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
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="text-red-500 dark:text-blue-500"
          style={{ width: "2rem", height: "2rem" }}
        />
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return rowData.trip_status === 1 ? (
      <Tag
        value={"Completed"}
        severity={"success"}
        style={{ width: "75px" }}
      ></Tag>
    ) : (
      <Tag
        value={"Ongoing"}
        severity={"danger"}
        style={{ width: "75px" }}
      ></Tag>
    );
  };

  //vehicle trip data

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/trips/get-vehicle-trips/${myData.vehicle_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        const formattedData = res.data.results.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          key: index + 1,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function convertEpochToIST(epoch) {
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  }

  return (
    <>
      <DataTable
        removableSort
        value={data}
        dataKey="ts_id"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        filterDisplay="menu"
        filters={filters}
        globalFilterFields={[
          "trip_id",
          "trip_start_time",
          "trip_end_time",
          "duration",
        ]}
        emptyMessage="No Trips found."
        header={header}
      >
        <Column
          field="serialNo"
          header="Sr.No."
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
        <Column
          field="trip_id"
          header="Trip ID"
          sortable
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem", border: "none !important" }}
          body={(rowData) => (
            <span
              onMouseEnter={() => setHoveredTripId(rowData.trip_id)}
              onMouseLeave={() => setHoveredTripId(null)}
            >
              {hoveredTripId === rowData.trip_id
                ? rowData.trip_id
                : rowData.trip_id.substring(0, 5) + "..."}
            </span>
          )}
        ></Column>

        <Column
          field="trip_start_time"
          header="Trip Start"
          sortable
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
          body={(rowData) => convertEpochToIST(rowData.trip_start_time)}
        ></Column>
        <Column
          field="trip_end_time"
          header="Trip End"
          sortable
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
          body={(rowData) => convertEpochToIST(rowData.trip_end_time)}
        ></Column>
        <Column
          field="total_distance"
          header="Distance Travelled"
          sortable
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "9rem" }}
          body={(rowData) => {
            const distance = parseFloat(rowData.total_distance);
            const formattedDistance = distance.toFixed(2);
            return formattedDistance + " km";
          }}
        ></Column>

        <Column
          field="duration"
          header="Duration"
          sortable
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "9rem" }}
        ></Column>
        <Column
          field="trip_status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "7rem" }}
        ></Column>
        <Column
          key="action"
          body={actionBodyTemplate}
          header="Action"
          exportable={false}
          className="border-none dark:bg-navy-800"
          style={{ minWidth: "6rem" }}
        ></Column>
      </DataTable>
    </>
  );
};

export default VehicleTrips;
