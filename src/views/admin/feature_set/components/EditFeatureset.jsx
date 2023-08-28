import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { Toast } from "primereact/toast";
import { useContext } from "react";
import { AppContext } from "context/AppContext";
import Cookies from "js-cookie";
import axios from "axios";
import { Tag } from "primereact/tag";

const EditFeatureset = ({ parameters, onSuccess }) => {
  const [featuresetDetails, setFeaturesetDetails] = useState({
    featureset_name: "",
  });
  const [featuresetData, setFeaturesetData] = useState({});
  const [featuresetUsers, setFeaturesetUsers] = useState([]);
  const [invalidFields, setInvalidFields] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const { updateFunc } = useContext(AppContext);
  const toastErr = useRef(null);

  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");

  //get featureset Deatils
  useEffect(() => {
    setFeaturesetDetails(parameters?.propValue);
  }, [parameters.propValue]);
  useEffect(() => {
    if (featuresetDetails.featureset_data) {
      try {
        const featuresetDataParse = JSON.parse(
          featuresetDetails.featureset_data
        );
        setFeaturesetData(featuresetDataParse);
      } catch (error) {
        console.error("Error parsing featureset_data:", error);
      }
    }
  }, [featuresetDetails]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/customers/get-all-customer", {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.customers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    if (
      featuresetDetails &&
      featuresetDetails.featureset_users &&
      listCustomers
    ) {
      let usersinFeatureset = JSON.parse(featuresetDetails?.featureset_users);

      const mapfeaturesetusers = usersinFeatureset.map((el) => el.user_uuid);

      const k = listCustomers?.filter((el) =>
        mapfeaturesetusers.includes(el.user_uuid)
      );
      if (k.length > 0) {
        setFeaturesetUsers(k);
      }
    }
  }, [listCustomers, featuresetDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeaturesetDetails({ ...featuresetDetails, [name]: value });
  };

  const handleDetails = (e) => {
    const { name, value } = e.target;
    setFeaturesetData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //making api call to update FS
  const handleSubmit = (e) => {
    e.preventDefault();
    const invalidFieldsArray = [];

    // Check for empty or unselected fields and add to the invalidFieldsArray
    if (!featuresetDetails.featureset_name) {
      invalidFieldsArray.push("featureset_name");
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
      if (!featuresetData[field]) {
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
    const editData = {
      user_uuid,
      featureset_name: featuresetDetails.featureset_name,
      featuerset_version: featuresetDetails.featuerset_version || 1,
      featureset_data: featuresetData,
      featureset_status: featuresetDetails.featureset_status,
    };

    axios
      .put(
        `http://localhost:8080/api/featuresets/edit-featureset/${featuresetDetails.featureset_uuid}`,
        editData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        updateFunc();

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        console.log({ error: err });
      });
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

  const activeOption = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  //edit dialog
  return (
    <>
      <Toast ref={toastErr} className="bg-red-400" />
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
              name="featureset_name"
              className={
                invalidFields.includes("featureset_name") ? "p-invalid" : ""
              }
              onChange={handleChange}
              value={featuresetDetails?.featureset_name}
            />
            <small id="username-help">Unique id to identify feature set</small>
          </div>
          <div className="mt-2 flex" style={{ flexDirection: "column" }}>
            <label htmlFor="username">Featureset Version</label>
            <InputText
              id="featuerset_version"
              keyfilter="pint"
              style={{
                width: "63vw",
                borderRadius: "5px",
              }}
              name="featuerset_version"
              onChange={handleChange}
              placeholder="Featureset Version"
              value={featuresetDetails?.featureset_version}
            />
            <small id="username-help">Featureset version</small>
          </div>
          <div className="mt-2 flex" style={{ flexDirection: "column" }}>
            <label htmlFor="featureset_users">Featureset users</label>
            <div>
              {featuresetUsers?.map((el, ind) => (
                <Tag
                  key={ind}
                  className="my-1 mr-2 bg-gray-200 text-gray-800"
                  icon="pi pi-user"
                  value={el.first_name + " " + el.last_name}
                />
              ))}
            </div>
          </div>

          <div className="field my-3 w-[30vw]">
            <label htmlFor="active">Select Status</label>
            <Dropdown
              name="featureset_status"
              id="active"
              style={{
                width: "30vw",
                borderBottom: "1px dashed #ced4da",
                borderRadius: "0px",
                padding: "0.30px",
                borderRight: "none",
                borderLeft: "none",
                borderTop: "none",
              }}
              onChange={handleChange}
              options={activeOption}
              optionLabel="label"
              optionValue="value"
              className="md:w-14rem mt-2 w-full"
              placeholder={
                featuresetDetails?.featureset_status === 1
                  ? "Active"
                  : "Deactive"
              }
              value={featuresetDetails.featureset_status}
            />
          </div>

          <p className="mt-4 font-bold ">System Type</p>
          {invalidFields.includes("mode") && (
            <span className="p-error">Please select any option.</span>
          )}
          <div className="my-3 flex flex-wrap gap-3">
            <div className="align-items-center flex">
              <input
                type="radio"
                name="mode"
                onChange={handleDetails}
                value="Online"
                checked={featuresetData?.mode === "Online"}
              />
              <label htmlFor="ingredient2" className="ml-2">
                Online Mode
              </label>
            </div>
            <div className="align-items-center flex">
              <input
                type="radio"
                name="mode"
                onChange={handleDetails}
                value="Offline"
                checked={featuresetData?.mode === "Offline"}
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
        <div className="card justify-content-center mt-5 flex gap-4">
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value="Enable"
              onChange={handleDetails}
              checked={featuresetData?.CASMode === "Enable"}
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
              onChange={handleDetails}
              checked={featuresetData?.CASMode === "Disable"}
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
              placeholder={
                featuresetData?.activationSpeed
                  ? featuresetData?.activationSpeed
                  : "Enter a value"
              }
              value={featuresetData?.activationSpeed || ""}
              name="activationSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="at">Alarm Threshold</label>
            <InputText
              id="at"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.alarmThreshold
                  ? featuresetData.alarmThreshold
                  : "Enter a value"
              }
              name="alarmThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("alarmThreshold") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData?.alarmThreshold || ""}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="bt">Brake Threshold</label>
            <InputText
              id="bt"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.brakeThreshold
                  ? featuresetData.brakeThreshold
                  : "Enter a value"
              }
              value={featuresetData.brakeThreshold}
              name="brakeThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeThreshold") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
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
              placeholder={
                featuresetData.brakeSpeed
                  ? featuresetData.brakeSpeed
                  : "Enter a value"
              }
              value={featuresetData.brakeSpeed}
              name="brakeSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
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
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.detectStationaryObject
                  ? `Selected: ${featuresetData.detectStationaryObject}`
                  : "Select an option"
              }
              name="detectStationaryObject"
              value={featuresetData.detectStationaryObject}
              onChange={handleDetails}
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
              onChange={handleDetails}
              id="combrake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.allowCompleteBrake
                  ? featuresetData.allowCompleteBrake
                  : "Select an option"
              }
              value={featuresetData.allowCompleteBrake}
              options={CompleteBrakeoptions}
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
              placeholder={
                featuresetData.detectOncomingObstacles
                  ? featuresetData.detectOncomingObstacles
                  : "Select an option"
              }
              value={featuresetData.detectOncomingObstacle}
              options={OncomingObstacleptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
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
              placeholder={
                featuresetData.safetyMode
                  ? featuresetData.safetyMode
                  : "Select an option"
              }
              value={featuresetData.safetyMode}
              options={SafetyModeoptions}
              onChange={handleDetails}
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
              id="ttc_threshold"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.ttcThreshold
                  ? featuresetData.ttcThreshold
                  : "Enter a value"
              }
              value={featuresetData.ttcThreshold}
              name="ttcThreshold"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("ttcThreshold") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_on">Brake ON Duration</label>
            <InputText
              id="brake_on"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.brakeOnDuration
                  ? featuresetData.brakeOnDuration
                  : "Enter a value"
              }
              value={featuresetData.brakeOnDuration}
              name="brakeOnDuration"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeOnDuration") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_off">Brake OFF Duration</label>
            <InputText
              id="brake_off"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.brakeOffDuration
                  ? featuresetData.brakeOffDuration
                  : "Enter a value"
              }
              value={featuresetData.brakeOffDuration}
              name="brakeOffDuration"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeOffDuration") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Sleep Alert</p>
        {invalidFields.includes("sleepAlertMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="op2"
              name="sleepAlertMode"
              onChange={handleDetails}
              checked={featuresetData?.sleepAlertMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.sleepAlertMode === "Offline"}
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
              id="pre_warning"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.preWarning
                  ? featuresetData.preWarning
                  : "Enter a value"
              }
              value={featuresetData.preWarning}
              name="preWarning"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("preWarning") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sleep_interval">Sleep Alert Interval</label>
            <InputText
              id="sleep_interval"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={featuresetData.sleepAlertInterval}
              name="sleepAlertInterval"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("sleepAlertInterval") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.sleepAlertInterval
                  ? featuresetData.sleepAlertInterval
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="act_speed">Activation Speed</label>
            <InputText
              id="act_speed"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="activationSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.activationSpeed
                  ? featuresetData.activationSpeed
                  : "Enter a value"
              }
              value={featuresetData.activationSpeed}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="start_time">Start Time</label>
            <InputText
              id="start_time"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="startTime"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("startTime") ? "p-invalid" : ""
              }`}
              placeholder={
                featuresetData.startTime
                  ? featuresetData.startTime
                  : "Enter a value"
              }
              value={featuresetData.startTime}
              onChange={handleDetails}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stop_time">Stop Time</label>
            <InputText
              id="stop_time"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stopTime"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("stopTime") ? "p-invalid" : ""
              }`}
              value={featuresetData.stopTime}
              onChange={handleDetails}
              placeholder={
                featuresetData.stopTime
                  ? featuresetData.stopTime
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="bat">Brake Activate Time</label>
            <InputText
              id="bat"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={featuresetData.brakeActivateTime}
              name="brakeActivateTime"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeActivateTime") ? "p-invalid" : ""
              }`}
              placeholder={
                featuresetData.brakeActivateTime
                  ? featuresetData.brakeActivateTime
                  : "Enter a value"
              }
              onChange={handleDetails}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="braking">Braking</label>
            <Dropdown
              name="braking"
              onChange={handleDetails}
              id="braking"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.braking
                  ? featuresetData.braking
                  : "Select an option"
              }
              value={featuresetData.braking}
              options={Brakingoptions}
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
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              name="driverEvalMode"
              id="ingredient2"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.driverEvalMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.driverEvalMode === "Offline"}
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
              id="maxlane"
              keyfilter="pint"
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
              onChange={handleDetails}
              placeholder={
                featuresetData.maxLaneChangeThreshold
                  ? featuresetData.maxLaneChangeThreshold
                  : "Enter a value"
              }
              value={featuresetData.maxLaneChangeThreshold}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minlane">Min Lane Change Threshold</label>
            <InputText
              id="minlane"
              keyfilter="pint"
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
              onChange={handleDetails}
              value={featuresetData.minLaneChangeThreshold}
              placeholder={
                featuresetData.minLaneChangeThreshold
                  ? featuresetData.minLaneChangeThreshold
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxharsh">Max Harsh Acceleration Threshold</label>
            <InputText
              id="maxharsh"
              keyfilter="pint"
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
              onChange={handleDetails}
              value={featuresetData.maxHarshAccelerationThreshold}
              placeholder={
                featuresetData.maxHarshAccelerationThreshold
                  ? featuresetData.maxHarshAccelerationThreshold
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minharsh">Min Harsh Acceleration Threshold</label>
            <InputText
              id="minharsh"
              keyfilter="pint"
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
              onChange={handleDetails}
              value={featuresetData.minHarshAccelerationThreshold}
              placeholder={
                featuresetData.minHarshAccelerationThreshold
                  ? featuresetData.minHarshAccelerationThreshold
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sudden_brake">Sudden Braking Threshold</label>
            <InputText
              id="sudden_brake"
              keyfilter="pint"
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
              value={featuresetData.suddenBrakingThreshold}
              onChange={handleDetails}
              placeholder={
                featuresetData.suddenBrakingThreshold
                  ? featuresetData.suddenBrakingThreshold
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxspeed">Max Speed Bump Threshold</label>
            <InputText
              id="maxspeed"
              keyfilter="pint"
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
              value={featuresetData.maxSpeedBumpThreshold}
              onChange={handleDetails}
              placeholder={
                featuresetData.maxSpeedBumpThreshold
                  ? featuresetData.maxSpeedBumpThreshold
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minspeed">Min Speed Bump Threshold</label>
            <InputText
              id="minspeed"
              keyfilter="pint"
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
              onChange={handleDetails}
              value={featuresetData.minSpeedBumpThreshold}
              placeholder={
                featuresetData.minSpeedBumpThreshold
                  ? featuresetData.minSpeedBumpThreshold
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Governor</p>
        {invalidFields.includes("GovernerMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="on"
              onChange={handleDetails}
              name="GovernerMode"
              value="Online"
              checked={featuresetData?.GovernerMode === "Online"}
            />
            <label htmlFor="on" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="off"
              name="GovernerMode"
              value="Offline"
              onChange={handleDetails}
              checked={featuresetData?.GovernerMode === "Offline"}
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
              id="speed_limit"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedLimit"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("speedLimit") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.speedLimit}
              placeholder={
                featuresetData.speedLimit
                  ? featuresetData.speedLimit
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Cruise</p>
        {invalidFields.includes("cruiseMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="mode2"
              name="cruiseMode"
              value="Online"
              onChange={handleDetails}
            />
            <label htmlFor="mode2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="mode1"
              onChange={handleDetails}
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
            id="cruise_as"
            keyfilter="pint"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="cruiseactivationSpeed"
            className={`dark:bg-gray-900 ${
              invalidFields.includes("cruiseactivationSpeed") ? "p-invalid" : ""
            }`}
            onChange={handleDetails}
            placeholder={
              featuresetData.activationSpeed
                ? featuresetData.activationSpeed
                : "Enter a value"
            }
            value={featuresetData.activationSpeed || ""}
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
              onChange={handleDetails}
              options={VehicleTypeoptions}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("vehicleType") ? "p-invalid" : ""
              }`}
              placeholder={
                featuresetData.vehicleType
                  ? featuresetData.vehicleType
                  : "Select an option"
              }
              value={featuresetData.vehicleType}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">OBD</p>
        {invalidFields.includes("obdMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="enable"
              name="obdMode"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.obdMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.obdMode === "Offline"}
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
              placeholder={
                featuresetData.protocolType
                  ? featuresetData.protocolType
                  : "Select an option"
              }
              value={featuresetData.protocolType}
              name="protocolType"
              onChange={handleDetails}
              options={ProtocolTypeoptions}
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
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="online"
              name="tpmsMode"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.tpmsMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.tpmsMode === "Offline"}
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
              placeholder={
                featuresetData.acceleratorType
                  ? featuresetData.acceleratorType
                  : "Select an option"
              }
              value={featuresetData.acceleratorType}
              optionLabel="label"
              optionValue="value"
              name="acceleratorType"
              onChange={handleDetails}
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
              placeholder={
                featuresetData.brakeType
                  ? featuresetData.brakeType
                  : "Select an option"
              }
              value={featuresetData.brakeType}
              optionLabel="label"
              optionValue="value"
              name="brakeType"
              onChange={handleDetails}
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
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="lm_on"
              name="lazerMode"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.lazerMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.lazerMode === "Offline"}
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
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rf_en"
              name="rfSensorMode"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.rfSensorMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.rfSensorMode === "Offline"}
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
              id="rf_angle"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfAngle"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("rfAngle") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.rfAngle}
              placeholder={
                featuresetData.rfAngle
                  ? featuresetData.rfAngle
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="res1">Reserved 1</label>
            <InputText
              id="res1"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="reserved1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("reserved1") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.reserved1}
              placeholder={
                featuresetData.reserved1
                  ? featuresetData.reserved1
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="res2">Reserved 2</label>
            <InputText
              id="res2"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="reserved2"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("reserved2") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.reserved2}
              placeholder={
                featuresetData.reserved2
                  ? featuresetData.reserved2
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="res3">Reserved 3</label>
            <InputText
              id="res3"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="reserved3"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("reserved3") ? "p-invalid" : ""
              }`}
              value={featuresetData.reserved3}
              onChange={handleDetails}
              placeholder={
                featuresetData.reserved3
                  ? featuresetData.reserved3
                  : "Enter a value"
              }
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
              options={SpeedSourceoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              value={featuresetData.speedSource}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full ${
                invalidFields.includes("speedSource") ? "p-invalid" : ""
              }`}
              placeholder={
                featuresetData.speedSource
                  ? featuresetData.speedSource
                  : "Select an option"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="slope">Slope</label>
            <InputText
              id="slope"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="slope"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("slope") ? "p-invalid" : ""
              }`}
              value={featuresetData.slope}
              onChange={handleDetails}
              placeholder={
                featuresetData.slope ? featuresetData.slope : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="offset">Offset</label>
            <InputText
              id="offset"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="offset"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("offset") ? "p-invalid" : ""
              }`}
              value={featuresetData.offset}
              onChange={handleDetails}
              placeholder={
                featuresetData.offset ? featuresetData.offset : "Enter a value"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Shutdown Delay</p>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="delay">Delay</label>
          <InputText
            id="delay"
            keyfilter="pint"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="delay"
            className={`dark:bg-gray-900 ${
              invalidFields.includes("delay") ? "p-invalid" : ""
            }`}
            value={featuresetData.delay}
            onChange={handleDetails}
            placeholder={
              featuresetData.delay ? featuresetData.delay : "Enter a value"
            }
          />
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">RF Name</p>
        {invalidFields.includes("rfNameMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              name="rfNameMode"
              id="rfname_en"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.rfNameMode === "Online"}
            />
            <label htmlFor="rfname_en" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="rfNameMode"
              id="rfname_dis"
              value="Offline"
              onChange={handleDetails}
              checked={featuresetData?.rfNameMode === "Offline"}
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
              id="no_alarm"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarm"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("noAlarm") ? "p-invalid" : ""
              }`}
              value={featuresetData.noAlarm}
              onChange={handleDetails}
              placeholder={
                featuresetData.noAlarm
                  ? featuresetData.noAlarm
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speed">Speed</label>
            <InputText
              id="speed"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("speed") ? "p-invalid" : ""
              }`}
              value={featuresetData.speed}
              onChange={handleDetails}
              placeholder={
                featuresetData.speed ? featuresetData.speed : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc_bypass">Acceleration Bypass</label>
            <InputText
              id="acc_bypass"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationBypass"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("accelerationBypass") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.accelerationBypass}
              placeholder={
                featuresetData.accelerationBypass
                  ? featuresetData.accelerationBypass
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rf">RF Sensor Absent</label>
            <InputText
              id="rf"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfSensorAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("rfSensorAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.rfSensorAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.rfSensorAbsent
                  ? featuresetData.rfSensorAbsent
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="gyro">Gyroscope Absent</label>
            <InputText
              id="gyro"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="gyroscopeAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("gyroscopeAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.gyroscopeAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.gyroscopeAbsent
                  ? featuresetData.gyroscopeAbsent
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="hmi">HMI Absent</label>
            <InputText
              id="hmi"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="hmiAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("hmiAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.hmiAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.hmiAbsent
                  ? featuresetData.hmiAbsent
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tns">Time Not Set</label>
            <InputText
              id="tns"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="timeNotSet"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("timeNotSet") ? "p-invalid" : ""
              }`}
              value={featuresetData.timeNotSet}
              onChange={handleDetails}
              placeholder={
                featuresetData.timeNotSet
                  ? featuresetData.timeNotSet
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc_err">Acceleration Error</label>
            <InputText
              id="acc_err"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationError"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("accelerationError") ? "p-invalid" : ""
              }`}
              value={featuresetData.accelerationError}
              onChange={handleDetails}
              placeholder={
                featuresetData.accelerationError
                  ? featuresetData.accelerationError
                  : "Enter a value"
              }
            />
          </div>

          <div className="field my-3 w-[30vw]">
            <label htmlFor="iot_ab">IoT Absent</label>
            <InputText
              id="iot_ab"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="iotAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("iotAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.iotAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.iotAbsent
                  ? featuresetData.iotAbsent
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_err">Brake Error</label>
            <InputText
              id="brake_err"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeError"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("brakeError") ? "p-invalid" : ""
              }`}
              value={featuresetData.brakeError}
              onChange={handleDetails}
              placeholder={
                featuresetData.brakeError
                  ? featuresetData.brakeError
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tpms_err">TPMS Error</label>
            <InputText
              id="tpms_err"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tpmsError"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("tpmsError") ? "p-invalid" : ""
              }`}
              value={featuresetData.tpmsError}
              onChange={handleDetails}
              placeholder={
                featuresetData.tpmsError
                  ? featuresetData.tpmsError
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sim">OSIM Card Absent</label>
            <InputText
              id="sim"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="simCardAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("simCardAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.simCardAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.simCardAbsent
                  ? featuresetData.simCardAbsent
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="battery">Low battery</label>
            <InputText
              id="battery"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="lowBattery"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("lowBattery") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.lowBattery}
              placeholder={
                featuresetData.lowBattery
                  ? featuresetData.lowBattery
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="trip">Trip Not Started</label>
            <InputText
              id="trip"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tripNotStarted"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("tripNotStarted") ? "p-invalid" : ""
              }`}
              value={featuresetData.tripNotStarted}
              onChange={handleDetails}
              placeholder={
                featuresetData.tripNotStarted
                  ? featuresetData.tripNotStarted
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="bluetooth">Bluetooth Conn Absent</label>
            <InputText
              id="bluetooth"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="bluetoothConnAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("bluetoothConnAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.bluetoothConnAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.bluetoothConnAbsent
                  ? featuresetData.bluetoothConnAbsent
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="obd">OBD Absent</label>
            <InputText
              id="obd"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="obdAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("obdAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.obdAbsent}
              placeholder={
                featuresetData.obdAbsent
                  ? featuresetData.obdAbsent
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="no_alarm_sp">No Alarm</label>
            <InputText
              id="no_alarm_sp"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarmSpeed"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("noAlarmSpeed") ? "p-invalid" : ""
              }`}
              value={featuresetData.noAlarmSpeed}
              onChange={handleDetails}
              placeholder={
                featuresetData.noAlarmSpeed
                  ? featuresetData.noAlarmSpeed
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="laser">Laser Sensor Absent</label>
            <InputText
              id="laser"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="laserSensorAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("laserSensorAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.laserSensorAbsent}
              placeholder={
                featuresetData.laserSensorAbsent
                  ? featuresetData.laserSensorAbsent
                  : "Enter a value"
              }
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfid">RFID Absent</label>
            <InputText
              id="rfid"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfidAbsent"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("rfidAbsent") ? "p-invalid" : ""
              }`}
              value={featuresetData.rfidAbsent}
              onChange={handleDetails}
              placeholder={
                featuresetData.rfidAbsent
                  ? featuresetData.rfidAbsent
                  : "Enter a value"
              }
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Firmware OTA Update</p>
        {invalidFields.includes("firmwareOtaUpdate") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ota_av"
              name="firmwareOtaUpdate"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.firmwareOtaUpdate === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.firmwareOtaUpdate === "Offline"}
            />
            <label htmlFor="ota_nav" className="ml-2">
              Not Available
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label>Reserved 1</label>
            <InputText
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver1") ? "p-invalid" : ""
              }`}
              value={featuresetData.firewarereserver1}
              onChange={handleDetails}
              placeholder={
                featuresetData.firewarereserver1
                  ? featuresetData.firewarereserver1
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Alcohol Detection</p>
        {invalidFields.includes("alcoholDetectionMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="alc_on"
              name="alcoholDetectionMode"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.alcoholDetectionMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.alcoholDetectionMode === "Offline"}
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
              id="alcoholreserved1"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholreserved1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("alcoholreserved1") ? "p-invalid" : ""
              }`}
              value={featuresetData.alcoholreserved1}
              onChange={handleDetails}
              placeholder={
                featuresetData.alcoholreserved1
                  ? featuresetData.alcoholreserved1
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Driver Drowsiness</p>
        {invalidFields.includes("driverDrowsinessMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="my-3 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="drowsi_on"
              name="driverDrowsinessMode"
              value="Online"
              onChange={handleDetails}
              checked={featuresetData?.driverDrowsinessMode === "Online"}
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
              onChange={handleDetails}
              checked={featuresetData?.driverDrowsinessMode === "Offline"}
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
              id="driverreserved1"
              keyfilter="pint"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="driverreserved1"
              className={`dark:bg-gray-900 ${
                invalidFields.includes("driverreserved1") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              value={featuresetData.driverreserved1}
              placeholder={
                featuresetData.driverreserved1
                  ? featuresetData.driverreserved1
                  : "Enter a value"
              }
            />
          </div>
        </div>
        <div className="text-right">
          <Button
            label="Update Feature Set"
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

export default EditFeatureset;
