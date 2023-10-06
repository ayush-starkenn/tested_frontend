import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import AlertTriggerList from "./components/AlertTriggerList";
import { Toast } from "primereact/toast";
import { FiPlus } from "react-icons/fi";

const Triggers = () => {
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [visible, setVisible] = useState(false);
  const [vehiData, setVehiData] = useState([]);
  const [contactsData, setContactsData] = useState([]);
  const [triggersData, setTriggersData] = useState([]);
  const [addData, setAddData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [refresh, setRefresh] = useState(false);
  const toastRef = useRef(null);

  const validateForm = () => {
    let errors = {};

    if (!addData.trigger_type) {
      errors.trigger_type = "Trigger type is required";
    }

    if (!addData.trigger_name) {
      errors.trigger_name = "Trigger name is required";
    }

    if (!addData.trigger_description) {
      errors.trigger_description = "Trigger description is required";
    }

    if (!addData.vehicle_uuid) {
      errors.vehicle_uuid = "Vehicle Name is required";
    }

    if (!addData.recipients) {
      errors.recipients = "Recipients is required";
    }

    return errors;
  };

  const openDialog = () => {
    setVisible(true);
  };
  const closeDialog = () => {
    setVisible(false);
    setFormErrors({});
    setAddData({});
  };

  //get vehicles list
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/vehicles/get-user-vehiclelist/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setVehiData(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  //get contacts list
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/contacts/getContacts-all/${user_uuid}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setContactsData(res.data.contacts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  //get list of triggers

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/alert-triggers/getall-alert-trigger/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        const formatedData = res.data.alerts.map((item, ind) => ({
          ...item,
          serialNo: ind + 1,
        }));

        setTriggersData(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid, refresh]);

  //onChange Function

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setAddData({ ...addData, [name]: value });
  };

  //onSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post(
          `http://localhost:8080/api/alert-triggers/save-alert-trigger/${user_uuid}`,
          addData,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: "Trigger added successfully!",
            life: 3000,
          });
          closeDialog();
          setRefresh(!refresh);
        })
        .catch((err) => {
          console.log(err);
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add trigger. Please try again.",
            life: 3000,
          });
        });
    }
  };

  //edit function
  const editTrigger = (trigger_id, editData) => {
    axios
      .put(
        `http://localhost:8080/api/alert-triggers/update-alert-trigger/${trigger_id}`,
        editData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Trigger updated successfully!",
          life: 3000,
        });
        setRefresh(!refresh);
      })
      .catch((err) => {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to edit trigger. Please try again.",
          life: 3000,
        });
      });
  };

  //delete Function
  const deleteTrigger = (trigger_id, token) => {
    axios
      .put(
        `http://localhost:8080/api/alert-triggers/delete-alert-trigger/${trigger_id}`,
        {},
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Trigger deleted successfully!",
          life: 3000,
        });
        setRefresh(!refresh);
      })
      .catch((err) => {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to edit trigger. Please try again.",
          life: 3000,
        });
      });
  };

  //options
  const triggerOptions = [
    {
      label: "Limp Mode Trigger",
      value: "Limp Mode Trigger",
    },
    {
      label: "Accident Trigger",
      value: "Accident Trigger",
    },
    {
      label: "Sleep Alert Trigger",
      value: "Sleep Alert Trigger",
    },
  ];

  const vehiclesOptions = () => {
    return vehiData?.map((el) => ({
      label: el.vehicle_name,
      value: el.vehicle_uuid,
    }));
  };

  const contactsOptions = () => {
    return contactsData?.map((el) => ({
      label: el.contact_first_name + " " + el.contact_last_name,
      value: el.contact_uuid,
    }));
  };

  useEffect(() => {
    console.log(contactsData);
  }, [contactsData]);

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div>
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Alert Triggers
        </h4>
        {/* button to add vehicle */}
        <button
          className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
          onClick={openDialog}
        >
          <FiPlus className="mr-2" /> {/* Use the React Icons component */}
          New Alert Trigger
        </button>
        {/* dialog for adding vehicle */}
        <Dialog
          visible={visible}
          onHide={closeDialog}
          style={{ width: "40rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Fill the details"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit} className="flex flex-wrap">
            <div className="mx-auto mt-5 w-[34.5vw]">
              <span className="p-float-label">
                <Dropdown
                  id="trigger_type"
                  name="trigger_type"
                  optionLabel="label"
                  optionValue="value"
                  options={triggerOptions}
                  onChange={handleChange}
                  className={`border ${
                    formErrors.trigger_type ? "border-red-600" : ""
                  }`}
                  value={addData.trigger_type}
                />
                <label htmlFor="trigger_type">Trigger Type</label>
              </span>
              {formErrors.trigger_type && (
                <small className="p-error">{formErrors.trigger_type}</small>
              )}
            </div>
            <div className="mx-auto mt-8 w-[34.5vw]">
              <span className={"p-float-label"}>
                <InputText
                  id="trigger_name"
                  name="trigger_name"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    formErrors.trigger_name ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="trigger_name">Trigger Name</label>
              </span>
              {formErrors.trigger_name && (
                <small className="p-error">{formErrors.trigger_name}</small>
              )}
            </div>
            <div className="mx-auto mt-8 w-[34.5vw]">
              <span className={"p-float-label"}>
                <Dropdown
                  id="vehicle_uuid"
                  name="vehicle_uuid"
                  optionLabel="label"
                  optionValue="value"
                  options={vehiclesOptions()}
                  onChange={handleChange}
                  className={`border ${
                    formErrors.vehicle_uuid ? "border-red-600" : ""
                  }`}
                  value={addData.vehicle_uuid}
                />
                <label htmlFor="vehicle_uuid">Select Vehicle</label>
              </span>
              {formErrors.vehicle_uuid && (
                <small className="p-error">{formErrors.vehicle_uuid}</small>
              )}
            </div>
            <div className="mx-auto mt-8 w-[34.5vw]">
              <span className={"p-float-label"}>
                <InputText
                  id="trigger_description"
                  name="trigger_description"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    formErrors.trigger_description ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="trigger_description">Trigger Description</label>
              </span>
              {formErrors.trigger_description && (
                <small className="p-error">
                  {formErrors.trigger_description}
                </small>
              )}
            </div>
            <div className="mx-auto mt-8 w-[34.5vw]">
              <span className={"p-float-label"}>
                <Dropdown
                  id="recipients"
                  name="recipients"
                  optionLabel="label"
                  optionValue="value"
                  options={contactsOptions()}
                  onChange={handleChange}
                  className={`border ${
                    formErrors.recipients ? "border-red-600" : ""
                  }`}
                  value={addData.recipients}
                />
                <label htmlFor="recipients">Select Contact</label>
              </span>
              {formErrors.recipients && (
                <small className="p-error">{formErrors.recipients}</small>
              )}
            </div>

            <div className="p-field p-col-12 mt-3 flex justify-center">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Add Trigger
              </button>
            </div>
          </form>
        </Dialog>
        <div>
          <AlertTriggerList
            data={triggersData}
            editTrigger={editTrigger}
            deleteTrigger={deleteTrigger}
            contactsData={contactsData}
            vehiData={vehiData}
          />
        </div>
      </div>
    </>
  );
};

export default Triggers;
