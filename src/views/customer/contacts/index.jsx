import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ContactsList from "./components/ContactsList";
import { Toast } from "primereact/toast";
import { FiPlus } from "react-icons/fi";

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
      .get(
        `${process.env.REACT_APP_API_URL}/contacts/getContacts-all/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        const formatedData = res.data.contacts.map((item, ind) => ({
          ...item,
          serialNo: ind + 1,
          full_name: item.contact_first_name + " " + item.contact_last_name,
        }));
        setContactsData(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token, user_uuid]);

  const openDialog = () => {
    setIsDialog(true);
  };

  const closeDialog = () => {
    setIsDialog(false);
    setFormErrors({});
  };

  //onChange function
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormErrors = { ...formErrors };
    updatedFormErrors[name] = undefined;

    setFormErrors(updatedFormErrors);
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
          `${process.env.REACT_APP_API_URL}/contacts/savecontact/${user_uuid}`,
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
          if (err.response.request.status === 400) {
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
        `${process.env.REACT_APP_API_URL}/contacts/editcontact/${contact_uuid}`,
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
        if (err.response.request.status === 400) {
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
        `${process.env.REACT_APP_API_URL}/contacts/deletecontact/${contact_uuid}`,
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
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Contacts
        </h4>
        <div>
          <button
            className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
            onClick={openDialog}
          >
            <FiPlus className="mr-2" /> {/* Use the React Icons component */}
            New Contact
          </button>
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
          <form onSubmit={handleSubmit} className="dark:text-gray-900">
            <div className="mx-auto mt-8 ">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_first_name"
                  name="contact_first_name"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    formErrors.contact_first_name ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="contact_first_name" className="dark:text-gray-300">First Name</label>
              </span>
              {formErrors.contact_first_name && (
                <small className="text-red-600">
                  {formErrors.contact_first_name}
                </small>
              )}
            </div>
            <div className="mx-auto mt-7 ">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_last_name"
                  name="contact_last_name"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    formErrors.contact_last_name ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="contact_last_name" className="dark:text-gray-300">Last Name</label>
              </span>
              {formErrors.contact_last_name && (
                <small className="text-red-600">
                  {formErrors.contact_last_name}
                </small>
              )}
            </div>
            <div className="mx-auto mt-7 ">
              <span className={`p-float-label`}>
                <InputText
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    formErrors.contact_email ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="contact_email" className="dark:text-gray-300">Email</label>
              </span>
              {formErrors.contact_email && (
                <small className="text-red-600">
                  {formErrors.contact_email}
                </small>
              )}
            </div>
            <div className="mx-auto mt-7 ">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_mobile"
                  name="contact_mobile"
                  keyfilter="pint"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    formErrors.contact_mobile ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="contact_mobile" className="dark:text-gray-300">Mobile Number</label>
              </span>
              {formErrors.contact_mobile && (
                <small className="text-red-600">
                  {formErrors.contact_mobile}
                </small>
              )}
            </div>
            <div className="p-field p-col-12 my-2 flex justify-center">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Add Contact
              </button>
            </div>
          </form>
        </Dialog>
        <div className="mt-[-4px]">
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
