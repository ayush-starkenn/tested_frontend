import React, { useState, useEffect, useRef } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { BsArrowBarUp } from "react-icons/bs";
import logo from "../../assets/img/logo.png";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import Sidebar from "components/sidebar_admin";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { Toast } from "primereact/toast";
import { FaEdit, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FiCheck, FiLoader } from "react-icons/fi";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";

const Navbar = ({ onOpenSidenav }) => {
  const [darkmode, setDarkmode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModeColor, setEditModeColor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    phone: "",
    user_status: "",
  });
  const [pwerr, setPwerr] = useState(false);
  const navigate = useNavigate();
  const first_name = Cookies.get("first_name");
  const user_type = Cookies.get("user_type");
  const user_uuid = Cookies.get("user_uuid");
  const token = Cookies.get("token");
  const toastRef = useRef(null);
  const toastErr = useRef(null);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkmode");

    if (storedDarkMode === "true" || !storedDarkMode) {
      document.body.classList.add("dark");
      setDarkmode(true);
    } else {
      document.body.classList.remove("dark");
      setDarkmode(false);
    }
  }, []);

  useEffect(() => {
    if (dialogVisible) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/profile/get-profile/${user_uuid}`,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res.data.results[0]);
          const profileData = res.data.results[0];
          setFormData({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            company_name: profileData.company_name,
            address: profileData.address,
            state: profileData.state,
            city: profileData.city,
            pincode: profileData.pincode,
            phone: profileData.phone,
            // user_status: profileData.user_status,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dialogVisible, user_uuid, token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpenSidenav = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
      onOpenSidenav();
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_type");
    Cookies.remove("user_uuid");
    Cookies.remove("first_name");
    navigate("/signin");
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const toggleResetPasswordDialog = () => {
    setResetPasswordData("");
    setShowPassword(false);
    setPwerr(false);
    setResetPasswordVisible(!resetPasswordVisible);
  };
  const handleResetPasswordInputChange = (fieldName, value) => {
    setResetPasswordData({
      ...resetPasswordData,
      [fieldName]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPasswordSubmit = () => {
    if (
      !resetPasswordData.oldPassword ||
      !resetPasswordData.newPassword ||
      !resetPasswordData.confirmPassword
    ) {
      setPwerr(true);
      toastErr.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill in all password fields",
        life: 3000,
      });
      return;
    }
    if (resetPasswordData.confirmPassword !== resetPasswordData.newPassword) {
      toastErr.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }

    setIsUpdating(true);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/profile/change-profile-password/${user_uuid}`,
        resetPasswordData,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        toastErr.current.show({
          severity: "success",
          summary: "Success",
          detail: "Password changed successfully",
          life: 3000,
        });

        setResetPasswordData("");
        toggleResetPasswordDialog();
      })
      .catch((err) => {
        toastErr.current.show({
          severity: "warn",
          summary: "Warning",
          detail: err.response.data.message || "Error in changing password",
          life: 3000,
        });
        setIsUpdating(false);
      });
  };

  const handleSubmit = () => {
    setIsUpdating(true);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/profile/update-profile/${user_uuid}`,
        formData,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        let name = res.data.first_name;
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 7); // Cookie expires in 7 days (1 week)
        Cookies.set("first_name", name, {
          expires: expirationTime,
          sameSite: "strict",
        });

        toastErr.current.show({
          severity: "success",
          summary: "Success",
          detail: "Profile updated successfully",
          life: 3000,
        });
        setDialogVisible(false);
        setEditMode(false);
        setEditModeColor(false);
        setIsUpdating(false);
      })
      .catch((err) => {
        // Handle error, show an error toast, etc.
        toastErr.current.show({
          severity: "warn",
          summary: "Warning",
          detail: err.response.data.message || "Error in updating profile",
          life: 3000,
        });
        setIsUpdating(false);
      });
  };

  return (
    <>
      <Dialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setEditMode(false);
          setEditModeColor(false);
        }}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Profile Details"
        modal
        footer={
          editMode ? (
            <div>
              <button
                className={`p-button-primary rounded px-3 py-2 dark:bg-gray-150 dark:font-bold dark:text-blue-800 ${
                  isUpdating
                    ? "cursor-not-allowed bg-blue-200 text-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } `}
                disabled={isUpdating}
                onClick={handleSubmit}
              >
                {isUpdating ? (
                  <>
                    Updating...{" "}
                    <FiLoader className="inline-block animate-spin" />
                  </>
                ) : (
                  <>
                    Update <FiCheck className="inline-block" />
                  </>
                )}
              </button>
            </div>
          ) : null
        }
        className="p-fluid dark:bg-gray-900"
      >
        <div className="text-center">
          <HiOutlineUserCircle className="pi pi-user h-12 w-12  text-gray-400 dark:text-white" />
          <br />
          <p className="py-3 text-xl font-semibold">
            👋 Hey, welcome {formData.first_name} !
          </p>
          <hr />
        </div>
        <div className="flex justify-end gap-4">
          <p
            className={`mt-4 cursor-pointer text-right text-sm ${editModeColor}`}
            onClick={() => {
              if (editMode) {
                setEditMode(false);
                setEditModeColor("");
              } else {
                setEditMode(true);
                setEditModeColor("text-green-600");
              }
            }}
          >
            <FaEdit className="mb-1 inline-block" />
            Edit profile
          </p>
          <p
            className="mt-4 cursor-pointer text-right text-sm text-red-400"
            onClick={toggleResetPasswordDialog}
          >
            <FaLock className="mb-1 inline-block" /> Reset Password
          </p>
        </div>
        <div className="p-fluid mt-4">
          <div className="flex justify-between">
            <div className="card justify-content-center mr-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="first_name"
                  name="first_name"
                  value={formData?.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  disabled={!editMode}
                  className="border py-2 pl-2"
                  // className={!editedCustomerData.first_name ? "p-invalid" : ""}
                />
                <label htmlFor="first_name">First Name</label>
              </span>
            </div>
            <div className="card justify-content-center ml-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="last_name"
                  name="last_name"
                  value={formData?.last_name || ""}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  disabled={!editMode}
                  className="border py-2 pl-2"
                  // className={!editedCustomerData.last_name ? "p-invalid" : ""}
                />
                <label htmlFor="last_name">Last Name</label>
              </span>
            </div>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="email"
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={!editedCustomerData.email ? "p-invalid" : ""}
              />
              <label htmlFor="email">Email</label>
            </span>
          </div>
          <div className="mx-auto mt-8">
            <span className="p-float-label">
              <InputText
                id="company_name"
                name="company_name"
                value={formData?.company_name || ""}
                onChange={(e) =>
                  handleInputChange("company_name", e.target.value)
                }
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={!editedCustomerData.company_name ? "p-invalid" : ""}
              />
              <label htmlFor="company_name">Company Name</label>
            </span>
          </div>
          <div className="mx-auto mb-3 mt-8">
            <span className="p-float-label">
              <InputText
                id="phone"
                keyfilter="pint"
                name="phone"
                value={formData?.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={
                //   isValidPhoneNumber(editedCustomerData?.phone || "")
                //     ? ""
                //     : "p-invalid"
                // }
              />
              <label htmlFor="phone">Contact Number</label>
            </span>
          </div>
          <div className="mx-auto mt-6">
            <span>Address:</span>
          </div>
          <div className="mx-auto mt-6">
            <span className="p-float-label">
              <InputText
                id="address"
                type="text"
                name="address"
                value={formData?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={!editedCustomerData.address ? "p-invalid" : ""}
              />
              <label htmlFor="address">Flat No./ Plot No., Area/Society</label>
            </span>
          </div>
          <div className="mx-auto mt-6">
            <span className="p-float-label">
              <InputText
                id="city"
                type="text"
                name="city"
                value={formData?.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={!editedCustomerData.city ? "p-invalid" : ""}
              />
              <label htmlFor="city">City</label>
            </span>
          </div>
          <div className="mx-auto mt-6">
            <span className="p-float-label">
              <InputText
                id="state"
                name="state"
                value={formData?.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={!editedCustomerData.state ? "p-invalid" : ""}
              />
              <label htmlFor="state">State</label>
            </span>
          </div>
          <div className="mx-auto mt-6">
            <span className="p-float-label">
              <InputText
                id="pincode"
                keyfilter="pint"
                name="pincode"
                value={formData?.pincode || ""}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                disabled={!editMode}
                className="border py-2 pl-2"
                // className={!editedCustomerData.pincode ? "p-invalid" : ""}
              />
              <label htmlFor="pincode">Pincode</label>
            </span>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={resetPasswordVisible}
        onHide={toggleResetPasswordDialog}
        style={{ width: "30rem" }}
        header="Reset Password"
        modal
        footer={
          <div>
            <button
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={handleResetPasswordSubmit}
            >
              Change Password
            </button>
          </div>
        }
        className="p-fluid dark:bg-gray-900"
      >
        <div className="p-fluid mt-8">
          <span className="p-float-label">
            <InputText
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              name="oldPassword"
              value={resetPasswordData?.oldPassword}
              onChange={(e) => {
                handleResetPasswordInputChange("oldPassword", e.target.value);
                setPwerr(false);
              }}
              className={`border py-2 pl-2 ${pwerr ? "p-invalid" : ""}`}
            />
            <label htmlFor="currentPassword">Current Password</label>
          </span>
          <div className="absolute right-[2.8rem] top-[7.7rem]">
            {showPassword ? (
              <FaEyeSlash
                className="h-5 w-5 cursor-pointer  text-gray-500"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaEye
                className="h-5 w-5 cursor-pointer text-gray-600"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
          {pwerr && (
            <small className="p-error">Old password cannot be empty.</small>
          )}
        </div>
        <div className="p-fluid mt-8">
          <span className="p-float-label">
            <InputText
              id="newPassword"
              name="newPassword"
              value={resetPasswordData?.newPassword}
              onChange={(e) => {
                handleResetPasswordInputChange("newPassword", e.target.value);
                setPwerr(false);
              }}
              className={`border py-2 pl-2 ${pwerr ? "p-invalid" : ""}`}
            />
            <label htmlFor="newPassword">New Password</label>
          </span>
          {pwerr && (
            <small className="p-error">New password cannot be empty.</small>
          )}
        </div>
        <div className="p-fluid mt-8">
          <span className="p-float-label">
            <InputText
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => {
                handleResetPasswordInputChange(
                  "confirmPassword",
                  e.target.value
                );
                setPwerr(false);
              }}
              className={`border py-2 pl-2 ${pwerr ? "p-invalid" : ""}`}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </span>
          {pwerr && (
            <small className="p-error">Confirm password cannot be empty.</small>
          )}
        </div>
      </Dialog>

      <Toast ref={toastRef} position="top-center" />
      <Toast ref={toastErr} position="top-center" />
      <nav className="sticky top-0 z-40 flex flex-row flex-wrap items-center justify-between bg-white p-2 backdrop-blur-xl dark:bg-navy-800">
        <div className="ml-[6px]">
          <div className="">
            <img src={logo} className="w-[177px]" alt="" />
          </div>
          <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white"></p>
        </div>

        <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2  dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[165px] xl:gap-2">
          {isMobile && (
            <span
              className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
              onClick={handleOpenSidenav}
            >
              <FiAlignJustify className="h-5 w-5" />
            </span>
          )}
          {/* start Notification */}
          <Dropdown
            button={
              <p className="cursor-pointer">
                <IoMdNotificationsOutline className="h-6 w-6 text-gray-600 dark:text-white" />
              </p>
            }
            animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
            children={
              <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-navy-700 dark:text-white">
                    Notification
                  </p>
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    Mark all read
                  </p>
                </div>

                <button className="flex w-full items-center">
                  <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                    <BsArrowBarUp />
                  </div>
                  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                      New Alert: Drowsiness detected
                    </p>
                    <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                      New Alert: Drowsiness detected
                    </p>
                  </div>
                </button>

                <button className="flex w-full items-center">
                  <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                    <BsArrowBarUp />
                  </div>
                  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                      New Alert: Drowsiness detected
                    </p>
                    <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                      New Alert: Drowsiness detected
                    </p>
                  </div>
                </button>
              </div>
            }
            classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
          />
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              const newMode = !darkmode;
              localStorage.setItem("darkmode", newMode);

              if (newMode) {
                document.body.classList.add("dark");
              } else {
                document.body.classList.remove("dark");
              }

              setDarkmode(newMode);
            }}
          >
            {darkmode ? (
              <RiSunFill className="h-5 w-5 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-5 w-5 text-gray-600 dark:text-white" />
            )}
          </div>

          {/* Profile & Dropdown */}
          {user_type !== "1" ? (
            <Dropdown
              button={
                <HiOutlineUserCircle className="pi pi-user h-6 w-6 cursor-pointer text-gray-400 dark:text-white" />
              }
              children={
                <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        👋 Hey, {first_name}
                      </p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />
                  <div className="flex flex-col p-4">
                    <p
                      href="/profile"
                      className="cursor-pointer text-sm text-gray-800 dark:text-white hover:dark:text-white"
                      onClick={() => setDialogVisible(true)}
                    >
                      Profile Settings
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-3 text-start text-sm font-medium text-red-500 hover:text-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              }
              classNames={"py-2 top-8 -left-[180px] w-max"}
            />
          ) : (
            <Dropdown
              button={
                <HiOutlineUserCircle className="pi pi-user h-6 w-6 cursor-pointer text-gray-400 dark:text-white" />
              }
              children={
                <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        👋 Hey, {first_name}
                      </p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

                  <div className="flex flex-col p-4">
                    <button
                      onClick={handleLogout}
                      className="text-start text-sm font-medium text-red-500 hover:text-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              }
              classNames={"py-2 top-8 -left-[180px] w-max"}
            />
          )}
        </div>
        {isMobile && <Sidebar open={sidebarOpen} onClose={handleOpenSidenav} />}
      </nav>
    </>
  );
};

export default Navbar;
