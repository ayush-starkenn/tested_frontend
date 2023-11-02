import React, { useState, useEffect, useRef } from "react";
import CustomersList from "./components/CustomersList";
import { Toast } from "primereact/toast";
import CustomersGrid from "./components/CustomersGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import Cookies from "js-cookie";
import { FiPlus } from "react-icons/fi";

const Customers = () => {
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([]);
  const [cust, setCust] = useState(true);
  const [userType, setUserType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastRef = useRef(null);
  const toastErr = useRef(null);

  const [formErrors, setFormErrors] = useState({
    f_name: false,
    l_name: false,
    email: false,
    password: false,
    confirmPassword: false,
    user_type: false,
    phone: false,
    company_name: false,
    address: false,
    city: false,
    state: false,
    pincode: false,
  });

  const handleChange = (event) => {
    setUserType(event.value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      user_type: null,
    }));
  };

  //User Type options
  const options = [
    { label: "Customer", value: 2 },
    { label: "Admin", value: 1 },
  ];

  // Fetching all data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/get-all-customer`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        const formattedData = res.data.customerData.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          full_name: item.first_name + " " + item.last_name,
          full_address: `${item.address || ""} ${item.city || ""} ${
            item.state || ""
          } ${item.pincode || ""}`,
          company_name: item.company_name,
          contact_no: item.phone,
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, cust]);

  // Delete api call
  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/customers/delete-customer/${customerId}`,
        { userUUID: userUUID },
        { headers: { authorization: `bearer ${token}` } }
      );

      // Remove the deleted customer from the state
      setData((prevData) =>
        prevData.filter((customer) => customer.user_uuid !== customerId)
      );
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Edit api call
  const handleUpdateCustomer = async (customerId, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/customers/update-customer/${customerId}`,
        { ...updatedData, userUUID: userUUID },
        { headers: { authorization: `bearer ${token}` } }
      );
      // Update the customer data in the state
      if (response.status === 201) {
        setData((prevData) =>
          prevData.map((customer) =>
            customer.user_uuid === customerId
              ? { ...customer, ...updatedData }
              : customer
          )
        );
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `User  ${updatedData?.first_name} updated successfully`,
          life: 3000,
        });
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          toastRef.current.show({
            severity: "warn",
            summary: "Unauthorized",
            detail: "Please authenticate.",
            life: 3000,
          });
        } else {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: `${error.response.data.message}`,
            life: 3000,
          });
        }
      }
    }
  };

  const handleToggleView = () => {
    const newView = !isListView;
    setIsListView(newView);
    // Store the view preference in localStorage
    localStorage.setItem("viewPreference", newView ? "list" : "grid");
  };

  //open add customer dialog
  const openDialog = () => {
    setIsDialogVisible(true);
    setUserType(null);
  };

  //close add customer dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
    setFormErrors(false);
    setIsSubmitting(false);
    setUserType(null);
  };

  // Add Customer api call
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.target;
    const formData = new FormData(form);

    const data = {
      first_name: formData.get("f_name"),
      last_name: formData.get("l_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company_name: formData.get("company_name"),
      address: formData.get("address"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      user_type: formData.get("user_type"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      user_status: formData.get("user_status"),
    };

    const isValidPhoneNumber = (phoneNumber) => {
      // Regular expression to check for exactly 10 digits
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phoneNumber);
    };
    setFormErrors({
      f_name: data.first_name === "",
      l_name: data.last_name === "",
      email: data.email === "",
      phone: data.phone === "" || !isValidPhoneNumber(data.phone),
      company_name: data.company_name === "",
      user_type: data.user_type === "",
      password: data.password === "",
      confirmPassword:
        data.password !== data.confirmPassword || data.password === "",
      address: data.address === "",
      city: data.city === "",
      state: data.state === "",
      pincode: data.pincode === "",
    });

    const requiredFields = [
      "f_name",
      "l_name",
      "email",
      "password",
      "confirmPassword",
      "user_type",
      "phone",
      "company_name",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const isAnyFieldEmpty = requiredFields.some(
      (fieldName) => data[fieldName] === ""
    );

    if (isAnyFieldEmpty) {
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
      setIsSubmitting(false);
      return;
    }
    // Validate the phone number
    if (!isValidPhoneNumber(data.phone)) {
      toastRef.current.show({
        severity: "warn",
        summary: "Invalid Phone Number",
        detail: "Please enter a 10-digit valid phone number.",
        life: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toastRef.current.show({
        severity: "warn",
        summary: "Password Mismatch",
        detail: "Password and Confirm Password do not match.",
        life: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        { ...data, userUUID },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setIsDialogVisible(false);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `User ${
            data.first_name + " " + data.last_name
          } Added successfully`,
          life: 3000,
        });
        setCust(data);
      } else {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: `${response.data.message}`,
          life: 3000,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          toastRef.current.show({
            severity: "warn",
            summary: "Unauthorized",
            detail: "Please authenticate.",
            life: 3000,
          });
        } else if (status === 400) {
          const { message } = data;
          toastRef.current.show({
            severity: "error",
            summary: "Validation Error",
            detail: message,
            life: 3000,
          });
          setIsSubmitting(false);
        } else if (status === 402) {
          toastRef.current.show({
            severity: "error",
            summary: "Password Mismatch",
            detail: "Passwords do not match.",
            life: 3000,
          });
          setIsSubmitting(false);
        } else {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: `${error.response.data.message}`,
            life: 3000,
          });
          setIsDialogVisible(true);
          setIsSubmitting(false);
        }
      }
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} className="bg-red-400" />
      <div className="flex justify-between">
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Customers
        </h4>

        <div className="pt-3">
          <button
            className={`${
              isListView === true
                ? "list-btn bg-gray-150 px-3 py-2 dark:bg-gray-700"
                : "list-btn bg-white px-3 py-2 dark:bg-gray-150"
            }`}
            onClick={handleToggleView}
          >
            <BsListUl />
          </button>
          <button
            className={`${
              isListView === false
                ? "grid-btn bg-gray-150 px-3 py-2 dark:bg-gray-700"
                : "grid-btn bg-white px-3 py-2 dark:bg-gray-150"
            }`}
            onClick={handleToggleView}
          >
            <BsGrid />
          </button>
        </div>
      </div>
      <button
        className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
        onClick={openDialog}
      >
        <FiPlus className="mr-2" />
        New Customer
      </button>
      {!isListView && (
        <CustomersGrid
          data={data}
          onDelete={handleDeleteCustomer}
          onUpdate={handleUpdateCustomer}
        />
      )}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <CustomersList
            data={data}
            onDelete={handleDeleteCustomer}
            onUpdate={handleUpdateCustomer}
          />
        </div>
      )}

      {/* Add customer form */}
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="flex justify-evenly">
            <div className="card justify-content-center mr-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="f_name"
                  name="f_name"
                  keyfilter="alpha"
                  className={`border py-2 pl-2 
                    ${
                      formErrors.f_name
                        ? "border-red-600"
                        : (data.f_name = "" ? "p-filled" : "")
                    }
                  `}
                  onChange={(e) =>
                    setFormErrors({ ...formErrors, [e.target.name]: false })
                  }
                  autoComplete="off"
                />
                <label htmlFor="f_name" className="dark:text-gray-300">
                  First Name
                </label>
              </span>
            </div>
            <div className="card justify-content-center ml-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="l_name"
                  name="l_name"
                  keyfilter="alpha"
                  className={`border py-2 pl-2 ${
                    formErrors.l_name
                      ? "border-red-600"
                      : (data.l_name = "" ? "p-filled" : "")
                  }`}
                  onChange={(e) =>
                    setFormErrors({ ...formErrors, [e.target.name]: false })
                  }
                  autoComplete="off"
                />
                <label htmlFor="l_name" className="dark:text-gray-300">
                  Last Name
                </label>
              </span>
            </div>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="email"
                keyfilter="email"
                name="email"
                className={`border py-2 pl-2 ${
                  formErrors.email
                    ? "border-red-600"
                    : (data.email = "" ? "p-filled" : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="email" className="dark:text-gray-300">
                Email
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className={`border py-2 pl-2 ${
                  formErrors.password
                    ? "border-red-600"
                    : data.password !== ""
                    ? ""
                    : "p-filled"
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                minLength={6}
                autoComplete="off"
              />
              <label htmlFor="password" className="dark:text-gray-300">
                Password
              </label>
              <div className="absolute right-2.5 top-[0.7rem]">
                {showPassword ? (
                  <FaEyeSlash
                    className="h-5 w-5 cursor-pointer text-gray-500"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="h-5 w-5 cursor-pointer text-gray-600"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className={`border py-2 pl-2 ${
                  formErrors.confirmPassword
                    ? "border-red-600"
                    : (data.confirmPassword = ""
                        ? "p-filled border-red-600"
                        : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="confirmPassword" className="dark:text-gray-300">
                Confirm Password
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span
              className={`p-float-label ${
                formErrors.user_type ? "border-red-600" : ""
              }`}
            >
              <Dropdown
                id="user_type"
                name="user_type"
                options={options}
                value={userType}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                className={`border ${
                  formErrors.user_type ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="user_type" className="dark:text-gray-300">
                User Type
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="company_name"
                type="text"
                name="company_name"
                className={`border py-2 pl-2 ${
                  formErrors.company_name
                    ? "border-red-600"
                    : (data.company_name = "" ? "p-filled" : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="company_name" className="dark:text-gray-300">
                Company Name
              </label>
            </span>
          </div>
          <div className="mx-auto mb-3 mt-8">
            <span className="p-float-label">
              <InputText
                id="phone"
                type="tel"
                keyfilter="pint"
                name="phone"
                className={`border py-2 pl-2 ${
                  formErrors.phone
                    ? "border-red-600"
                    : (data.phone = "" ? "p-filled" : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="phone" className="dark:text-gray-300">
                Contact Number
              </label>
            </span>
          </div>
          <div className="mx-auto my-6">
            <span>Address:</span>
          </div>
          <div className="mx-auto mt-2">
            <span className="p-float-label">
              <InputText
                id="address"
                type="text"
                name="address"
                className={`border py-2 pl-2 ${
                  formErrors.address
                    ? "border-red-600"
                    : (data.address = "" ? "p-filled" : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="address" className="dark:text-gray-300">
                Flat No./ Plot No., Area/Society
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="city"
                type="text"
                name="city"
                className={`border py-2 pl-2 ${
                  formErrors.city
                    ? "border-red-600"
                    : (data.city = "" ? "p-filled" : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="city" className="dark:text-gray-300">
                City
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="state"
                type="text"
                name="state"
                className={`border py-2 pl-2 ${
                  formErrors.state
                    ? "border-red-600"
                    : (data.state = "" ? "p-filled" : "")
                }`}
                onChange={(e) =>
                  setFormErrors({ ...formErrors, [e.target.name]: false })
                }
                autoComplete="off"
              />
              <label htmlFor="state" className="dark:text-gray-300">
                State
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="pincode"
                type="text"
                name="pincode"
                keyfilter="pint"
                className={`border py-2 pl-2 ${
                  formErrors.pincode
                    ? "border-red-600"
                    : (data.pincode = "" ? "p-filled" : "")
                }`}
                onChange={(e) => {
                  const value = e.target.value;
                  const formattedValue = value.replace(/\D/g, "").slice(0, 6); // Remove non-digits and limit to 6 characters
                  e.target.value = formattedValue;
                  setFormErrors({ ...formErrors, [e.target.name]: false });
                }}
                autoComplete="off"
              />
              <label htmlFor="pincode" className="dark:text-gray-300">
                Pincode (Format: xxxxxx)
              </label>
            </span>
          </div>

          <div className="my-4">
            <input
              type="radio"
              className="inlinemx-2 mx-2"
              name="user_status"
              id="userActive"
              value={1}
              defaultChecked={true}
            />
            <label htmlFor="userActive">Active</label>
            <input
              type="radio"
              className="mx-2 inline"
              name="user_status"
              id="userDeactive"
              value={2}
            />
            <label htmlFor="userDeactive">Deactive</label>
          </div>

          <div className="mt-6 flex justify-center">
            {isSubmitting ? (
              <div className="flex items-center">
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
                Submitting...
              </div>
            ) : (
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Add Customer
              </button>
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Customers;
