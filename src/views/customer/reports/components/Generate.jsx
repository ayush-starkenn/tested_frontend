import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
// import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
// import { RadioButton } from "primereact/radiobutton";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Generate = ({ close }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState(null);
  // const [vehicleParams, setVehicleParams] = useState([]);
  // const [driverParams, setDriverParams] = useState([]);
  const [contacts, setContacts] = useState([]);

  // const vehicleparams = [
  //   { name: "CAS", value: "CAS" },
  //   { name: "DMS", value: "DMS" },
  //   // Add more vehicles as needed
  // ];

  const events = [
    { name: "ALM-2", code: "ALM-2" },
    { name: "Break Data", code: "BRK" },
    { name: "Accelarator Cut Data", code: "ACC" },
    { name: "Limp Mode Data", code: "LMP" },
    { name: "Accident Data", code: "ACD" },
    { name: "Accelarator Cut Data", code: "ACC" },
    { name: "ALM-3", code: "ALM-3" },
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
        console.log(res.data.results);
        setVehicles(res.data.results);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      fromDate: selectedStartDate,
      toDate: selectedEndDate,
      vehicle_uuid: selectedVehicles,
      event: selectedEvents,
      contact_uuid: selectedContacts,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/reports/getreports-all`,
        requestData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
        close();
        window.location.href = "/customer/report";
      })
      .catch((error) => {
        console.error(error);
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
      .get(`http://localhost:8080/api/contacts/getContacts-all/${user_uuid}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data.contacts);
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
    <div>
      <p className="text-right text-sm text-red-400">
        All Fields Are Required<span className="text-red-500">**</span>
      </p>
      <form>
        <div className="mb-6">
          <div className="card p-fluid mt-6 flex w-[42vw] flex-wrap gap-3">
            <div className="flex-auto">
              <span className="p-float-label">
                <Calendar
                  inputId="start_date"
                  value={selectedStartDate}
                  onChange={(e) =>
                    setSelectedStartDate(
                      e.value ? new Date(formatDateToYYYYMMDD(e.value)) : null
                    )
                  }
                  className="rounded border"
                />
                <label
                  htmlFor="start_date"
                  className="text-gray-700 dark:text-gray-150"
                >
                  From
                </label>
              </span>

              <small className="text-gray-400 dark:text-gray-150">
                Click to Select
              </small>
            </div>
            <div className="flex-auto">
              <span className="p-float-label">
                <Calendar
                  inputId="end_date"
                  value={selectedEndDate}
                  onChange={(e) =>
                    setSelectedEndDate(
                      e.value ? new Date(formatDateToYYYYMMDD(e.value)) : null
                    )
                  }
                  className="rounded border dark:bg-gray-900"
                />

                <label
                  htmlFor="start_date"
                  className="text-gray-700  dark:text-gray-150"
                >
                  To
                </label>
              </span>

              <small className="text-gray-400 dark:text-gray-150">
                Click to Select
              </small>
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
            <div className="mt-8 w-[42vw] flex-auto">
              <span className="p-float-label">
                <MultiSelect
                  value={selectedVehicles}
                  options={vehicleOptions()}
                  onChange={(e) => setSelectedVehicles(e.value)}
                  optionLabel="name"
                  className="rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50"
                />

                <label
                  htmlFor="vehicle"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Select Vehicles
                </label>
              </span>
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
            <div className="mt-8 w-[42vw]">
              <span className="p-float-label">
                <MultiSelect
                  value={selectedEvents}
                  options={events}
                  onChange={(e) => setSelectedEvents(e.value)}
                  optionLabel="name"
                  className="rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50"
                />
                <label
                  htmlFor="vehicle"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Select Events
                </label>
              </span>
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
            <div className="mt-8 w-[42vw]">
              <span className="p-float-label">
                <MultiSelect
                  value={selectedContacts}
                  options={contactOptions()}
                  onChange={(e) => setSelectedContacts(e.value)}
                  optionLabel="label"
                  display="chip"
                  className="rounded-lg  border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50"
                />
                <label
                  htmlFor="vehicle"
                  className="text-gray-150 dark:text-gray-150"
                >
                  Select Recipients
                </label>
              </span>
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
          <Link to="/customer/report">
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Generate
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Generate;
