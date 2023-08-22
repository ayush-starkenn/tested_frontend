import React, { useState, useEffect, useRef } from "react";
import AnalyticsList from "./components/AnalyticsList";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import Cookies from "js-cookie";

const AnalyticsThreshold = () => {
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [data, setData] = useState([]);
  const toastRef = useRef(null);
  const toastErr = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formErrors, setFormErrors] = useState({
    title: false,
    customer_id: false,
    brake: false,
    tailgating: false,
    rash_driving: false,
    sleep_alert: false,
    over_speed: false,
    green_zone: false,
    minimum_distance: false,
    minimum_driver_rating: false,
    ttc_difference_percentage: false,
    total_distance: false,
    duration: false,
  });

  //Fetching all data
  useEffect(() => {
    fetchAnalyticsThresholdData();
  }, []);

  const fetchAnalyticsThresholdData = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/analytics-threshold/get-analytics-threshold`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        console.log(res.data.analyticData);
        const formattedData = res.data.analyticData.map((item, index) => ({
          ...item,
          serialNo: index + 1,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Delete api call
  const handleDeleteAT = (customer_id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/admin/analytics-threshold/delete-customers-at/${customer_id}`
      )
      .then((res) => {
        fetchAnalyticsThresholdData();
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Analytic Threshold ${data.title} deleted successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        console.error(err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete AT. Please try again later.",
          life: 3000,
        });
      });
  };

  // Edit analytic threshold
  const handleUpdateAT = (threshold_uuid, editedData) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/analytics-threshold/update-analytic-threshold/${threshold_uuid}`,
        { ...editedData, userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        fetchAnalyticsThresholdData();
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Analytics Threshold ${editedData.title} updated successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        if (err.response.data === 404) {
          console.log(err.response.data.error);
          toastRef.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Analytic Threshold not found",
            life: 3000,
          });
        }
        if (err.response.data === 500) {
          toastRef.current.show({
            severity: "danger",
            summary: "Error",
            detail: "Failed to update AT",
            life: 3000,
          });
        }
      });
  };

  const openDialog = () => {
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setFormErrors(false);
    setSelectedCustomer(null);
  };

  // Get customer list
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/get-all-customer`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        setCustomers(response.data.customerData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const customerOptions = customers.map((customer) => ({
    label: `${customer.first_name}  ${customer.last_name}`,
    value: customer.user_uuid,
  }));

  //add AT api call
  const resetFormFields = () => {
    setSelectedCustomer(null);
    const form = document.querySelector("form");
    form.reset();
  };

  // Add analytic threshold
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      title: event.target.elements["title"]?.value,
      customer_id: selectedCustomer,
      brake: event.target.elements["brake-input"]?.value,
      tailgating: event.target.elements["tailgating-input"]?.value,
      rash_driving: event.target.elements["rash-driving-input"]?.value,
      sleep_alert: event.target.elements["sleep-alert-input"]?.value,
      over_speed: event.target.elements["over-speed-input"]?.value,
      green_zone: event.target.elements["green-zone-input"]?.value,
      minimum_distance: event.target.elements["minimum-distance-input"]?.value,
      minimum_driver_rating:
        event.target.elements["minimum-driver-rating-input"]?.value,
      ttc_difference_percentage:
        event.target.elements["ttc-difference-percentage-input"]?.value,
      total_distance: event.target.elements["total-distance-input"]?.value,
      duration: event.target.elements["halt-duration-input"]?.value,
      status: event.target.elements["status"]?.value,
    };

    const isCustomerEmpty = !selectedCustomer;
    setFormErrors({
      title: formData.title === "",
      customer_id: isCustomerEmpty,
      brake: formData.brake === "",
      tailgating: formData.tailgating === "",
      rash_driving: formData.rash_driving === "",
      sleep_alert: formData.sleep_alert === "",
      over_speed: formData.over_speed === "",
      green_zone: formData.green_zone === "",
      minimum_distance: formData.minimum_distance === "",
      minimum_driver_rating: formData.minimum_driver_rating === "",
      ttc_difference_percentage: formData.ttc_difference_percentage === "",
      total_distance: formData.total_distance === "",
      duration: formData.duration === "",
    });

    const rangeValidations = {
      brake: [1, 1000],
      tailgating: [1, 1000],
      rash_driving: [1, 1000],
      sleep_alert: [1, 1000],
      over_speed: [0, 1000],
      green_zone: [1, 1000],
      minimum_distance: [1, 1000],
      minimum_driver_rating: [0, 5],
      ttc_difference_percentage: [0, 100],
      total_distance: [0, 10000],
      duration: [1, 1000],
    };

    const invalidFields = {};
    Object.entries(rangeValidations).forEach(([field, [min, max]]) => {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || value < min || value > max) {
        invalidFields[field] = true;
      }
    });

    setFormErrors(invalidFields);
    const requiredFields = [
      "title",
      "customer_id",
      "brake",
      "tailgating",
      "rash_driving",
      "sleep_alert",
      "over_speed",
      "green_zone",
      "minimum_distance",
      "minimum_driver_rating",
      "ttc_difference_percentage",
      "total_distance",
      "duration",
    ];

    const isAnyFieldEmpty = requiredFields.some(
      (fieldName) => formData[fieldName] === ""
    );

    if (isAnyFieldEmpty) {
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
      return;
    }

    // Send the data to the API endpoint using axios
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/analytics-threshold/add-analytics`,
        { ...formData, userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((response) => {
        // Reset the form and provide feedback
        fetchAnalyticsThresholdData();
        toastRef.current.show({
          severity: "success",
          summary: `${formData.title}`,
          detail: "Analytics Threshold Score Generated Successfully.",
          life: 3000,
        });
        setIsDialogVisible(false);
        console.log("Data saved successfully:", response.data);
        resetFormFields(); // You should implement this function
      })
      .catch((error) => {
        // Handle API request errors
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail:
            error.response?.data?.message ||
            "An error occurred. Please try again later.",
          life: 3000,
        });
        console.error("Error saving data:", error);
      });
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} className="bg-red-400" />
      <div className="flex justify-between">
        <h4 className="text-dark text-xl font-bold dark:text-white">
          AnalyticsThreshold
        </h4>
      </div>

      <Button
        label="Create"
        icon="pi pi-plus"
        severity="primary"
        className="mt-2 h-10 px-3 py-0 text-left dark:hover:text-white"
        onClick={openDialog}
      />

      {/* List of AT */}
      <AnalyticsList
        data={data}
        onEdit={handleUpdateAT}
        onDelete={handleDeleteAT}
      />

      {/* Add AT form */}
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <p className="text-right text-sm text-red-400">
          All Fields Are Required<span className="text-red-500">**</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="my-6 w-[42vw]">
            <span className="p-float-label">
              <InputText
                name="title"
                className={`dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 py-3.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-50 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                  formErrors.title ? "p-invalid" : ""
                }`}
              />
              <label
                htmlFor="title"
                className="text-gray-150 dark:text-gray-150"
              >
                Title
              </label>
            </span>
          </div>
          <div className="mb-6">
            <span className="p-float-label">
              <Dropdown
                value={selectedCustomer}
                options={customerOptions}
                onChange={(e) => setSelectedCustomer(e.value)}
                className={`w-[42vw] rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                  formErrors.customer_id ? "p-invalid" : ""
                } `}
                optionLabel="label"
              />
              <label htmlFor="dd-city">Select a customer</label>
            </span>
          </div>
          <div className="mb-6">
            <p className="mb-2 block text-lg font-medium text-gray-600 dark:text-white">
              Weightage
            </p>
            <div className="card p-fluid mt-6 flex flex-wrap gap-3">
              <div className="flex-auto">
                <span className="p-float-label">
                  <InputText
                    name="brake-input"
                    keyfilter="pint"
                    title="(1-1000)"
                    className={formErrors.brake ? "p-invalid p-filled" : ""}
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
                    className={
                      formErrors.tailgating ? "p-invalid p-filled" : ""
                    }
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
                    className={
                      formErrors.rash_driving ? "p-invalid p-filled" : ""
                    }
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
                    className={
                      formErrors.sleep_alert ? "p-invalid p-filled" : ""
                    }
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
                    className={
                      formErrors.over_speed ? "p-invalid p-filled" : ""
                    }
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
                    className={
                      formErrors.green_zone ? "p-invalid p-filled" : ""
                    }
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
                    className={
                      formErrors.minimum_distance ? "p-invalid p-filled" : ""
                    }
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
                    keyfilter="num"
                    name="minimum-driver-rating-input"
                    title="(0-5)"
                    className={
                      formErrors.minimum_driver_rating
                        ? "p-invalid p-filled"
                        : ""
                    }
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
                    className={
                      formErrors.ttc_difference_percentage
                        ? "p-invalid p-filled"
                        : ""
                    }
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
          <div className="mb-6">
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
                    className={
                      formErrors.total_distance ? "p-invalid p-filled" : ""
                    }
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
          </div>
          <div className="mb-6">
            <p className="mb-2 block text-lg font-medium text-gray-600 dark:text-white">
              Halt
            </p>
            <div className="card p-fluid mt-6 flex flex-wrap gap-3">
              <div className="w-[285px]">
                <span className="p-float-label">
                  <InputText
                    keyfilter="pint"
                    name="halt-duration-input"
                    title="(1-1000)"
                    className={formErrors.duration ? "p-invalid p-filled" : ""}
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
          </div>

          <div className="my-4">
            <input
              type="radio"
              className="inlinemx-2 mx-2"
              name="status"
              id="userActive"
              value={1}
            />
            <label htmlFor="userActive">Active</label>
            <input
              type="radio"
              className="mx-2 inline"
              name="status"
              id="userDeactive"
              value={2}
            />
            <label htmlFor="userDeactive">Deactive</label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default AnalyticsThreshold;
