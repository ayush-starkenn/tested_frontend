import React from "react";

const applyFilters = (filters, allData) => {
  let filteredData = allData;
  //condition to exclude these fields for global search
  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "_id" &&
          key !== "status" &&
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
      )
    );
  }

  return filteredData;
};

const DriversGrid = ({ data, onDeleteDevice, onEditDevice }) => {
  return <></>;
};

export default DriversGrid;
