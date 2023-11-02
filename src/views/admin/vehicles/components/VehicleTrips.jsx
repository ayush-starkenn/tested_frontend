import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
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

  //vehicle trip data

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/trips/get-vehicle-trips/${myData.vehicle_uuid}`,
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
  }, [token, myData]);

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
          className="border-b  bg-[#F2F2F2] dark:bg-navy-700 dark:text-gray-200"
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
        <Column
          field="trip_id"
          header="Trip ID"
          sortable
          className="border-b bg-[#F2F2F2] dark:bg-navy-700 dark:text-gray-200"
          style={{ minWidth: "8rem", border: "none !important" }}
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
          className="border-b bg-[#F2F2F2] dark:bg-navy-700 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
          body={(rowData) => convertEpochToIST(rowData.trip_start_time)}
        ></Column>
        <Column
          field="trip_end_time"
          header="Trip End"
          sortable
          className="border-b bg-[#F2F2F2] dark:bg-navy-700 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
          body={(rowData) => convertEpochToIST(rowData.trip_end_time)}
        ></Column>
        <Column
          field="total_distance"
          header="Distance Travelled"
          sortable
          className="border-b bg-[#F2F2F2] dark:bg-navy-700 dark:text-gray-200"
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
          className="border-b bg-[#F2F2F2] dark:bg-navy-700 dark:text-gray-200"
          style={{ minWidth: "9rem" }}
        ></Column>
      </DataTable>
    </>
  );
};

export default VehicleTrips;
