import React, { useEffect, useRef, useState } from "react";
// import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
// import { RadioButton } from "primereact/radiobutton";
import axios from "axios";
import Cookies from "js-cookie";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const Schedule = ({ close }) => {
  const [vehicles, setVehicles] = useState([]);
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState(null);
  const [titleValid, setTitleValid] = useState(true);
  const [vehicleValid, setVehicleValid] = useState(true);
  const [eventValid, setEventValid] = useState(true);
  const [contactValid, setContactValid] = useState(true);
  const toastRef = useRef(null);
  const [selectedVehicleNames, setSelectedVehicleNames] = useState([]);
  const [selectedEventNames, setSelectedEventNames] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const repeat_types = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  const [repeatType, setRepeatType] = useState(null);
  const [repeatTypeValid, setRepeatTypeValid] = useState(true);
  const events = [
    { name: "Alarm", code: "ALM" },
    { name: "Break Data", code: "BRK" },
    { name: "Accelarator Cut Data", code: "ACC" },
    { name: "Limp Mode Data", code: "LMP" },
    { name: "Accident Data", code: "ACD" },
    { name: "Accelarator Cut Data", code: "ACC" },
    { name: "DMS", code: "DMS" },
  ];

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
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      setTitleValid(false);
    } else {
      setTitleValid(true);
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

    if (!repeatType || repeatType.length === 0) {
      setRepeatTypeValid(false);
    } else {
      setRepeatTypeValid(true);
    }

    // Check if any field is invalid
    if (
      !titleValid ||
      !vehicleValid ||
      !eventValid ||
      !contactValid ||
      !repeatTypeValid
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
      reports_schedule_type: repeatType,
      selected_vehicles: selectedVehicles,
      selected_events: selectedEvents,
      contact_uuid: selectedContacts,
    };
    console.log(requestData, "sapna");
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/schedule_reports/create_Reports_schedule/${user_uuid}`,

        requestData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data.report_uuid);
        console.log("res", res);
        setSubmitted(true);
        const url = `/customer/scheduled_report/${res.data.report_uuid}`;

        console.log("Generated URL:", url);
        setTimeout(() => {
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: "Report scheduled successfully",
            life: 1000,
          });
        }, 2000);
        setTimeout(() => {
          close();
        }, 3000);
      })
      .catch((error) => {
        console.log("err", error.response.data.message);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
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

            <div>
              <div className="mt-8 flex-auto">
                <span className="p-float-label">
                  <MultiSelect
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
              </div>
              <div className="mt-8">
                <span className="p-float-label">
                  <MultiSelect
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
              </div>
              <div className="mt-8">
                <span className="p-float-label">
                  <Dropdown
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
              <div className="mt-8">
                <span className="p-float-label">
                  <Dropdown
                    value={repeatType}
                    options={repeat_types}
                    optionLabel="label"
                    onChange={(e) => {
                      setRepeatType(e.target.value);
                      setRepeatTypeValid(e.target.value);
                    }}
                    placeholder="Select Repeat Type"
                    className={`rounded-lg border border-gray-300 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                      !repeatTypeValid && "border-red-600"
                    }`}
                  />
                  <label
                    htmlFor="repeat_type" // This should match the id of the Dropdown
                    className="text-gray-600 dark:text-gray-150"
                  >
                    Repeat Type
                  </label>
                </span>
                {!repeatTypeValid && (
                  <small className="text-red-500">
                    Repeat Type is required.
                  </small>
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            {submitted ? (
              <div className="mx-auto flex w-fit items-center rounded-lg bg-blue-700 px-4 py-1.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <span className="mr-2 animate-spin">
                  {/* You can use a suitable loading spinner here */}
                  <svg
                    className="h-5 w-5 animate-spin text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.84 3 7.95l3-2.658z"
                    ></path>
                  </svg>
                </span>
                Scheduling...
              </div>
            ) : (
              <button className="rounded-lg bg-blue-700 px-4 py-1.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Schedule
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Schedule;
