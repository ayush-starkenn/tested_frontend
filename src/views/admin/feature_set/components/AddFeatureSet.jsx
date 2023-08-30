import React, { useContext, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import axios from "axios";
import { AppContext } from "context/AppContext";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";

const AddFeatureSet = ({ onSuccess }) => {
  const [data, setData] = useState({});
  const [values, setvalues] = useState({});
  const toastRef = useRef(null);
  const toastErr = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const { updateFunc } = useContext(AppContext);
  const [selectedValue, setSelectedValue] = useState([]);
  const [invalidFields, setInvalidFields] = useState([]);
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");

  //fetching customers
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/get-all-customer`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.customers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleData = (e) => {
    const { name, value } = e.target;

    setvalues({ ...values, [name]: value });
  };

  const handleSelectCustomer = (e) => {
    const { value } = e.target;
    setCustomers([
      {
        user_uuid: value.user_uuid,
      },
    ]);
  };

  //add feature set api call
  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidFieldsArray = [];

    // Check for empty or unselected fields and add to the invalidFieldsArray
    if (!data.featureset_name) {
      invalidFieldsArray.push("featureset_name");
    }
    if (!customers.length) {
      invalidFieldsArray.push("featureset_users");
    }
    const requiredFields = [
      "mode",
      "activationSpeed",
      "alarmThreshold",
      "brakeThreshold",
      "brakeSpeed",
      "detectStationaryObject",
      "allowCompleteBrake",
      "detectOncomingObstacle",
      "safetyMode",
      "ttcThreshold",
      "brakeOnDuration",
      "brakeOffDuration",
      "sleepAlertMode",
      "preWarning",
      "sleepAlertInterval",
      "activationSpeed",
      "startTime",
      "stopTime",
      "brakeActivateTime",
      "braking",
      "driverEvalMode",
      "maxLaneChangeThreshold",
      "minLaneChangeThreshold",
      "maxHarshAccelerationThreshold",
      "minHarshAccelerationThreshold",
      "suddenBrakingThreshold",
      "maxSpeedBumpThreshold",
      "minSpeedBumpThreshold",
      "GovernerMode",
      "speedLimit",
      "cruiseMode",
      "cruiseactivationSpeed",
      "vehicleType",
      "obdMode",
      "bluetoothConnAbsent",
      "protocolType",
      "tpmsMode",
      "acceleratorType",
      "brakeType",
      "lazerMode",
      "rfAngle",
      "rfSensorMode",
      "reserved1",
      "reserved2",
      "reserved3",
      "speedSource",
      "slope",
      "offset",
      "delay",
      "rfNameMode",
      "noAlarm",
      "speed",
      "accelerationBypass",
      "rfSensorAbsent",
      "gyroscopeAbsent",
      "hmiAbsent",
      "timeNotSet",
      "accelerationError",
      "iotAbsent",
      "brakeError",
      "tpmsError",
      "simCardAbsent",
      "lowBattery",
      "tripNotStarted",
      "obdAbsent",
      "noAlarmSpeed",
      "laserSensorAbsent",
      "rfidAbsent",
      "firmwareOtaUpdate",
      "firewarereserver1",
      "alcoholDetectionMode",
      "alcoholreserved1",
      "driverDrowsinessMode",
      "driverreserved1",
    ];

    for (const field of requiredFields) {
      if (!values[field]) {
        invalidFieldsArray.push(field);
      }
    }
    setInvalidFields(invalidFieldsArray);

    // If there are invalid fields, show a toast and return
    if (invalidFieldsArray.length > 0) {
      toastErr.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields.",
        life: 3000,
      });
      return;
    }
    const featuresetData = {
      user_uuid,
      featureset_name: data.featureset_name,
      featureset_users: customers,
      featuerset_version: 1,
      featureset_data: values,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/featuresets/add-featureset`,
        featuresetData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      );
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data.message || `Feature Set  added successfully`,
        life: 3000,
      });

      updateFunc();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail:
          err.response?.data?.error ||
          "An error occurred. Please try again later.",
        life: 3000,
      });

      console.error("Error:", err);
    }
  };

  //dropdown options
  const StationaryObjectoptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const CompleteBrakeoptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const OncomingObstacleptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const SafetyModeoptions = [
    { label: "Normal", value: "Normal" },
    { label: "Relaxed", value: "Relaxed" },
    {
      label: "Strict",
      value: "Strict",
    },
  ];

  const Brakingoptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const VehicleTypeoptions = [{ label: "12V Pedal", value: "12V Pedal" }];

  const AcceleratorTypeoptions = [
    {
      label: "Sensor",
      value: "Sensor",
    },
    {
      label: "Cylinder",
      value: "Cylinder",
    },
    {
      label: "Solenoid",
      value: "Solenoid",
    },
  ];

  const ProtocolTypeoptions = [
    { label: "SAEJ1939", value: "SAEJ1939" },
    {
      label: "CAN",
      value: "CAN",
    },
  ];

  const BrakeTypeoptions = [
    { label: "Cylinder", value: "Cylinder" },
    { label: "Internal Braking", value: "Internal Braking" },
    {
      label: "Electromagnetic",
      value: "Electromagnetic",
    },
  ];

  const SpeedSourceoptions = [
    { label: "Speed Wire", value: "Speed Wire" },
    { label: "OBD", value: "OBD" },
    { label: "GPS", value: "GPS" },
  ];

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      label: el.first_name + " " + el.last_name,
      value: {
        user_uuid: el.user_uuid,
      },
    }));
  };

  useEffect(() => {
    let k = listCustomers?.filter((el) => {
      return el.user_uuid.includes(customers[0]?.user_uuid);
    });

    if (k?.length > 0) {
      setSelectedValue(k[0]?.first_name + " " + k[0]?.last_name);
    }
  }, [listCustomers, customers]);
  //Test
  //add FS dialog
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} />
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="mt-2 flex" style={{ flexDirection: "column" }}>
            <label htmlFor="username">Feature Set Name</label>
            <InputText
              id="username"
              style={{
                width: "63vw",
                borderRadius: "5px",
              }}
              placeholder="Feature Set Name"
              className={
                invalidFields.includes("featureset_name") ? "p-invalid" : ""
              }
              name="featureset_name"
              onChange={handleChange}
            />
            <small id="username-help">Unique id to identify feature set</small>
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ecu">Select Customer</label>
            <Dropdown
              name="featureset_users"
              onChange={handleSelectCustomer}
              id="featureset_users"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={Customersoptions()}
              optionLabel="label"
              optionValue="value"
              placeholder={selectedValue ? selectedValue : "Tap to Select"}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("featureset_users") ? "p-invalid" : ""
              }`}
              value={selectedValue || ""}
            />
          </div>

          <p className="mt-4 font-bold ">System Type</p>
          {invalidFields.includes("mode") && (
            <span className="p-error">Please select any option.</span>
          )}
          <div className="mb-3 mt-2 flex flex-wrap gap-3">
            <div className="align-items-center flex">
              <input
                type="radio"
                name="mode"
                onChange={handleData}
                value="Online"
              />
              <label htmlFor="ingredient2" className="ml-2">
                Online Mode
              </label>
            </div>
            <div className="align-items-center flex">
              <input
                type="radio"
                name="mode"
                onChange={handleData}
                value="Offline"
              />
              <label htmlFor="ingredient1" className="ml-2">
                Offline Mode
              </label>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Collision Avoidance System</p>
        {invalidFields.includes("mode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="card justify-content-center mb-3 mt-2 flex gap-4">
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value="Enable"
              onChange={handleData}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value="Disable"
              onChange={handleData}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="as">Activation Speed</label>
            <InputText
              keyfilter="pint"
              id="as"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              className={`dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed") ? "p-invalid" : ""
              }`}
              placeholder="Enter a value"
              name="activationSpeed"
              onChange={handleData}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="at">Alarm Threshold</label>
            <InputText
              keyfilter="pint"
              id="at"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("alarmThreshold") ? "p-invalid" : ""
              }`}
              name="alarmThreshold"
              onChange={handleData}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="bt">Brake Threshold</label>
            <InputText
              keyfilter="pint"
              id="bt"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeThreshold") ? "p-invalid" : ""
              }`}
              name="brakeThreshold"
              onChange={handleData}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_speed">Brake Speed</label>
            <InputText
              keyfilter="pint"
              id="brake_speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              name="brakeSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleData}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[63vw]">
            <label htmlFor="stationaryobj">Detect Stationary Object</label>
            <Dropdown
              id="stationaryobj"
              options={StationaryObjectoptions}
              optionLabel="label"
              optionValue="value"
              placeholder="Select an option"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="detectStationaryObject"
              onChange={handleData}
              value={values.detectStationaryObject}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("detectStationaryObject")
                  ? "p-invalid"
                  : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="combrake">Allow Complete Brake</label>
            <Dropdown
              name="allowCompleteBrake"
              onChange={handleData}
              id="combrake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={CompleteBrakeoptions}
              placeholder="Select an option"
              value={values.allowCompleteBrake}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("allowCompleteBrake") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[63vw]">
            <label htmlFor="obstacle">Detect Oncoming Obstacle</label>
            <Dropdown
              name="detectOncomingObstacle"
              id="obstacle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={OncomingObstacleptions}
              value={values.detectOncomingObstacle}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              onChange={handleData}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("detectOncomingObstacle")
                  ? "p-invalid"
                  : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="safety">Safety Mode</label>
            <Dropdown
              name="safetyMode"
              id="safety"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={SafetyModeoptions}
              value={values.safetyMode}
              placeholder="Select an option"
              onChange={handleData}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("safetyMode") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ttc_threshold">TTC Threshold</label>
            <InputText
              keyfilter="pint"
              id="ttc_threshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("ttcThreshold") ? "p-invalid" : ""
              }`}
              name="ttcThreshold"
              onChange={handleData}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_on">Brake ON Duration</label>
            <InputText
              keyfilter="pint"
              id="brake_on"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOnDuration"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeOnDuration") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_off">Brake OFF Duration</label>
            <InputText
              keyfilter="pint"
              id="brake_off"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOffDuration"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeOffDuration") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Sleep Alert</p>
        {invalidFields.includes("sleepAlertMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="op2"
              name="sleepAlertMode"
              onChange={handleData}
              value="Online"
            />
            <label htmlFor="op2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="op1"
              name="sleepAlertMode"
              onChange={handleData}
              value="Offline"
            />
            <label htmlFor="op1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="pre_warning">Pre Warning</label>
            <InputText
              keyfilter="pint"
              id="pre_warning"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("preWarning") ? "p-invalid" : ""
              }`}
              name="preWarning"
              onChange={handleData}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sleep_interval">Sleep Alert Interval</label>
            <InputText
              keyfilter="pint"
              id="sleep_interval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sleepAlertInterval"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("sleepAlertInterval") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="act_speed">Activation Speed</label>
            <InputText
              keyfilter="pint"
              id="act_speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="activationSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="start_time">Start Time</label>
            <InputText
              keyfilter="pint"
              id="start_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="startTime"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("startTime") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stop_time">Stop Time</label>
            <InputText
              keyfilter="pint"
              id="stop_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stopTime"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("stopTime") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="bat">Brake Activate Time</label>
            <InputText
              keyfilter="pint"
              id="bat"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeActivateTime"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeActivateTime") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="braking">Braking</label>
            <Dropdown
              name="braking"
              value={values.braking}
              onChange={handleData}
              id="braking"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={Brakingoptions}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("braking") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Driver Evaluation</p>
        {invalidFields.includes("driverEvalMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ingredient2"
              name="driverEvalMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ingredient1"
              name="driverEvalMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxlane">Max Lane Change Threshold</label>
            <InputText
              keyfilter="pint"
              id="maxlane"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxLaneChangeThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("maxLaneChangeThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minlane">Min Lane Change Threshold</label>
            <InputText
              keyfilter="pint"
              id="minlane"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minLaneChangeThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("minLaneChangeThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxharsh">Max Harsh Acceleration Threshold</label>
            <InputText
              keyfilter="pint"
              id="maxharsh"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxHarshAccelerationThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("maxHarshAccelerationThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minharsh">Min Harsh Acceleration Threshold</label>
            <InputText
              keyfilter="pint"
              id="minharsh"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minHarshAccelerationThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("minHarshAccelerationThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sudden_brake">Sudden Braking Threshold</label>
            <InputText
              keyfilter="pint"
              id="sudden_brake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="suddenBrakingThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("suddenBrakingThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxspeed">Max Speed Bump Threshold</label>
            <InputText
              keyfilter="pint"
              id="maxspeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxSpeedBumpThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("maxSpeedBumpThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minspeed">Min Speed Bump Threshold</label>
            <InputText
              keyfilter="pint"
              id="minspeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minSpeedBumpThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("minSpeedBumpThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Governor</p>
        {invalidFields.includes("GovernerMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="on"
              onChange={handleData}
              name="GovernerMode"
              value="Online"
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="off"
              name="GovernerMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speed_limit">Speed Limit</label>
            <InputText
              keyfilter="pint"
              id="speed_limit"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedLimit"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("speedLimit") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Cruise</p>
        {invalidFields.includes("cruiseMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="mode2"
              name="cruiseMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="mode2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="mode1"
              onChange={handleData}
              name="cruiseMode"
              value="Offline"
            />
            <label htmlFor="mode1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="cruise_as">Activation Speed</label>
          <InputText
            keyfilter="pint"
            id="cruise_as"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="cruiseactivationSpeed"
            className={`dark:bg-gray-900 ${
              invalidFields.includes("cruiseactivationSpeed") ? "p-invalid" : ""
            }`}
            onChange={handleData}
            placeholder="Enter a value"
          />
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="vehicle">Vehicle Type</label>
            <Dropdown
              id="vehicle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="vehicleType"
              onChange={handleData}
              options={VehicleTypeoptions}
              value={values.vehicleType}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("vehicleType") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">OBD</p>
        {invalidFields.includes("obdMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="enable"
              name="obdMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="enable" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="disable"
              name="obdMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="disable" className="ml-2">
              Disable
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="protocol">Protocol Type</label>
            <Dropdown
              id="protocol"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="protocolType"
              onChange={handleData}
              options={ProtocolTypeoptions}
              placeholder="Select an option"
              value={values.protocolType}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("protocolType") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">TPMS</p>
        {invalidFields.includes("tpmsMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="online"
              name="tpmsMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="online" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="tpmsMode"
              id="offline"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="offline" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Vehicle Settings</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc">Accelerator Type</label>
            <Dropdown
              id="acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={values.acceleratorType}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              name="acceleratorType"
              onChange={handleData}
              options={AcceleratorTypeoptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("acceleratorType") ? "p-invalid" : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake">Brake Type</label>
            <Dropdown
              id="brake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={values.brakeType}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              name="brakeType"
              onChange={handleData}
              options={BrakeTypeoptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("brakeType") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Sensor</p>
        <p className="mt-4 font-bold ">Laser Sensor</p>
        {invalidFields.includes("lazerMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="lm_on"
              name="lazerMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="lm_on" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="lm_off"
              name="lazerMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="lm_off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <p className="mt-4 font-bold ">RF Sensor</p>
        {invalidFields.includes("rfSensorMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rf_en"
              name="rfSensorMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="rf_en" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rf_dis"
              name="rfSensorMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="rf_dis" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rf_angle">RF Angle</label>
            <InputText
              keyfilter="pint"
              id="rf_angle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfAngle"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("rfAngle") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="res1">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="reserved1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("reserved1") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="res2">Reserved 2</label>
            <InputText
              keyfilter="pint"
              id="res2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="reserved2"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("reserved2") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="res3">Reserved 3</label>
            <InputText
              keyfilter="pint"
              id="res3"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="reserved3"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("reserved3") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Settings</p>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speed_src">Speed Source</label>
            <Dropdown
              id="speed_src"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedSource"
              value={values.speedSource}
              placeholder="Select an option"
              options={SpeedSourceoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleData}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("speedSource") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="slope">Slope</label>
            <InputText
              keyfilter="pint"
              id="slope"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="slope"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("slope") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="offset">Offset</label>
            <InputText
              keyfilter="pint"
              id="offset"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="offset"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("offset") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Shutdown Delay</p>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="delay">Delay</label>
          <InputText
            keyfilter="pint"
            id="delay"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="delay"
            className={`dark:bg-gray-900 ${
              invalidFields.includes("delay") ? "p-invalid" : ""
            }`}
            onChange={handleData}
            placeholder="Enter a value"
          />
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">RF Name</p>
        {invalidFields.includes("rfNameMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rfname_en"
              name="rfNameMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="rfname_en" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rfname_dis"
              name="rfNameMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="rfname_dis" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Time Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="no_alarm">No Alarm</label>
            <InputText
              keyfilter="pint"
              id="no_alarm"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarm"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("noAlarm") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speed">Speed</label>
            <InputText
              keyfilter="pint"
              id="speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("speed") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc_bypass">Acceleration Bypass</label>
            <InputText
              keyfilter="pint"
              id="acc_bypass"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationBypass"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("accelerationBypass") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rf">RF Sensor Absent</label>
            <InputText
              keyfilter="pint"
              id="rf"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfSensorAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("rfSensorAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="gyro">Gyroscope Absent</label>
            <InputText
              keyfilter="pint"
              id="gyro"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="gyroscopeAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("gyroscopeAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="hmi">HMI Absent</label>
            <InputText
              keyfilter="pint"
              id="hmi"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="hmiAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("hmiAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tns">Time Not Set</label>
            <InputText
              keyfilter="pint"
              id="tns"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="timeNotSet"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("timeNotSet") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc_err">Acceleration Error</label>
            <InputText
              keyfilter="pint"
              id="acc_err"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationError"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("accelerationError") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="iot_ab">IoT Absent</label>
            <InputText
              keyfilter="pint"
              id="iot_ab"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="iotAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("iotAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_err">Brake Error</label>
            <InputText
              keyfilter="pint"
              id="brake_err"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeError"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeError") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tpms_err">TPMS Error</label>
            <InputText
              keyfilter="pint"
              id="tpms_err"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tpmsError"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("tpmsError") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sim">OSIM Card Absent</label>
            <InputText
              keyfilter="pint"
              id="sim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="simCardAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("simCardAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="battery">Low battery</label>
            <InputText
              keyfilter="pint"
              id="battery"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="lowBattery"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("lowBattery") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="trip">Trip Not Started</label>
            <InputText
              keyfilter="pint"
              id="trip"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tripNotStarted"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("tripNotStarted") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="bluetooth">Bluetooth Conn Absent</label>
            <InputText
              keyfilter="pint"
              id="bluetooth"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="bluetoothConnAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("bluetoothConnAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="obd">OBD Absent</label>
            <InputText
              keyfilter="pint"
              id="obd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="obdAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("obdAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="no_alarm_sp">No Alarm</label>
            <InputText
              keyfilter="pint"
              id="no_alarm_sp"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarmSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("noAlarmSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="laser">Laser Sensor Absent</label>
            <InputText
              keyfilter="pint"
              id="laser"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="laserSensorAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("laserSensorAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfid">RFID Absent</label>
            <InputText
              keyfilter="pint"
              id="rfid"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfidAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("rfidAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Firmware OTA Update</p>
        {invalidFields.includes("firmwareOtaUpdate") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ota_av"
              name="firmwareOtaUpdate"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="ota_av" className="ml-2">
              Available
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ota_nav"
              name="firmwareOtaUpdate"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="ota_nav" className="ml-2">
              Not Available
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ecu">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="username"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver1") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Alcohol Detection</p>
        {invalidFields.includes("alcoholDetectionMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="alc_on"
              name="alcoholDetectionMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="alc_on" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="alc_off"
              name="alcoholDetectionMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="alc_off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholreserved1">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="alcoholreserved1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholreserved1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("alcoholreserved1") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Driver Drowsiness</p>
        {invalidFields.includes("driverDrowsinessMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="drowsi_on"
              name="driverDrowsinessMode"
              value="Online"
              onChange={handleData}
            />
            <label htmlFor="drowsi_on" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="drowsi_off"
              name="driverDrowsinessMode"
              value="Offline"
              onChange={handleData}
            />
            <label htmlFor="drowsi_off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="driverreserved1">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="driverreserved1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="driverreserved1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("driverreserved1") ? "p-invalid" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
            />
          </div>
        </div>
        <div className="text-right">
          <Button
            label="Add Feature Set"
            icon="pi pi-check"
            type="submit"
            className="px-3 py-2 text-right hover:bg-none dark:hover:bg-gray-50"
            style={{ width: "fit-content", background: "#2152FF" }}
          />
        </div>
      </form>
    </>
  );
};

export default AddFeatureSet;
