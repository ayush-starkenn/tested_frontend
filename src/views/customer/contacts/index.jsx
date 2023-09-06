import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ContactsList from "./components/ContactsList";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const Contacts = () => {
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [isDialog, setIsDialog] = useState(false);
  const [addData, setAddData] = useState({});
  const [contactsData, setContactsData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [refresh, setRefresh] = useState(false);
  const toastRef = useRef(null);

  const validateForm = () => {
    let errors = {};

    if (!addData.contact_first_name) {
      errors.contact_first_name = "First name is required";
    }
    if (!addData.contact_last_name) {
      errors.contact_last_name = "Last name is required";
    }

    if (!addData.contact_email) {
      errors.contact_email = "Email is required";
    }

    if (!addData.contact_mobile) {
      errors.contact_mobile = "Mobile number is required";
    }

    return errors;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/contacts/getContacts-all/${user_uuid}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        const formatedData = res.data.contacts.map((item, ind) => ({
          ...item,
          serialNo: ind + 1,
        }));
        setContactsData(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const openDialog = (rowData) => {
    setIsDialog(true);
  };

  const closeDialog = () => {
    setIsDialog(false);
    setFormErrors({});
  };

  //onChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddData({ ...addData, [name]: value });
  };

  //handleSubmit

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post(
          `http://localhost:8080/api/contacts/savecontact/${user_uuid}`,
          addData,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          setRefresh(!refresh);
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: "Contact added successfully!",
            life: 3000,
          });
          closeDialog();
        })
        .catch((err) => {
          if (err.response.request.status == 400) {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail:
                "Contact already exists with the provided email or mobile",
              life: 3000,
            });
          } else {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to edit contact. Please try again.",
              life: 3000,
            });
          }
        });
    } else {
      toastRef.current.show({
        severity: "warn",
        summary: "Incomplete form",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
    }
  };

  //edit contacts api
  const editContacts = (contact_uuid, editData) => {
    axios
      .put(
        `http://localhost:8080/api/contacts/editcontact/${contact_uuid}`,
        editData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setRefresh(!refresh);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Contact Edited successfully!",
          life: 3000,
        });
      })
      .catch((err) => {
        if (err.response.request.status == 400) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Contact already exists with the provided email or mobile",
            life: 3000,
          });
        } else {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to edit contact. Please try again.",
            life: 3000,
          });
        }
      });
  };

  const deleteContact = (contact_uuid) => {
    axios
      .put(
        `http://localhost:8080/api/contacts/deletecontact/${contact_uuid}`,
        { user_uuid },
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Contact added successfully!",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete contact. Please try again.",
          life: 3000,
        });
      });
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className="flex-col justify-between">
        <div>
          <Button
            label="New Contacts"
            icon="pi pi-plus"
            severity="primary"
            className="mt-2 h-10 px-3 py-0 text-left dark:hover:text-white"
            onClick={openDialog}
          />
        </div>
        {/* dialog to add contact */}
        <Dialog
          visible={isDialog}
          onHide={closeDialog}
          style={{ width: "40rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Fill the details"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit}>
            <div className="mx-auto mt-1 w-[34.5vw]">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_first_name"
                  name="contact_first_name"
                  onChange={handleChange}
                  className={`${
                    formErrors.contact_first_name ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="contact_first_name">First Name</label>
              </span>
              {formErrors.contact_first_name && (
                <small className="p-error">
                  {formErrors.contact_first_name}
                </small>
              )}
            </div>
            <div className="mx-auto mt-6 w-[34.5vw]">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_last_name"
                  name="contact_last_name"
                  onChange={handleChange}
                  className={`${
                    formErrors.contact_last_name ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="contact_last_name">Last Name</label>
              </span>
              {formErrors.contact_last_name && (
                <small className="p-error">
                  {formErrors.contact_last_name}
                </small>
              )}
            </div>
            <div className="mx-auto mt-6 w-[34.5vw]">
              <span className={`p-float-label`}>
                <InputText
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  onChange={handleChange}
                  className={`${formErrors.contact_email ? "p-invalid" : ""}`}
                />
                <label htmlFor="contact_email">Email</label>
              </span>
              {formErrors.contact_email && (
                <small className="p-error">{formErrors.contact_email}</small>
              )}
            </div>
            <div className="mx-auto mt-6 w-[34.5vw]">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_mobile"
                  name="contact_mobile"
                  type="number"
                  onChange={handleChange}
                  className={`${formErrors.contact_mobile ? "p-invalid" : ""}`}
                />
                <label htmlFor="contact_mobile">Mobile Number</label>
              </span>
              {formErrors.contact_mobile && (
                <small className="p-error">{formErrors.contact_mobile}</small>
              )}
            </div>
            <div className="p-field p-col-12 flex justify-center">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Add Contact
              </button>
            </div>
          </form>
        </Dialog>
        <div>
          <ContactsList
            contactsData={contactsData}
            editContacts={editContacts}
            deleteContact={deleteContact}
          />
        </div>
      </div>
    </>
  );
};

export default Contacts;
