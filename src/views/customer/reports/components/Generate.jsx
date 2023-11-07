import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
// import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
// import { RadioButton } from "primereact/radiobutton";
import axios from "axios";
import Cookies from "js-cookie";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const Generate = ({ close }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState(null);
  const [titleValid, setTitleValid] = useState(true);
  const [startDateValid, setStartDateValid] = useState(true);
  const [endDateValid, setEndDateValid] = useState(true);
  const [vehicleValid, setVehicleValid] = useState(true);
  const [eventValid, setEventValid] = useState(true);
  const [contactValid, setContactValid] = useState(true);
  const toastRef = useRef(null);
  const [selectedVehicleNames, setSelectedVehicleNames] = useState([]);
  const [selectedEventNames, setSelectedEventNames] = useState([]);
  // const [vehicleParams, setVehicleParams] = useState([]);
  // const [driverParams, setDriverParams] = useState([]);
  const [contacts, setContacts] = useState([]);

  // const vehicleparams = [
  //   { name: "CAS", value: "CAS" },
  //   { name: "DMS", value: "DMS" },
  //   // Add more vehicles as needed
  // ];

  const events = [
    { name: "Alarm", code: "ALM" },
    { name: "Break Data", code: "BRK" },
    { name: "Accelarator Cut Data", code: "ACC" },
    { name: "Limp Mode Data", code: "LMP" },
    { name: "Accident Data", code: "ACD" },
    { name: "Accelarator Cut Data", code: "ACC" },
    { name: "DMS", code: "DMS" },
  ];

  // const driverparams = [
  //   { name: "Score", id: 1 },
  //   // Add more vehicles as needed
  // ];

  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1 and pad with '0' if needed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/reports/getreports-all-vehicles/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setVehicles(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();

    if (title.trim() === "") {
      setTitleValid(false);
    } else {
      setTitleValid(true);
    }

    const startDate = selectedStartDate ? new Date(selectedStartDate) : null;
    const endDate = selectedEndDate ? new Date(selectedEndDate) : null;

    if (!startDate) {
      setStartDateValid(false);
    } else if (startDate > today) {
      setStartDateValid(false);
      toastRef.current.show({
        severity: "error",
        summary: "Invalid Start Date",
        detail: "Start date cannot be in the future.",
        life: 3000,
      });
      return;
    } else {
      setStartDateValid(true);
    }

    // Check and set the end date validity
    if (!endDate) {
      setEndDateValid(false);
    } else if (endDate > today) {
      setEndDateValid(false);
      toastRef.current.show({
        severity: "warn",
        summary: "Invalid End Date",
        detail: "End date cannot be in the future.",
        life: 3000,
      });
      return;
    } else {
      setEndDateValid(true);
    }

    if (selectedStartDate > today) {
      setStartDateValid(false);
      toastRef.current.show({
        severity: "warn",
        summary: "Invalid Start Date",
        detail: "Start date cannot be in the future.",
        life: 3000,
      });
    } else {
      setStartDateValid(true);
    }

    // Check and set the end date validity
    if (selectedEndDate > today) {
      setEndDateValid(false);
      toastRef.current.show({
        severity: "error",
        summary: "Invalid End Date",
        detail: "End date cannot be in the future.",
        life: 3000,
      });
    } else {
      setEndDateValid(true);
    }
    // Check and set the start date validity
    if (!selectedStartDate) {
      setStartDateValid(false);
    } else {
      setStartDateValid(true);
    }

    // Check and set the end date validity
    if (!selectedEndDate) {
      setEndDateValid(false);
    } else {
      setEndDateValid(true);
    }

    // Check and set the vehicle validity
    if (!selectedVehicles || selectedVehicles.length === 0) {
      setVehicleValid(false);
    } else {
      setVehicleValid(true);
    }

    // Check and set the event validity
    if (!selectedEvents || selectedEvents.length === 0) {
      setEventValid(false);
    } else {
      setEventValid(true);
    }

    // Check and set the contact validity
    if (!selectedContacts || selectedContacts.length === 0) {
      setContactValid(false);
    } else {
      setContactValid(true);
    }

    // Check if any field is invalid
    if (
      !titleValid ||
      !startDateValid ||
      !endDateValid ||
      !vehicleValid ||
      !eventValid ||
      !contactValid
    ) {
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
      return;
    }
    const requestData = {
      title: title,
      from_date: selectedStartDate,
      to_date: selectedEndDate,
      selected_vehicles: selectedVehicles,
      selected_events: selectedEvents,
      contact_uuid: selectedContacts,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/reports/createReports-all/${user_uuid}`,

        requestData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        close();

        window.open(`/customer/report/${res.data.report_uuid}`, "_blank");
      })
      .catch((error) => {
        toastRef.current.show({
          severity: "warn",
          summary: "Fill Required Fields",
          detail: error.response.data.message,
          life: 3000,
        });
      });
  };

  const vehicleOptions = () => {
    const optionsArray = [];
    vehicles.forEach((el) => {
      optionsArray.push({
        key: el.vehicle_uuid,
        name: el.vehicle_name,
        code: el.vehicle_uuid,
      });
    });
    return optionsArray;
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/contacts/getContacts-all/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setContacts(res.data.contacts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  const contactOptions = () => {
    const optionsArray = [];
    contacts.forEach((el) => {
      optionsArray.push({
        key: el.contact_uuid,
        label: el.contact_first_name + " " + el.contact_last_name,
        code: el.contact_uuid,
      });
    });
    return optionsArray;
  };
  console.log(selectedStartDate);
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div>
        <p className="text-right text-sm text-red-500">
          All Fields Are Required<span> **</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mt-8">
              <span className="p-float-label">
                <InputText
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleValid(e.target.value.trim() !== "");
                  }}
                  className={`rounded-lg border border-gray-300 py-2 pl-2 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                    !titleValid ? "border-red-600" : ""
                  }`}
                />
                <label
                  htmlFor="title"
                  className="text-gray-600 dark:text-gray-150"
                >
                  Title
                </label>
              </span>
              {!titleValid && (
                <small className="text-red-500">Title is required.</small>
              )}
            </div>
            <div className="card p-fluid mt-6 flex flex-wrap gap-3">
              <div className="flex-auto">
                <span className="p-float-label">
                  <Calendar
                    id='from_date'
                    inputId="start_date"
                    value={
                      selectedStartDate ? new Date(selectedStartDate) : null
                    }
                    onChange={(e) => {
                      const formattedDate = formatDateToYYYYMMDD(e.value);
                      setSelectedStartDate(formattedDate);
                      setStartDateValid(formattedDate !== null);
                    }}
                    className={`rounded-lg border border-gray-300 ${
                      !startDateValid ? "border-red-600" : ""
                    }`}
                  />
                  <label
                    htmlFor="start_date"
                    className="text-gray-600 dark:text-gray-150"
                  >
                    From
                  </label>
                </span>
                {!startDateValid ? (
                  <small className="text-red-500">From date is required.</small>
                ) : (
                  <small className="text-gray-400 dark:text-gray-150">
                    Click to Select
                  </small>
                )}
              </div>
              <div className="flex-auto">
                <span className="p-float-label">
                  <Calendar
                    id="to_date"
                    inputId="end_date"
                    value={selectedEndDate ? new Date(selectedEndDate) : null}
                    onChange={(e) => {
                      const formattedDate = formatDateToYYYYMMDD(e.value);
                      setSelectedEndDate(formattedDate);
                      setEndDateValid(formattedDate !== null);
                    }}
                    className={`rounded-lg border border-gray-300 ${
                      !endDateValid ? "border-red-600" : ""
                    }`}
                  />
                  <label
                    htmlFor="start_date"
                    className="text-gray-600  dark:text-gray-150"
                  >
                    To
                  </label>
                </span>

                {!endDateValid ? (
                  <small className="text-red-500">To date is required.</small>
                ) : (
                  <small className="text-gray-400 dark:text-gray-150">
                    Click to Select
                  </small>
                )}
              </div>
              {/* <div className="flex-auto">
              <div className="mt-2 flex flex-wrap gap-5">
                <p className="text-gray-600">You want to generate report for</p>
                <div className="align-items-center flex">
                  <RadioButton
                    inputId="vehicle"
                    name="vehicle"
                    value="Vehicle"
                    onChange={() => setSelectedOption("Vehicle")}
                    checked={selectedOption === "Vehicle"}
                  />
                  <label htmlFor="vehicle" className="ml-2">
                    Vehicle
                  </label>
                </div>
                <div className="align-items-center flex">
                  <RadioButton
                    inputId="driver"
                    name="driver"
                    value="Driver"
                    onChange={() => setSelectedOption("Driver")}
                    checked={selectedOption === "Driver"}
                  />
                  <label htmlFor="driver" className="ml-2">
                    Driver
                  </label>
                </div>
              </div>
            </div> */}
              {/* {selectedOption === "Vehicle" && ( */}
            </div>
            <div>
              <div className="mt-8 flex-auto">
                <span className="p-float-label">
                  <MultiSelect
                    id='select_vehicle'
                    value={selectedVehicleNames}
                    options={vehicleOptions()}
                    onChange={(e) => {
                      setSelectedVehicleNames(e.value);
                      setSelectedVehicles(
                        e.target.value.map((vehicle) => vehicle.code)
                      );

                      setVehicleValid(e.target.value.length > 0);
                    }}
                    optionLabel="name"
                    className={`rounded-lg border border-gray-300  shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                      !vehicleValid ? "border-red-600" : ""
                    }`}
                  />

                  <label
                    htmlFor="vehicle"
                    className="text-gray-600 dark:text-gray-150"
                  >
                    Select Vehicles
                  </label>
                </span>
                {!vehicleValid && (
                  <small className="text-red-500">Vehicle is required.</small>
                )}
                {/* <span className="p-float-label mt-8">
                <MultiSelect
                  value={vehicleParams}
                  options={vehicleparams}
                  onChange={(e) => setVehicleParams(e.value)}
                  optionLabel="name"
                  optionValue="value"
                  className="rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50"
                />
                <label
                  htmlFor="vehicle"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Select Parameters
                </label>
              </span> */}
              </div>
              <div className="mt-8">
                <span className="p-float-label">
                  <MultiSelect
                    id='select-event'
                    value={selectedEventNames}
                    options={events}
                    onChange={(e) => {
                      setSelectedEventNames(e.value);
                      setSelectedEvents(
                        e.target.value.map((event) => event.code)
                      );
                      setEventValid(e.target.value);
                    }}
                    optionLabel="name"
                    className={`rounded-lg border border-gray-300 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                      !eventValid ? "border-red-600" : ""
                    }`}
                  />
                  <label
                    htmlFor="vehicle"
                    className="text-gray-600 dark:text-gray-150"
                  >
                    Select Events
                  </label>
                </span>
                {!eventValid && (
                  <small className="text-red-500">Event is required.</small>
                )}
                {/* <span className="p-float-label mt-8">
                <MultiSelect
                  value={driverParams}
                  options={driverparams}
                  onChange={(e) => setDriverParams(e.value)}
                  optionLabel="name"
                  optionValue="id"
                  className="rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50"
                />
                <label
                  htmlFor="vehicle"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Select Parameters
                </label>
              </span> */}
              </div>
              <div className="mt-8">
                <span className="p-float-label">
                  <Dropdown
                    id="select_contacts"
                    value={selectedContacts}
                    options={contactOptions()}
                    onChange={(e) => {
                      setSelectedContacts(e.target.value);
                      setContactValid(e.target.value);
                    }}
                    optionLabel="label"
                    optionValue="code"
                    className={`rounded-lg  border border-gray-300 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                      !contactValid ? "border-red-600" : ""
                    }`}
                  />
                  <label
                    htmlFor="vehicle"
                    className="text-gray-600 dark:text-gray-150"
                  >
                    Select Recipients
                  </label>
                </span>
                {!contactValid && (
                  <small className="text-red-500">Recipient is required.</small>
                )}
              </div>
              {/* <div className="mt-3 w-[42vw]">
              <p className="text-gray-600">Select Recipient</p>
              <span className="p-float-label mt-6">
                <InputText name="name" />
                <label
                  htmlFor="name"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Name of Recipient
                </label>
              </span>
            </div> */}
              {/* <div className="align-items-center mt-6 flex">
              <RadioButton
                inputId="mobile"
                name="mobile"
                value="Mobile"
                onChange={() => setRecipient("Mobile")}
                checked={recipient === "Mobile"}
              />
              <label htmlFor="ingredient1" className="ml-2">
                Mobile
              </label>
            </div> */}
              {/* {recipient === "Mobile" && (
              <div className="mt-3">
                <InputText name="name" placeholder="Enter mobile no." />
              </div>
            )} */}
              {/* <div className="align-items-center mt-6 flex">
              <RadioButton
                inputId="email"
                name="email"
                value="Email"
                onChange={() => setRecipient("Email")}
                checked={recipient === "Email"}
              />
              <label htmlFor="ingredient2" className="ml-2">
                Email
              </label>
            </div> */}
              {/* {recipient === "Email" && (
              <div className="mt-3">
                <InputText
                  name="name"
                  keyfilter="email"
                  placeholder="Enter email ID"
                />
              </div>
            )} */}
            </div>
          </div>
          <div className="text-center">
            <button
              id='generate_report_btn'
              type="submit"
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Generate;
