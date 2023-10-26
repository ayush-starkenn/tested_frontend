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
  const [addData, setAddData] = useState({ recipients: [] });
  const [formErrors, setFormErrors] = useState({});
  const [selectedContacts, setSelectedContacts] = useState([]);
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

    if (!addData.recipients == 0) {
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
    setAddData({ recipients: [] });
    setSelectedContacts([]);
  };

  //get vehicles list
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/vehicles/get-user-vehiclelist/${user_uuid}`,
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
      .get(
        `${process.env.REACT_APP_API_URL}/contacts/getContacts-all/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        const updatedContacts = res.data.contacts.map((contact) => ({
          ...contact,
          hasEmail: contact.contact_email !== null,
          hasMobile: contact.contact_mobile !== null,
        }));
        setContactsData(updatedContacts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  //get list of triggers

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/alert-triggers/getall-alert-trigger/${user_uuid}`,
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
          `${process.env.REACT_APP_API_URL}/alert-triggers/save-alert-trigger/${user_uuid}`,
          { ...addData, selectedContacts },
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
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
        `${process.env.REACT_APP_API_URL}/alert-triggers/update-alert-trigger/${trigger_id}`,
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
        console.log(err, "sapna");
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
        `${process.env.REACT_APP_API_URL}/alert-triggers/delete-alert-trigger/${trigger_id}`,
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

  const handleContactChange = (contactId, type) => {
    setSelectedContacts((prevSelectedContacts) => {
      // Find the existing contact object for the recipient
      const updatedContacts = [...prevSelectedContacts];
      const existingContact = updatedContacts.find(
        (contact) => contact.recipients === contactId
      );

      if (existingContact) {
        // Update the specific type (email or mobile)
        if (type === "email") {
          existingContact.email = existingContact.email
            ? ""
            : contactsData.find((c) => c.contact_uuid === contactId)
                .contact_email;
        } else if (type === "mobile") {
          existingContact.mobile = existingContact.mobile
            ? ""
            : contactsData.find((c) => c.contact_uuid === contactId)
                .contact_mobile;
        }

        // If both email and mobile are empty, remove the contact
        if (!existingContact.email && !existingContact.mobile) {
          return updatedContacts.filter(
            (contact) => contact.recipients !== contactId
          );
        }
        return updatedContacts;
      } else {
        // If the contact does not exist in selectedContacts, add it
        const newContact = { recipients: contactId };

        if (type === "email") {
          newContact.email = contactsData.find(
            (c) => c.contact_uuid === contactId
          ).contact_email;
        } else if (type === "mobile") {
          newContact.mobile = contactsData.find(
            (c) => c.contact_uuid === contactId
          ).contact_mobile;
        }

        updatedContacts.push(newContact);
        return updatedContacts;
      }
    });
  };

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
                <label htmlFor="trigger_type" className="dark:text-gray-300">
                  Trigger Type
                </label>
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
                <label htmlFor="trigger_name" className="dark:text-gray-300">
                  Trigger Name
                </label>
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
                <label htmlFor="vehicle_uuid" className="dark:text-gray-300">
                  Select Vehicle
                </label>
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
                <label
                  htmlFor="trigger_description"
                  className="dark:text-gray-300"
                >
                  Trigger Description
                </label>
              </span>
              {formErrors.trigger_description && (
                <small className="p-error">
                  {formErrors.trigger_description}
                </small>
              )}
            </div>
            <div className="mx-auto mt-6 w-[34.5vw]">
              <p className="mb-2 pl-2">Select Contacts</p>
              {formErrors.recipients && (
                <small className="p-error">{formErrors.recipients}</small>
              )}
              <div
                className="table-container rounded"
                style={{ maxHeight: "70%" }}
              >
                <table className="table w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border py-1 text-[0.95rem] font-semibold">
                        Contact Name
                      </th>
                      <th className="border py-1 text-[0.95rem] font-semibold">
                        Email
                      </th>
                      <th className="border py-1 text-[0.95rem] font-semibold">
                        Mobile
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsData.map((contact) => (
                      <tr key={contact.contact_id}>
                        <td className="border px-4 py-2 text-sm">
                          {contact.contact_first_name +
                            " " +
                            contact.contact_last_name}
                        </td>
                        <td className="whitespace-nowrap border px-4 py-2 text-sm ">
                          {contact.contact_email && (
                            <>
                              <label>
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleContactChange(
                                      contact.contact_uuid,
                                      "email"
                                    )
                                  }
                                />
                                &nbsp;{contact.contact_email}
                              </label>
                            </>
                          )}
                        </td>
                        <td className="whitespace-nowrap border px-4 py-2 text-sm">
                          {contact.contact_mobile && (
                            <>
                              <label>
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleContactChange(
                                      contact.contact_uuid,
                                      "mobile"
                                    )
                                  }
                                />
                                &nbsp;{contact.contact_mobile}
                              </label>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
