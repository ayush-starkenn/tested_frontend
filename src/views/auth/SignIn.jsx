import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import axios from "axios";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Preloader from "./Preloader";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

const SignIn = () => {
  const token = Cookies.get("token");
  const usertype = Cookies.get("user_type");

  const navigate = useNavigate();
  useEffect(() => {
    if (token && usertype === 1) {
      navigate("/admin/dashboard");
    } else if (token && usertype === 2) {
      navigate("/customer/dashboard");
    }
  }, [token, usertype, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [emailforotp, setEmailForOTP] = useState("");
  const [otp, setOtp] = useState("");
  const [changepassword, setChangePassword] = useState("");
  const [sendingOTP, setSendingOTP] = useState(false);
  const [showError, setShowError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [darkmode, setDarkmode] = useState(false);
  const toastRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.email.trim() || !data.password.trim()) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all the details.",
        life: 3000,
      });
      return;
    }
    if (data.email && data.password) {
      setLoading(true);
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, data)
        .then((res) => {
          const token = res.data.token;
          const user_type = res.data.user.user_type;
          const user_uuid = res.data.user.user_uuid;
          const first_name = res.data.user.first_name;
          const expirationTime = new Date();
          expirationTime.setDate(expirationTime.getDate() + 7); // Cookie expires in 7 days (1 week)

          Cookies.set("token", token, {
            expires: expirationTime,
            sameSite: "strict",
          });
          Cookies.set("user_uuid", user_uuid, {
            expires: expirationTime,
            sameSite: "strict",
          });
          Cookies.set("user_type", user_type, {
            expires: expirationTime,
            sameSite: "strict",
          });
          Cookies.set("first_name", first_name, {
            expires: expirationTime,
            sameSite: "strict",
          });
          if (user_type === 1) {
            setLoading(false);
            navigate("/admin/dashboard");
          } else {
            setLoading(false);
            navigate("/customer/dashboard");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail:
              err.response?.data?.message ||
              "An error occurred. Please try again later.",
            life: 3000,
          });
        });
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordDialog(true);
  };
  const handleForgotPasswordNext = async () => {
    try {
      if (!emailforotp.trim()) {
        setShowError(true);
        return;
      }
      setSendingOTP(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/forgot-password-otp`,
        { email: emailforotp }
      );
      if (response.status === 200) {
        setShowOTPInput(true);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP sent successfully",
          life: 3000,
        });
        // You can add any additional logic or feedback to the user here
      } else {
        toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Failed to send OTP",
          life: 3000,
        });
      }
    } catch (error) {
      toastRef.current.show({
        severity: "warn",
        summary: "Warning",
        detail: error.response.data.message || "Error sending OTP",
        life: 3000,
      });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleOTPSubmit = async () => {
    try {
      if (!otp.trim()) {
        setOtpError(true);
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/forgot-password-otp-verify`,
        { email: emailforotp, otp: otp }
      );
      if (response.status === 200) {
        setOtp("");
        setShowOTPInput(false);
        setShowNewPasswordFields(true);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP verified successfully",
          life: 3000,
        });
      } else {
        toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Failed to send OTP",
          life: 3000,
        });
      }
    } catch (error) {
      toastRef.current.show({
        severity: "warn",
        summary: "Warning",
        detail: error.response.data.message || "Error sending OTP",
        life: 3000,
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!changepassword.trim() && !confirmNewPassword.trim()) {
        setPwError(true);
        return;
      }
      if (changepassword !== confirmNewPassword) {
        toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Passwords do not match",
          life: 3000,
        });
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/forgot-password-change`,
        { email: emailforotp, password: changepassword }
      );
      if (response.status === 200) {
        setOtp("");
        setShowOTPInput(false);
        setEmailForOTP("");
        setShowForgotPasswordDialog(false);
        setShowNewPasswordFields(false);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Password changed successfully",
          life: 3000,
        });
      } else {
        toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Failed to change password",
          life: 3000,
        });
      }
    } catch (error) {
      toastRef.current.show({
        severity: "warn",
        summary: "Warning",
        detail: error.response.data.message || "Error in changing password",
        life: 3000,
      });
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 dark:!bg-gray-800 sm:py-12">
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {loading ? (
        <Preloader />
      ) : (
        <div className="relative py-3 sm:mx-auto sm:max-w-xl ">
          <div
            className="fixed bottom-10 right-10 cursor-pointer justify-end text-gray-600"
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
              <RiSunFill className="h-6 w-6 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-6 w-6 text-gray-600 dark:text-white" />
            )}
          </div>
          <div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-blue-300 to-blueSecondary shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
          <div className="relative bg-white px-4 py-10 shadow-lg  dark:!bg-gray-750 dark:shadow-2xl sm:rounded-3xl sm:p-20">
            <div className="mx-auto max-w-md">
              <div>
                <h1 className="text-2xl opacity-70 dark:!text-white">
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "500",
                    }}
                  >
                    Welcome To Starkenn Technologies
                  </span>
                </h1>
              </div>

              <div className="divide-y">
                <div className="space-y-8 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                  <form onSubmit={handleSubmit}>
                    <div className="relative mt-4">
                      <span className="p-float-label">
                        <InputText
                          id="email"
                          type="email"
                          name="email"
                          onChange={handleChange}
                          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:!bg-gray-800 dark:!text-white dark:focus:border-blue-500"
                        />
                        <label htmlFor="email">
                          <p className="text-[1rem] dark:text-gray-300">
                            Username
                          </p>
                        </label>
                      </span>
                    </div>
                    <div className="relative my-12">
                      <span className="p-float-label">
                        <InputText
                          autoComplete="off"
                          id="password"
                          name="password"
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"}
                          minLength={6}
                          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:!bg-gray-800 dark:!text-white dark:focus:border-blue-500"
                        />
                        <label htmlFor="password">
                          <p className="text-[1rem] dark:text-gray-300">
                            Password
                          </p>
                        </label>
                      </span>

                      <div className="absolute right-2.5 top-3">
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
                    </div>

                    <div className="relative">
                      <button
                        type="submit"
                        className="flex items-center rounded-md bg-blueSecondary px-4 py-1 text-white dark:!bg-gray-100 dark:!text-gray-850"
                      >
                        Sign In
                        <BsArrowRightCircleFill className="ml-1" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="relative border-0 text-center">
                <p>
                  <button
                    href="/forgot-password"
                    className="text-blue-600 underline"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot Password?
                  </button>
                </p>
              </div>
            </div>
          </div>

          <Dialog
            visible={showForgotPasswordDialog}
            onHide={() => {
              setShowForgotPasswordDialog(false);
              setShowOTPInput(false);
              setEmailForOTP("");
              setOtp("");
              setOtpError(false);
              setPwError(false);
              setChangePassword("");
              setShowError(false);
              setConfirmNewPassword("");
              setShowNewPasswordFields(false);
            }}
            header={showOTPInput ? "Enter OTP" : "Forgot Password"}
            style={{ width: "35rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            modal
            className="p-fluid dark:bg-gray-900"
          >
            {showOTPInput ? (
              <div>
                <div className="mt-8">
                  <span className="p-float-label">
                    <InputText
                      keyfilter="pint"
                      id="otp"
                      value={otp}
                      className={`border py-2 pl-2 ${
                        otpError ? "p-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setOtpError(false);
                      }}
                    />
                    <label htmlFor="otp">OTP</label>
                  </span>
                  {otpError && (
                    <small className="p-error">OTP cannot be empty</small>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <button
                    className="rounded-md bg-blueSecondary px-4 py-1 text-white dark:!bg-gray-100 dark:!text-gray-850"
                    onClick={handleOTPSubmit}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            ) : showNewPasswordFields ? (
              <div>
                {/* New Password input field */}
                <div className="mt-8">
                  <span className="p-float-label">
                    <InputText
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      name="changepassword"
                      className={`border py-2 pl-2 ${
                        pwError ? "p-invalid" : ""
                      }`}
                      value={changepassword}
                      onChange={(e) => {
                        setChangePassword(e.target.value);
                        setPwError(false);
                      }}
                    />
                    <label htmlFor="newPassword">New Password</label>
                  </span>
                  <div className="absolute right-[2.5rem] top-[7.7rem]">
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
                  {pwError && (
                    <small className="p-error">Password cannot be empty</small>
                  )}
                </div>
                {/* Confirm New Password input field */}
                <div className="mt-8">
                  <span className="p-float-label">
                    <InputText
                      id="confirmNewPassword"
                      type={showPassword ? "text" : "password"}
                      className={`border py-2 pl-2 ${
                        pwError ? "p-invalid" : ""
                      }`}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <label htmlFor="confirmNewPassword">
                      Confirm New Password
                    </label>
                  </span>
                  <div className="absolute right-[2.5rem] top-[13.7rem]">
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
                  {pwError && (
                    <small className="p-error">
                      Confirm password cannot be empty
                    </small>
                  )}
                </div>
                {/* Change Password button */}
                <div className="mt-4 text-center">
                  <button
                    className="rounded-md bg-blueSecondary px-4 py-1 text-white dark:!bg-gray-100 dark:!text-gray-850"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mt-8">
                  <span className="p-float-label">
                    <InputText
                      id="username"
                      name="emailforotp"
                      value={emailforotp}
                      className={`border py-2 pl-2 ${
                        showError ? "p-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setEmailForOTP(e.target.value);
                        setShowError(false);
                      }}
                    />
                    <label htmlFor="username">Email</label>
                  </span>
                  {showError && (
                    <small className="p-error">Please enter an email id.</small>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <button
                    className={`relative rounded-md bg-blueSecondary px-4 py-1 text-white dark:!bg-gray-100 dark:!text-gray-850 ${
                      sendingOTP ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={handleForgotPasswordNext}
                    disabled={sendingOTP}
                  >
                    <div className="flex items-center">
                      {sendingOTP ? (
                        <div className="flex items-center">
                          Sending OTP
                          <div className="ml-2 h-6 w-6 animate-spin rounded-full border-r-2 border-t-2 border-gray-50 dark:border-gray-800"></div>
                        </div>
                      ) : (
                        "Send OTP"
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default SignIn;
