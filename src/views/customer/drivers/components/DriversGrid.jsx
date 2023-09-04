import React from "react";

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
  return <>justify</>;
};

export default DriversGrid;
