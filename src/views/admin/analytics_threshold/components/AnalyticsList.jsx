import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Tag } from "primereact/tag";
import Cookies from "js-cookie";

export default function AnalyticsList({ data, onEdit, onDelete }) {
  const token = Cookies.get("token");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // Initialize the state with an empty editData object
  const [editData, setEditData] = useState({
    title: "",
    user_uuid: "",
    score: {
      brake: "",
      tailgating: "",
      rash_driving: "",
      sleep_alert: "",
      over_speed: "",
      green_zone: "",
    },
    incentive: {
      minimum_distance: "",
      minimum_driver_rating: "",
    },
    accident: {
      ttc_difference_percentage: "",
    },
    leadership_board: {
      total_distance: "",
    },
    halt: {
      duration: "",
    },
  });

  const [listCustomers, setListCustomers] = useState([]);
  const titleInputRef = useRef(null);
  const brakeInputRef = useRef(null);
  const tailgatingInputRef = useRef(null);
  const [selectedAT, setSelectedAT] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const toastRef = useRef(null);

  // Global search logic
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

  // Get list of customers
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/get-all-customer`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.customerData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [editData]);

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

  //open delete dialog
  const openDeleteDialog = (rowData) => {
    setSelectedAT(rowData);
    setDeleteDialogVisible(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const header = renderHeader();

  //handle Delete
  const DeleteDeviceDialog = ({ visible, onHide }) => {
    const handleConfirmDelete = async () => {
      try {
        await onDelete(selectedAT?.user_uuid);
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
        <div>Are you sure you want to delete {selectedAT?.title}?</div>
      </Dialog>
    );
  };

  //open edit AT dialog
  const openDialog = (rowData) => {
    setIsDialogVisible(true);

    const analyticData = {
      threshold_uuid: rowData.threshold_uuid,
      user_uuid: rowData.user_uuid,
      title: rowData.title,
      score: JSON.parse(rowData.score),
      incentive: JSON.parse(rowData.incentive),
      accident: JSON.parse(rowData.accident),
      leadership_board: JSON.parse(rowData.leadership_board),
      halt: JSON.parse(rowData.halt),
      status: rowData.status,
    };
    setEditData(analyticData);

    console.log(editData);

    const emptyEditData = {
      title: "",
      user_uuid: "",
      score: {
        brake: "",
        tailgating: "",
        rash_driving: "",
        sleep_alert: "",
        over_speed: "",
        green_zone: "",
      },
      incentive: {
        minimum_distance: "",
        minimum_driver_rating: "",
      },
      accident: {
        ttc_difference_percentage: "",
      },
      leadership_board: {
        total_distance: "",
      },
      halt: {
        duration: "",
      },
    };
    const mergedData = Object.assign(emptyEditData, analyticData);

    // Set the editData state with the merged data
    setEditData(mergedData);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setInvalidFields(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for null values in the editData object
    const hasNullValues = Object.values(editData).some(
      (value) => value === null || value === ""
    );

    if (hasNullValues) {
      // Set invalidFields state to highlight the fields with validation errors
      const invalidFields = {};
      Object.entries(editData).forEach(([key, value]) => {
        if (value === null || value === "") {
          invalidFields[key] = true;
        }
      });
      setInvalidFields(invalidFields);

      // Find the first field with a validation error and focus on it
      if (invalidFields.title) {
        titleInputRef.current.focus();
      } else if (invalidFields.brake) {
        brakeInputRef.current.focus();
      } else if (invalidFields.tailgating) {
        tailgatingInputRef.current.focus();
      }

      return;
    }

    onEdit(editData?.threshold_uuid, editData);
    closeDialog();
  };

  const handleChange = (e, name, nestedProperty = null) => {
    let value = e.target ? e.target.value : e.value;

    // For the "user_uuid" dropdown, directly use the selected value
    if (name === "user_uuid") {
      value = value.value;
    }

    setInvalidFields((prevInvalidFields) => {
      // Clone the previous invalidFields to avoid mutating the state directly
      const clonedInvalidFields = { ...prevInvalidFields };

      // If a nestedProperty is provided, update the nested property
      if (nestedProperty) {
        // Create the nested object if it doesn't exist
        if (!clonedInvalidFields[name]) {
          clonedInvalidFields[name] = {};
        }
        clonedInvalidFields[name][nestedProperty] = false;
      } else {
        clonedInvalidFields[name] = false;
      }

      return clonedInvalidFields;
    });

    setEditData((prevEditData) => {
      // Clone the previous editData to avoid mutating the state directly
      const clonedData = { ...prevEditData };

      // If a nestedProperty is provided, update the nested property
      if (nestedProperty) {
        if (!clonedData[name]) {
          clonedData[name] = {};
        }
        clonedData[name][nestedProperty] = value;
      } else {
        clonedData[name] = value;
      }

      return clonedData;
    });
  };

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      label: el.first_name + " " + el.last_name,
      value: el.user_uuid,
    }));
  };

  //mapping customer names
  const getCustomerNameMap = () => {
    const customerNameMap = {};
    listCustomers?.forEach((el) => {
      const name = el.first_name + " " + el.last_name;
      customerNameMap[el.user_uuid] = name;
    });
    return customerNameMap;
  };
  const customerNameMap = getCustomerNameMap();

  // Status body
  const getStatusSeverity = (option) => {
    switch (option) {
      case 1:
        return "success";

      case 2:
        return "danger";
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status === 1 ? "Active" : "Deactive"}
        severity={getStatusSeverity(rowData.status)}
      />
    );
  };

  const handleStatusChange = (event) => {
    const newValue = parseInt(event.target.value);
    setEditData({ ...editData, status: newValue });
  };

  // Edit dialog
  return (
    <div className="card">
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                ref={titleInputRef}
                id="title"
                name="title"
                onChange={(e) => handleChange(e, "title")}
                value={editData?.title || ""}
                className={invalidFields.title ? "p-invalid" : ""}
              />
              <label htmlFor="title">Title</label>
            </span>
          </div>

          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <Dropdown
                disabled
                id="user_uuid"
                name="user_uuid"
                options={Customersoptions()}
                optionLabel="label"
                optionValue="value"
                className="p-dropdown"
                value={editData?.user_uuid || ""}
                onChange={(e) => handleChange(e, "user_uuid")}
              />

              <label htmlFor="user_uuid">Customer List</label>
            </span>
          </div>

          <p className="my-2 block text-lg font-medium text-gray-600 dark:text-white">
            Weightage
          </p>
          <div className="card p-fluid mt-6 flex flex-wrap gap-3">
            <div className="flex-auto">
              <span className="p-float-label">
                <InputText
                  name="brake-input"
                  keyfilter="pint"
                  title="(1-1000)"
                  id="brake-input"
                  onChange={(e) => handleChange(e, "score", "brake")}
                  value={editData?.score.brake || ""}
                />
                <label
                  htmlFor="brake-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Brake
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-1000
              </small>
            </div>
            <div className="flex-auto">
              <span className="p-float-label">
                <InputText
                  name="tailgating-input"
                  keyfilter="pint"
                  title="(1-1000)"
                  onChange={(e) => handleChange(e, "score", "tailgating")}
                  value={editData?.score.tailgating || ""}
                />
                <label
                  htmlFor="tailgating-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Tailgating
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-1000
              </small>
            </div>
            <div className="mt-3 flex-auto">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  name="rash-driving-input"
                  title="(1-1000)"
                  onChange={(e) => handleChange(e, "score", "rash_driving")}
                  value={editData?.score.rash_driving || ""}
                />
                <label
                  htmlFor="rash-driving-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Rash Driving
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-1000
              </small>
            </div>
            <div className="mt-3 flex-auto">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  name="sleep-alert-input"
                  title="(1-1000)"
                  onChange={(e) => handleChange(e, "score", "sleep_alert")}
                  value={editData?.score.sleep_alert || ""}
                />
                <label
                  htmlFor="sleep-alert-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Sleep Alert
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-1000
              </small>
            </div>
            <div className="mt-3 flex-auto">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  name="over-speed-input"
                  title="(1-1000)"
                  onChange={(e) => handleChange(e, "score", "over_speed")}
                  value={editData?.score.over_speed || ""}
                />
                <label
                  htmlFor="over-speed-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Over Speed
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-1000
              </small>
            </div>
            <div className="mt-3 flex-auto">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  name="green-zone-input"
                  title="(1-1000)"
                  onChange={(e) => handleChange(e, "score", "green_zone")}
                  value={editData?.score.green_zone || ""}
                />
                <label
                  htmlFor="green-zone-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Green Zone
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-1000
              </small>
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-2 block text-lg font-medium text-gray-600 dark:text-white">
              Incentive
            </p>
            <div className="card p-fluid mt-6 flex flex-wrap gap-3">
              <div className="flex-auto">
                <span className="p-float-label">
                  <InputText
                    keyfilter="pint"
                    name="minimum-distance-input"
                    title="(1-1000)"
                    onChange={(e) =>
                      handleChange(e, "incentive", "minimum_distance")
                    }
                    value={editData?.incentive.minimum_distance || ""}
                  />
                  <label
                    htmlFor="minimum-distance-input"
                    className="text-gray-150 dark:text-gray-150"
                  >
                    Minimum Distance
                  </label>
                </span>
                <small className="text-gray-400 dark:text-gray-150">
                  Range: 0-1000
                </small>
              </div>
              <div className="flex-auto">
                <span className="p-float-label">
                  <InputText
                    keyfilter="pint"
                    name="minimum-driver-rating-input"
                    title="(0-5)"
                    onChange={(e) =>
                      handleChange(e, "incentive", "minimum_driver_rating")
                    }
                    value={editData?.incentive.minimum_driver_rating || ""}
                  />
                  <label
                    htmlFor="minimum-driver-rating-input"
                    className="text-gray-150 dark:text-gray-150"
                  >
                    Minimum Driver Rating
                  </label>
                </span>
                <small className="text-gray-400 dark:text-gray-150">
                  Range: 0-5
                </small>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-2 block text-lg font-medium text-gray-600 dark:text-white">
              Accident
            </p>
            <div className="card p-fluid mt-6 flex flex-wrap gap-3">
              <div className="w-[285px]">
                <span className="p-float-label">
                  <InputText
                    keyfilter="pint"
                    name="ttc-difference-percentage-input"
                    title="(0-100)"
                    onChange={(e) =>
                      handleChange(e, "accident", "ttc_difference_percentage")
                    }
                    value={editData?.accident.ttc_difference_percentage || ""}
                  />
                  <label
                    htmlFor="ttc-difference-percentage-input"
                    className="text-gray-150 dark:text-gray-150"
                  >
                    TTC Difference Percentage
                  </label>
                </span>
                <small className="text-gray-400 dark:text-gray-150">
                  Range: 0-100
                </small>
              </div>
            </div>
          </div>
          <p className="mb-2 block text-lg font-medium text-gray-600 dark:text-white">
            Leadership Board
          </p>
          <div className="card p-fluid mt-6 flex flex-wrap gap-3">
            <div className="w-[285px]">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  name="total-distance-input"
                  title="(0-10000)"
                  onChange={(e) =>
                    handleChange(e, "leadership_board", "total_distance")
                  }
                  value={editData?.leadership_board.total_distance || ""}
                />
                <label
                  htmlFor="total-distance-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Total Distance
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 0-10000
              </small>
            </div>
          </div>
          <p className="my-2 block text-lg font-medium text-gray-600 dark:text-white">
            Halt
          </p>
          <div className="card p-fluid mt-6 flex flex-wrap gap-3">
            <div className="w-[285px]">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  name="halt-duration-input"
                  title="(1-1000)"
                  onChange={(e) => handleChange(e, "halt", "duration")}
                  value={editData?.halt.duration || ""}
                />
                <label
                  htmlFor="halt-duration-input"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Duration
                </label>
              </span>
              <small className="text-gray-400 dark:text-gray-150">
                Range: 1-1000
              </small>
            </div>
          </div>

          <div className="my-4">
            <input
              type="radio"
              className="inlinemx-2 mx-2"
              name="status"
              id="userActive"
              value={1}
              onChange={handleStatusChange}
              checked={editData.status === 1}
            />
            <label htmlFor="userActive">Active</label>
            <input
              type="radio"
              className="mx-2 inline"
              name="status"
              id="userDeactive"
              value={2}
              onChange={handleStatusChange}
              checked={editData.status === 2}
            />
            <label htmlFor="userDeactive">Deactive</label>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white  hover:bg-blue-600"
            >
              Edit Device
            </button>
          </div>
        </form>
      </Dialog>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />

      {/* List of AT */}
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
        globalFilterFields={["title", "user_uuid"]}
        emptyMessage="No Analytic Threshold found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          className="border-none dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
        <Column
          field="title"
          header="Title"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>

        <Column
          field="customer_name"
          header="Customer"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>

        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>

        <Column
          body={actionBodyTemplate}
          header="Action"
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
        ></Column>
      </DataTable>
      <DeleteDeviceDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
      />
    </div>
  );
}
