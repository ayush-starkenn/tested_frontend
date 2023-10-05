import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

const FeatureSet = ({ myData, closeDialog }) => {
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [featuresetDetails, setFeaturesetDetails] = useState({});
  const [featuresetData, setFeaturesetData] = useState({});
  const [invalidFields, setInvalidFields] = useState([]);
  const [checkFeatureset, setCheckFeatureset] = useState(false);
  const [vehicleFeaturesetuuid, setVehicleFeaturesetuuid] = useState("");
  const toastErr = useRef(null);
  const toastRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/vehicle-featureset/get-vehiclefeatureset-vehicle/${myData.vehicle_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.results.length > 0) {
          setVehicleFeaturesetuuid(res.data.results[0].vehiclefeatureset_uuid);
          let latestData = JSON.parse(res.data.results[0].featureset_data);
          setFeaturesetDetails(latestData);
          setFeaturesetData(latestData.featureset_data);
          setCheckFeatureset(true);
        } else {
          axios
            .get(
              `http://localhost:8080/api/featuresets/get-featureset/${myData.featureset_uuid}`,
              {
                headers: { authorization: `bearer ${token}` },
              }
            )
            .then((res) => {
              setFeaturesetDetails(res.data.results[0]);
              setFeaturesetData(
                JSON.parse(res.data.results[0].featureset_data)
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [myData.vehicle_uuid, myData.featureset_uuid, token]);

  //Handle Change Function

  const handleDetails = (e) => {
    const { name, value } = e.target;
    setFeaturesetData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //handle Submit Function
  const handleSubmit = (e) => {
    e.preventDefault();
    const invalidFieldsArray = [];

    // Check for empty or unselected fields and add to the invalidFieldsArray
    if (!featuresetDetails.featureset_name) {
      invalidFieldsArray.push("featureset_name");
    }

    const requiredFields = [
      "mode",
      "CASMode",
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
      "start_time",
      "stop_time",
      // // sleep alert
      "sleepAlertMode",
      "preWarning",
      "sleepAlertInterval",
      "sa_activationSpeed",
      "startTime",
      "stopTime",
      "brakeActivateTime",
      "braking",
      //Driver Evaluation
      "driverEvalMode",
      "maxLaneChangeThreshold",
      "minLaneChangeThreshold",
      "maxHarshAccelerationThreshold",
      "minHarshAccelerationThreshold",
      "suddenBrakingThreshold",
      "maxSpeedBumpThreshold",
      "minSpeedBumpThreshold",
      //speed Governer
      "GovernerMode",
      "speedLimit",
      //Cruize
      "cruiseMode",
      "cruiseactivationSpeed",
      "vehicleType",
      //OBD
      "obdMode",
      "protocolType",
      //TPMS
      "tpmsMode",
      //Vehicle settings
      "acceleratorType",
      "VS_brk_typ",
      "VS_gyro_type",
      //SENSOR
      "lazerMode",
      "rfSensorMode",
      "rfAngle",
      "rdr_act_spd",
      "rdr_type",
      "Sensor_res1",
      //speed settings
      "speedSource",
      "slope",
      "offset",
      //shutdown delay
      "delay",
      //RF name
      "rfNameMode",
      //Time based errors
      "noAlarm",
      "speed",
      "accelerationBypass",
      "tim_err_tpms",
      //spd based errors
      "rfSensorAbsent",
      "gyroscopeAbsent",
      "hmiAbsent",
      "timeNotSet",
      "brakeError",
      "tpmsError",
      "obdAbsent",
      "noAlarmSpeed",
      "laserSensorAbsent",
      "rfidAbsent",
      "iotAbsent",
      "acc_board",
      "SBE_dd",
      "SBE_alcohol",
      "SBE_temp",
      //Firmware OTA
      "firmwareOtaUpdate",
      "firewarereserver1",
      "firewarereserver2",
      //Alcohol Detection
      "alcoholDetectionMode",
      "alcoholinterval",
      "alcoholact_spd",
      "alcoholstart_time",
      "alcoholstop_time",
      "alcoholmode",
      //Driver Drowsiness
      "driverDrowsinessMode",
      "dd_act_spd",
      "dd_acc_cut",
      "dd_strt_tim",
      "dd_stop_tim",
      "dd_res1",
      //Load Sensor
      "load_sts",
      "load_max_cap",
      "load_acc",
      //Fuel
      "fuelMode",
      "fuel_tnk_cap",
      "fuel_intvl1",
      "fuel_intvl2",
      "fuel_acc",
      "fuel_thrsh",
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
    if (checkFeatureset === false) {
      const postData = {
        user_uuid: user_uuid,
        featureset_name: featuresetDetails?.featureset_name,
        featureset_version: featuresetDetails?.featureset_version,
        featureset_status: featuresetDetails?.featureset_status,
        featureset_data: featuresetData,
      };
      console.log(postData.featureset_version, postData.featureset_status);
      const strigifyData = JSON.stringify(postData);

      const editData = {
        user_uuid,
        vehicle_uuid: myData.vehicle_uuid,
        featureset_data: strigifyData,
      };

      axios
        .post(
          "http://localhost:8080/api/vehicle-featureset/add-vehiclefeatureset",
          editData,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: `Vehicle Feature Set  added successfully`,
            life: 3000,
          });
          setTimeout(() => {
            closeDialog();
          }, 3500);
        })
        .catch((err) => {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "An error occurred. Please try again later.",
            life: 3000,
          });
        });
    } else {
      //make the edit request

      const postData = {
        user_uuid: user_uuid,
        featureset_name: featuresetDetails?.featureset_name,
        featureset_version: featuresetDetails?.featureset_version,
        featureset_status: featuresetDetails?.featureset_status,
        featureset_data: featuresetData,
      };
      console.log(postData.featureset_version, postData.featureset_status);
      const strigifyData = JSON.stringify(postData);

      const editData = {
        user_uuid,
        vehicle_uuid: myData.vehicle_uuid,
        featureset_data: strigifyData,
      };
      axios
        .put(
          `http://localhost:8080/api/vehicle-featureset/edit-vehiclefeatureset/${vehicleFeaturesetuuid}`,
          editData,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: `Vehicle Feature Set  edited successfully`,
            life: 3000,
          });
          setTimeout(() => {
            closeDialog();
          }, 3500);
        })
        .catch((err) => {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "An error occurred. Please try again later.",
            life: 3000,
          });
        });
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
  const BrakingOptions = [
    {
      label: "Internal Braking",
      value: 1,
    },
    {
      label: "PWN Braking",
      value: 2,
    },
    {
      label: "Actuator Braking",
      value: 3,
    },
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

  const GyroOptions = [
    {
      label: "External Gyro",
      value: 1,
    },
    {
      label: "inbuild Gyro",
      value: 2,
    },
    {
      label: "Steering Gyro",
      value: 3,
    },
  ];
  const radarOptions = [
    { label: "Radar 1", value: 1 },
    { label: "Radar 2", value: 2 },
    { label: "Radar 3", value: 3 },
  ];
  const alcothreshOptions = [
    { label: "Relaxed", value: 1 },
    { label: "Normal", value: 2 },
    { label: "Strict", value: 3 },
  ];

  //edit dialog
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} />
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="mt-2 flex flex-col">
            <label htmlFor="username">Feature Set Name</label>
            <InputText
              id="username"
              style={{
                width: "63vw",
                borderRadius: "5px",
              }}
              name="featureset_name"
              disabled
              value={featuresetDetails?.featureset_name}
            />
            <small id="username-help">Unique id to identify feature set</small>
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="username">Featureset Version</label>
            <InputText
              id="featuerset_version"
              keyfilter="pint"
              style={{
                width: "63vw",
                borderRadius: "5px",
              }}
              name="featuerset_version"
              placeholder="Featureset Version"
              disabled
              value={featuresetDetails?.featureset_version}
            />
            <small id="username-help">Featureset version</small>
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="username">Featureset Status</label>
            <Tag
              id="featuerset_version"
              style={{
                width: "fit-content",
                borderRadius: "5px",
                padding: "3px 15px",
              }}
              severity={`${
                featuresetDetails.featureset_status === 1 ? "success" : "danger"
              }`}
              name="featuerset_status"
              disabled
              value={`${
                featuresetDetails.featureset_status === 1
                  ? "Active"
                  : "Deactive"
              }`}
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
                value={1}
                checked={featuresetData?.mode === "1"}
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
                value={0}
                checked={featuresetData?.mode === "0"}
              />
              <label htmlFor="ingredient1" className="ml-2">
                Offline Mode
              </label>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Collision Avoidance System</p>
        {invalidFields.includes("CASMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="card justify-content-center mb-3 mt-2 flex gap-4">
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value={1}
              checked={featuresetData?.CASMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value={0}
              checked={featuresetData?.CASMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="activationSpeed">Activation Speed</label>
            <InputText
              keyfilter="pint"
              id="activationSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed") ? "p-invalid" : ""
              }`}
              placeholder={
                featuresetData?.activationSpeed
                  ? featuresetData?.activationSpeed
                  : "Enter a value"
              }
              name="activationSpeed"
              onChange={handleDetails}
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alarmThreshold">Alarm Threshold</label>
            <InputText
              keyfilter="pint"
              id="alarmThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.alarmThreshold
                  ? featuresetData.alarmThreshold
                  : "Enter a value"
              }
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alarmThreshold") ? "p-invalid" : ""
              }`}
              name="alarmThreshold"
              onChange={handleDetails}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeThreshold">Brake Threshold</label>
            <InputText
              keyfilter="pint"
              id="brakeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.brakeThreshold
                  ? featuresetData.brakeThreshold
                  : "Enter a value"
              }
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeThreshold") ? "p-invalid" : ""
              }`}
              name="brakeThreshold"
              onChange={handleDetails}
              autoComplete="off"
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
              name="brakeSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[63vw]">
            <label htmlFor="detectStationaryObject">
              Detect Stationary Object
            </label>
            <Dropdown
              id="detectStationaryObject"
              options={StationaryObjectoptions}
              optionLabel="label"
              optionValue="value"
              placeholder={
                featuresetData.detectStationaryObject
                  ? `Selected: ${featuresetData.detectStationaryObject}`
                  : "Select an option"
              }
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="detectStationaryObject"
              onChange={handleDetails}
              value={featuresetData.detectStationaryObject}
              className={`md:w-14rem  $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("detectStationaryObject")
                  ? "p-invalid"
                  : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="allowCompleteBrake">Allow Complete Brake</label>
            <Dropdown
              name="allowCompleteBrake"
              onChange={handleDetails}
              id="allowCompleteBrake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={CompleteBrakeoptions}
              placeholder={
                featuresetData.allowCompleteBrake
                  ? featuresetData.allowCompleteBrake
                  : "Select an option"
              }
              value={featuresetData.allowCompleteBrake}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("allowCompleteBrake") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[63vw]">
            <label htmlFor="detectOncomingObstacle">
              Detect Oncoming Obstacle
            </label>
            <Dropdown
              name="detectOncomingObstacle"
              id="detectOncomingObstacle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={OncomingObstacleptions}
              value={featuresetData.detectOncomingObstacle}
              placeholder={
                featuresetData.detectOncomingObstacles
                  ? featuresetData.detectOncomingObstacles
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("detectOncomingObstacle")
                  ? "p-invalid"
                  : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="safetyMode">Safety Mode</label>
            <Dropdown
              name="safetyMode"
              id="safetyMode"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={SafetyModeoptions}
              value={featuresetData.safetyMode}
              placeholder={
                featuresetData.safetyMode
                  ? featuresetData.safetyMode
                  : "Select an option"
              }
              onChange={handleDetails}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("safetyMode") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ttcThreshold">TTC Threshold</label>
            <InputText
              keyfilter="pint"
              id="ttcThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.ttcThreshold
                  ? featuresetData.ttcThreshold
                  : "Enter a value"
              }
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("ttcThreshold") ? "p-invalid" : ""
              }`}
              name="ttcThreshold"
              onChange={handleDetails}
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeOnDuration">Brake ON Duration</label>
            <InputText
              keyfilter="pint"
              id="brakeOnDuration"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOnDuration"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeOnDuration") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.brakeOnDuration
                  ? featuresetData.brakeOnDuration
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeOffDuration">Brake OFF Duration</label>
            <InputText
              keyfilter="pint"
              id="brakeOffDuration"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOffDuration"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeOffDuration") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.brakeOffDuration
                  ? featuresetData.brakeOffDuration
                  : "Enter a value"
              }
              autoComplete="off"
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
              name="start_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("start_time") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.start_time
                  ? featuresetData.start_time
                  : "Enter a value"
              }
              autoComplete="off"
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
              name="stop_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("stop_time") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.stop_time
                  ? featuresetData.stop_time
                  : "Enter a value"
              }
              autoComplete="off"
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
              onChange={handleDetails}
              value={1}
              checked={featuresetData?.sleepAlertMode === "1"}
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
              value={0}
              checked={featuresetData?.sleepAlertMode === "0"}
            />
            <label htmlFor="op1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="preWarning">Pre Warning</label>
            <InputText
              keyfilter="pint"
              id="preWarning"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder={
                featuresetData.preWarning
                  ? featuresetData.preWarning
                  : "Enter a value"
              }
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("preWarning") ? "p-invalid" : ""
              }`}
              name="preWarning"
              onChange={handleDetails}
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sleepAlertInterval">Sleep Alert Interval</label>
            <InputText
              keyfilter="pint"
              id="sleepAlertInterval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sleepAlertInterval"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("sleepAlertInterval") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.sleepAlertInterval
                  ? featuresetData.sleepAlertInterval
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sa_activationSpeed">Activation Speed</label>
            <InputText
              keyfilter="pint"
              id="sa_activationSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sa_activationSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("sa_activationSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.activationSpeed
                  ? featuresetData.activationSpeed
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="startTime">Start Time</label>
            <InputText
              keyfilter="pint"
              id="startTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="startTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("startTime") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.startTime
                  ? featuresetData.startTime
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stopTime">Stop Time</label>
            <InputText
              keyfilter="pint"
              id="stopTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stopTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("stopTime") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.stopTime
                  ? featuresetData.stopTime
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeActivateTime">Brake Activate Time</label>
            <InputText
              keyfilter="pint"
              id="brakeActivateTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeActivateTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeActivateTime") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.brakeActivateTime
                  ? featuresetData.brakeActivateTime
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="braking">Braking</label>
            <Dropdown
              name="braking"
              value={featuresetData.braking}
              onChange={handleDetails}
              id="braking"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={BrakingOptions}
              placeholder={
                featuresetData.braking
                  ? featuresetData.braking
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
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
              id="driverEvalMode"
              name="driverEvalMode"
              value={1}
              checked={featuresetData?.driverEvalMode === "1"}
              onChange={handleDetails}
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
              value={0}
              checked={featuresetData?.driverEvalMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxLaneChangeThreshold">
              Max Lane Change Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="maxLaneChangeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxLaneChangeThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
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
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minLaneChangeThreshold">
              Min Lane Change Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="minLaneChangeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minLaneChangeThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minLaneChangeThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.minLaneChangeThreshold
                  ? featuresetData.minLaneChangeThreshold
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxHarshAccelerationThreshold">
              Max Harsh Acceleration Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="maxHarshAccelerationThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxHarshAccelerationThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxHarshAccelerationThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.maxHarshAccelerationThreshold
                  ? featuresetData.maxHarshAccelerationThreshold
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minHarshAccelerationThreshold">
              Min Harsh Acceleration Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="minHarshAccelerationThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minHarshAccelerationThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minHarshAccelerationThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.minHarshAccelerationThreshold
                  ? featuresetData.minHarshAccelerationThreshold
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="suddenBrakingThreshold">
              Sudden Braking Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="suddenBrakingThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="suddenBrakingThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("suddenBrakingThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.suddenBrakingThreshold
                  ? featuresetData.suddenBrakingThreshold
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxSpeedBumpThreshold">
              Max Speed Bump Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="maxSpeedBumpThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxSpeedBumpThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxSpeedBumpThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.maxSpeedBumpThreshold
                  ? featuresetData.maxSpeedBumpThreshold
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minSpeedBumpThreshold">
              Min Speed Bump Threshold
            </label>
            <InputText
              keyfilter="pint"
              id="minSpeedBumpThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minSpeedBumpThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minSpeedBumpThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.minSpeedBumpThreshold
                  ? featuresetData.minSpeedBumpThreshold
                  : "Enter a value"
              }
              autoComplete="off"
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
              id="GovernerMode"
              onChange={handleDetails}
              name="GovernerMode"
              value={1}
              checked={featuresetData?.GovernerMode === "1"}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="GovernerMode"
              name="GovernerMode"
              value={0}
              checked={featuresetData?.GovernerMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speedLimit">Speed Limit</label>
            <InputText
              keyfilter="pint"
              id="speedLimit"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedLimit"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("speedLimit") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.speedLimit
                  ? featuresetData.speedLimit
                  : "Enter a value"
              }
              autoComplete="off"
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
              id="cruiseMode"
              name="cruiseMode"
              value={1}
              onChange={handleDetails}
              checked={featuresetData?.cruiseMode === "1"}
            />
            <label htmlFor="mode2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="cruiseMode"
              onChange={handleDetails}
              name="cruiseMode"
              value={0}
              checked={featuresetData?.cruiseMode === "0"}
            />
            <label htmlFor="mode1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="cruiseactivationSpeed">Activation Speed</label>
          <InputText
            keyfilter="pint"
            id="cruiseactivationSpeed"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="cruiseactivationSpeed"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("cruiseactivationSpeed") ? "p-invalid" : ""
            }`}
            onChange={handleDetails}
            placeholder={
              featuresetData.cruiseactivationSpeed
                ? featuresetData.cruiseactivationSpeed
                : "Enter a value"
            }
            autoComplete="off"
          />
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <Dropdown
              id="vehicleType"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="vehicleType"
              onChange={handleDetails}
              options={VehicleTypeoptions}
              value={featuresetData.vehicleType}
              placeholder={
                featuresetData.vehicleType
                  ? featuresetData.vehicleType
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
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
              value={1}
              checked={featuresetData?.obdMode === "1"}
              onChange={handleDetails}
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
              value={0}
              checked={featuresetData?.obdMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="disable" className="ml-2">
              Disable
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="protocolType">Protocol Type</label>
            <Dropdown
              id="protocolType"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="protocolType"
              onChange={handleDetails}
              options={ProtocolTypeoptions}
              value={featuresetData.protocolType}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("protocolType") ? "p-invalid" : ""
              }`}
              placeholder={
                featuresetData.protocolType
                  ? featuresetData.protocolType
                  : "Select an option"
              }
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
              id="tpmsMode"
              name="tpmsMode"
              value={1}
              onChange={handleDetails}
              checked={featuresetData?.tpmsMode === "1"}
            />
            <label htmlFor="online" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="tpmsMode"
              id="tpmsMode"
              value={0}
              checked={featuresetData?.tpmsMode === "0"}
              onChange={handleDetails}
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
            <label htmlFor="acceleratorType">Accelerator Type</label>
            <Dropdown
              id="acceleratorType"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={featuresetData.acceleratorType}
              placeholder={
                featuresetData.acceleratorType
                  ? featuresetData.acceleratorType
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              name="acceleratorType"
              onChange={handleDetails}
              options={AcceleratorTypeoptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("acceleratorType") ? "p-invalid" : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="VS_brk_typ">Braking Type</label>
            <Dropdown
              id="VS_brk_typ"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={featuresetData.VS_brk_typ}
              placeholder={
                featuresetData.VS_brk_typ
                  ? featuresetData.VS_brk_typ
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              name="VS_brk_typ"
              onChange={handleDetails}
              options={BrakeTypeoptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("VS_brk_typ") ? "p-invalid" : ""
              }`}
            />
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="VS_gyro_type">Gyro Type</label>
          <Dropdown
            id="VS_gyro_type"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            value={featuresetData.VS_gyro_type}
            placeholder={
              featuresetData.VS_gyro_type
                ? featuresetData.VS_gyro_type
                : "Select an option"
            }
            optionLabel="label"
            optionValue="value"
            name="VS_gyro_type"
            onChange={handleDetails}
            options={GyroOptions}
            className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
              invalidFields.includes("VS_gyro_type") ? "p-invalid" : ""
            }`}
          />
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
              id="lazerMode"
              name="lazerMode"
              value={1}
              checked={featuresetData?.lazerMode === "1"}
              onChange={handleDetails}
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
              value={0}
              checked={featuresetData?.lazerMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="lazerMode" className="ml-2">
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
              id="rfSensorMode"
              name="rfSensorMode"
              value={1}
              checked={featuresetData?.rfSensorMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="rfSensorMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rf_dis"
              name="rfSensorMode"
              value={0}
              checked={featuresetData?.rfSensorMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="rfSensorMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfAngle">RF Angle</label>
            <InputText
              keyfilter="pint"
              id="rfAngle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfAngle"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfAngle") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.rfAngle
                  ? featuresetData.rfAngle
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rdr_act_spd">Radar activation speed</label>
            <InputText
              keyfilter="pint"
              id="rdr_act_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rdr_act_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rdr_act_spd") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.rdr_act_spd
                  ? featuresetData.rdr_act_spd
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rdr_type">Radar type</label>
            <Dropdown
              id="rdr_type"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rdr_type"
              value={featuresetData.rdr_type}
              placeholder={
                featuresetData.rdr_type
                  ? featuresetData.rdr_type
                  : "Enter a value"
              }
              options={radarOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("rdr_type") ? "p-invalid" : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="Sensor_res1">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="Sensor_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="Sensor_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("Sensor_res1") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.Sensor_res1
                  ? featuresetData.Sensor_res1
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Settings</p>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speedSource">Speed Source</label>
            <Dropdown
              id="speedSource"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedSource"
              value={featuresetData.speedSource}
              placeholder={
                featuresetData.speedSource
                  ? featuresetData.speedSource
                  : "Enter a value"
              }
              options={SpeedSourceoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
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
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("slope") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.slope ? featuresetData.slope : "Enter a value"
              }
              autoComplete="off"
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
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("offset") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.offset ? featuresetData.offset : "Enter a value"
              }
              autoComplete="off"
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
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("delay") ? "p-invalid" : ""
            }`}
            onChange={handleDetails}
            placeholder={
              featuresetData.delay ? featuresetData.delay : "Enter a value"
            }
            autoComplete="off"
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
              id="rfNameMode"
              name="rfNameMode"
              value={1}
              checked={featuresetData?.rfNameMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="rfNameMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rfNameMode"
              name="rfNameMode"
              value={0}
              checked={featuresetData?.rfNameMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="rfNameMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Time Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="noAlarm">No Alarm</label>
            <InputText
              keyfilter="pint"
              id="noAlarm"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarm"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("noAlarm") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.noAlarm
                  ? featuresetData.noAlarm
                  : "Enter a value"
              }
              autoComplete="off"
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
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("speed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.speed ? featuresetData.speed : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="accelerationBypass">Acceleration Bypass</label>
            <InputText
              keyfilter="pint"
              id="accelerationBypass"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationBypass"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("accelerationBypass") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.accelerationBypass
                  ? featuresetData.accelerationBypass
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tim_err_tpms">TPMS</label>
            <InputText
              keyfilter="pint"
              id="tim_err_tpms"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tim_err_tpms"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("tim_err_tpms") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.tim_err_tpms
                  ? featuresetData.tim_err_tpms
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfSensorAbsent">RF Sensor Absent</label>
            <InputText
              keyfilter="pint"
              id="rfSensorAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfSensorAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfSensorAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.rfSensorAbsent
                  ? featuresetData.rfSensorAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="gyroscopeAbsent">Gyroscope Absent</label>
            <InputText
              keyfilter="pint"
              id="gyroscopeAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="gyroscopeAbsent"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("gyroscopeAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.gyroscopeAbsent
                  ? featuresetData.gyroscopeAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="hmiAbsent">HMI Absent</label>
            <InputText
              keyfilter="pint"
              id="hmiAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="hmiAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("hmiAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.hmiAbsent
                  ? featuresetData.hmiAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="timeNotSet">Time Not Set</label>
            <InputText
              keyfilter="pint"
              id="timeNotSet"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="timeNotSet"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("timeNotSet") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.timeNotSet
                  ? featuresetData.timeNotSet
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeError">Brake Error</label>
            <InputText
              keyfilter="pint"
              id="brakeError"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeError"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeError") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.brakeError
                  ? featuresetData.brakeError
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>

          <div className="field my-3 w-[30vw]">
            <label htmlFor="tpmsError">TPMS Error</label>
            <InputText
              keyfilter="pint"
              id="tpmsError"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tpmsError"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("tpmsError") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.tpmsError
                  ? featuresetData.tpmsError
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="obdAbsent">OBD Absent</label>
            <InputText
              keyfilter="pint"
              id="obdAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="obdAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("obdAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.obdAbsent
                  ? featuresetData.obdAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="noAlarmSpeed">No Alarm</label>
            <InputText
              keyfilter="pint"
              id="noAlarmSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarmSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("noAlarmSpeed") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.noAlarmSpeed
                  ? featuresetData.noAlarmSpeed
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="laserSensorAbsent">Laser Sensor Absent</label>
            <InputText
              keyfilter="pint"
              id="laserSensorAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="laserSensorAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("laserSensorAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.laserSensorAbsent
                  ? featuresetData.laserSensorAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfidAbsent">RFID Absent</label>
            <InputText
              keyfilter="pint"
              id="rfidAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfidAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfidAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.rfidAbsent
                  ? featuresetData.rfidAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="iotAbsent">IoT Absent</label>
            <InputText
              keyfilter="pint"
              id="iotAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="iotAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("iotAbsent") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.iotAbsent
                  ? featuresetData.iotAbsent
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc_board">Accessory Board</label>
            <InputText
              keyfilter="pint"
              id="acc_board"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="acc_board"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("acc_board") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.acc_board
                  ? featuresetData.acc_board
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_dd">Driver Drowsiness</label>
            <InputText
              keyfilter="pint"
              id="SBE_dd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_dd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_dd") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.SBE_dd ? featuresetData.SBE_dd : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_alcohol">Alcohol Sensor</label>
            <InputText
              keyfilter="pint"
              id="SBE_alcohol"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_alcohol"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_alcohol") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.SBE_alcohol
                  ? featuresetData.SBE_alcohol
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_temp">Temperature Sensor</label>
            <InputText
              keyfilter="pint"
              id="SBE_temp"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_temp"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_temp") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.SBE_temp
                  ? featuresetData.SBE_temp
                  : "Enter a value"
              }
              autoComplete="off"
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
              id="firmwareOtaUpdate"
              name="firmwareOtaUpdate"
              value={1}
              checked={featuresetData?.firmwareOtaUpdate === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="firmwareOtaUpdate" className="ml-2">
              Available
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ota_nav"
              name="firmwareOtaUpdate"
              value={0}
              checked={featuresetData?.firmwareOtaUpdate === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="ota_nav" className="ml-2">
              Not Available
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="firewarereserver1">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="firewarereserver1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver1") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.firewarereserver1
                  ? featuresetData.firewarereserver1
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="firewarereserver2">Reserved 2</label>
            <InputText
              keyfilter="pint"
              id="firewarereserver2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver2") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.firewarereserver2
                  ? featuresetData.firewarereserver2
                  : "Enter a value"
              }
              autoComplete="off"
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
              value={1}
              checked={featuresetData?.alcoholDetectionMode === "1"}
              onChange={handleDetails}
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
              value={0}
              checked={featuresetData?.alcoholDetectionMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="alc_off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholinterval">Interval</label>
            <InputText
              keyfilter="pint"
              id="alcoholinterval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholinterval"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholinterval") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.alcoholinterval
                  ? featuresetData.alcoholinterval
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholact_spd">Activation Speed</label>
            <InputText
              keyfilter="pint"
              id="alcoholact_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholact_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholact_spd") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.alcoholact_spd
                  ? featuresetData.alcoholact_spd
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholstart_time">Start time</label>
            <InputText
              keyfilter="pint"
              id="alcoholstart_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholstart_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholstart_time") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.alcoholstart_time
                  ? featuresetData.alcoholstart_time
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholstop_time">Stop time</label>
            <InputText
              keyfilter="pint"
              id="alcoholstop_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholstop_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholstop_time") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.alcoholstop_time
                  ? featuresetData.alcoholstop_time
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholmode">Alcohol Threshold Mode</label>
            <Dropdown
              id="alcoholmode"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholmode"
              value={featuresetData.alcoholmode}
              placeholder={
                featuresetData.alcoholmode
                  ? featuresetData.alcoholmode
                  : "Enter a value"
              }
              options={alcothreshOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("alcoholmode") ? "p-invalid" : ""
              }`}
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
              id="driverDrowsinessMode"
              name="driverDrowsinessMode"
              value={1}
              checked={featuresetData?.driverDrowsinessMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="driverDrowsinessMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="driverDrowsinessMode"
              name="driverDrowsinessMode"
              value={0}
              checked={featuresetData?.driverDrowsinessMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="drowsi_off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_act_spd">Activation Speed</label>
            <InputText
              keyfilter="pint"
              id="dd_act_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_act_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_act_spd") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.dd_act_spd
                  ? featuresetData.dd_act_spd
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_acc_cut">ACC Cut Status</label>
            <InputText
              keyfilter="pint"
              id="dd_acc_cut"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_acc_cut"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_acc_cut") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.dd_acc_cut
                  ? featuresetData.dd_acc_cut
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_strt_tim">Start Time</label>
            <InputText
              keyfilter="pint"
              id="dd_strt_tim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_strt_tim"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_strt_tim") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.dd_strt_tim
                  ? featuresetData.dd_strt_tim
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_stop_tim">Stop Time</label>
            <InputText
              keyfilter="pint"
              id="dd_stop_tim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_stop_tim"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_stop_tim") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.dd_stop_tim
                  ? featuresetData.dd_stop_tim
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_res1">Reserved 1</label>
            <InputText
              keyfilter="pint"
              id="dd_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_res1") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.dd_res1
                  ? featuresetData.dd_res1
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Load Sensor</p>
        {invalidFields.includes("load_sts") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="load_sts"
              name="load_sts"
              value={1}
              checked={featuresetData?.load_sts === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="load_sts" className="ml-2">
              Available
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="load_sts"
              name="load_sts"
              value={0}
              checked={featuresetData?.load_sts === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="load_sts" className="ml-2">
              Not Available
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="load_max_cap">Max Capacity</label>
            <InputText
              keyfilter="pint"
              id="load_max_cap"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="load_max_cap"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("load_max_cap") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.load_max_cap
                  ? featuresetData.load_max_cap
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="load_acc">Accelerator</label>
            <InputText
              keyfilter="pint"
              id="load_acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="load_acc"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("load_acc") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.load_acc
                  ? featuresetData.load_acc
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Fuel</p>
        {invalidFields.includes("fuelMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="fuelMode"
              name="fuelMode"
              value={1}
              checked={featuresetData?.fuelMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="fuelMode" className="ml-2">
              Available
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="fuelMode"
              name="fuelMode"
              value={0}
              checked={featuresetData?.fuelMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="fuelMode" className="ml-2">
              Not Available
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_tnk_cap">Tank Capacity</label>
            <InputText
              keyfilter="pint"
              id="fuel_tnk_cap"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_tnk_cap"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_tnk_cap") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.fuel_tnk_cap
                  ? featuresetData.fuel_tnk_cap
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_intvl1">Interval 1</label>
            <InputText
              keyfilter="pint"
              id="fuel_intvl1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_intvl1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_intvl1") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.fuel_intvl1
                  ? featuresetData.fuel_intvl1
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_intvl2">Interval 2</label>
            <InputText
              keyfilter="pint"
              id="fuel_intvl2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_intvl2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_intvl2") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.fuel_intvl2
                  ? featuresetData.fuel_intvl2
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_acc">Acc Cut</label>
            <InputText
              keyfilter="pint"
              id="fuel_acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_acc"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_acc") ? "p-invalid" : ""
              }`}
              onChange={handleDetails}
              placeholder={
                featuresetData.fuel_acc
                  ? featuresetData.fuel_acc
                  : "Enter a value"
              }
              autoComplete="off"
            />
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="fuel_thrsh">Threshold</label>
          <InputText
            keyfilter="pint"
            id="fuel_thrsh"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="fuel_thrsh"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("fuel_thrsh") ? "p-invalid" : ""
            }`}
            onChange={handleDetails}
            placeholder={
              featuresetData.fuel_thrsh
                ? featuresetData.fuel_thrsh
                : "Enter a value"
            }
            autoComplete="off"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-2 text-white dark:bg-gray-150 dark:font-bold dark:text-blue-800"
          >
            Edit Feature Set
          </button>
        </div>
      </form>
    </>
  );
};

export default FeatureSet;
