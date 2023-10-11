import React, { useContext, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import axios from "axios";
import { AppContext } from "context/AppContext";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";

const AddFeatureSet = ({ onSuccess }) => {
  const [data, setData] = useState({});
  const [values, setvalues] = useState({
    mode: "1",
    CASMode: "1",
    activationSpeed: "10",
    alarmThreshold: "2",
    brakeThreshold: "0.5",
    brakeSpeed: "40",
    detectStationaryObject: "1",
    allowCompleteBrake: "1",
    detectOncomingObstacle: "1",
    safetyMode: "Normal",
    ttcThreshold: "10",
    brakeOnDuration: "1000",
    brakeOffDuration: "1000",
    start_time: "12",
    stop_time: "12",
    // // sleep alert
    sleepAlertMode: "1",
    preWarning: "5",
    sleepAlertInterval: "60",
    sa_activationSpeed: "40",
    startTime: "23",
    stopTime: "6",
    brakeActivateTime: "10",
    braking: "1",
    //Driver Evaluation
    driverEvalMode: "1",
    maxLaneChangeThreshold: "0.35",
    minLaneChangeThreshold: "-0.35",
    maxHarshAccelerationThreshold: "0.25",
    minHarshAccelerationThreshold: "-0.4",
    suddenBrakingThreshold: "-0.4",
    maxSpeedBumpThreshold: "0.5",
    minSpeedBumpThreshold: "-0.5",
    //speed Governer
    GovernerMode: "1",
    speedLimit: "100",
    //Cruize
    cruiseMode: "1",
    cruiseactivationSpeed: "40",
    vehicleType: "12V Pedal",
    //OBD
    obdMode: "1",
    protocolType: "SAEJ1939",
    //TPMS
    tpmsMode: "1",
    //Vehicle settings
    acceleratorType: "Sensor",
    VS_brk_typ: "1",
    VS_gyro_type: "1",
    //SENSOR
    lazerMode: "1",
    rfSensorMode: "1",
    rfAngle: "0",
    rdr_act_spd: "40",
    rdr_type: "1",
    Sensor_res1: "1",
    //speed settings
    speedSource: "Speed Wire",
    slope: "4.5",
    offset: "0.5",
    //shutdown delay
    delay: "30",
    //RF name
    rfNameMode: "1",
    //Time based errors
    noAlarm: "30",
    speed: "30",
    accelerationBypass: "10",
    tim_err_tpms: "1",
    //spd based errors
    rfSensorAbsent: "60",
    gyroscopeAbsent: "60",
    hmiAbsent: "60",
    timeNotSet: "59",
    brakeError: "60",
    tpmsError: "60",
    obdAbsent: "60",
    noAlarmSpeed: "60",
    laserSensorAbsent: "60",
    rfidAbsent: "60",
    iotAbsent: "60",
    acc_board: "60",
    SBE_dd: "60",
    SBE_alcohol: "60",
    SBE_temp: "60",
    //Firmware OTA
    firmwareOtaUpdate: "1",
    firewarereserver1: "0",
    firewarereserver2: "0",
    //Alcohol Detection
    alcoholDetectionMode: "1",
    alcoholinterval: "10",
    alcoholact_spd: "40",
    alcoholstart_time: "12",
    alcoholstop_time: "12",
    alcoholmode: "1",
    //Driver Drowsiness
    driverDrowsinessMode: "1",
    dd_act_spd: "40",
    dd_acc_cut: "50",
    dd_strt_tim: "12",
    dd_stop_tim: "12",
    dd_res1: "0",
    //Load Sensor
    load_sts: "1",
    load_max_cap: "10",
    load_acc: "10",
    //Fuel
    fuelMode: "1",
    fuel_tnk_cap: "100",
    fuel_intvl1: "0",
    fuel_intvl2: "0",
    fuel_acc: "10",
    fuel_thrsh: "10",
  });
  const toastRef = useRef(null);
  const toastErr = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const { updateFunc } = useContext(AppContext);
  const [selectedValue, setSelectedValue] = useState("");
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
        setListCustomers(res.data.customerData);
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
    setInvalidFields(
      invalidFields.filter((field) => field !== "featureset_users")
    );
  };

  //validate form function

  function validateForm(data, values) {
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
      "load_tak_cap",
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
    const invalidFieldsArray = [];

    for (const field of requiredFields) {
      if (!values[field]) {
        invalidFieldsArray.push(field);
      }
    }

    if (!data.featureset_name) {
      invalidFieldsArray.push("featureset_name");
    }
    if (!customers.length) {
      invalidFieldsArray.push("featureset_users");
    }

    if (values.activationSpeed < 0 || values.activationSpeed > 150) {
      invalidFieldsArray.push("activationSpeed");
    }

    if (values.alarmThreshold < 0 || values.alarmThreshold > 10) {
      invalidFieldsArray.push("alarmThreshold");
    }

    if (values.brakeThreshold < 0 || values.brakeThreshold > 10) {
      invalidFieldsArray.push("brakeThreshold");
    }

    if (values.brakeSpeed < 0 || values.brakeSpeed >= 150) {
      invalidFieldsArray.push("brakeSpeed");
    }
    if (values.ttcThreshold < 0 || values.ttcThreshold > 99.99) {
      invalidFieldsArray.push("ttcThreshold");
    }
    if (values.brakeOnDuration < 0 || values.brakeOnDuration > 9999.99) {
      invalidFieldsArray.push("brakeOnDuration");
    }
    if (values.brakeOffDuration < 0 || values.brakeOffDuration > 9999.99) {
      invalidFieldsArray.push("brakeOffDuration");
    }
    if (values.start_time < 0 || values.start_time > 24) {
      invalidFieldsArray.push("start_time");
    }
    if (values.stop_time < 0 || values.stop_time > 24) {
      invalidFieldsArray.push("stop_time");
    }
    //sleep alert
    if (values.preWarning < 0 || values.preWarning > 50) {
      invalidFieldsArray.push("preWarning");
    }
    if (values.sleepAlertInterval < 0 || values.sleepAlertInterval > 999) {
      invalidFieldsArray.push("sleepAlertInterval");
    }
    if (values.sa_activationSpeed < 0 || values.sa_activationSpeed > 150) {
      invalidFieldsArray.push("sa_activationSpeed");
    }
    if (values.startTime < 0 || values.startTime > 24) {
      invalidFieldsArray.push("startTime");
    }
    if (values.stopTime < 0 || values.stopTime > 24) {
      invalidFieldsArray.push("stopTime");
    }
    if (values.brakeActivateTime < 0 || values.brakeActivateTime > 50) {
      invalidFieldsArray.push("brakeActivateTime");
    }

    //Driver Eval

    if (
      values.maxLaneChangeThreshold < -99 ||
      values.maxLaneChangeThreshold > 99
    ) {
      invalidFieldsArray.push("maxLaneChangeThreshold");
    }
    if (
      values.minLaneChangeThreshold < -99 ||
      values.minLaneChangeThreshold > 99
    ) {
      invalidFieldsArray.push("minLaneChangeThreshold");
    }
    if (
      values.maxHarshAccelerationThreshold < -99 ||
      values.maxHarshAccelerationThreshold > 99
    ) {
      invalidFieldsArray.push("maxHarshAccelerationThreshold");
    }
    if (
      values.minHarshAccelerationThreshold < -99 ||
      values.minHarshAccelerationThreshold > 99
    ) {
      invalidFieldsArray.push("minHarshAccelerationThreshold");
    }
    if (
      values.suddenBrakingThreshold < -99 ||
      values.suddenBrakingThreshold > 99
    ) {
      invalidFieldsArray.push("suddenBrakingThreshold");
    }
    if (
      values.maxSpeedBumpThreshold < -99 ||
      values.maxSpeedBumpThreshold > 99
    ) {
      invalidFieldsArray.push("maxSpeedBumpThreshold");
    }
    if (
      values.minSpeedBumpThreshold < -99 ||
      values.minSpeedBumpThreshold > 99
    ) {
      invalidFieldsArray.push("minSpeedBumpThreshold");
    }
    //speed governer
    if (values.speedLimit < 0 || values.speedLimit > 200) {
      invalidFieldsArray.push("speedLimit");
    }
    //cruize
    if (
      values.cruiseactivationSpeed < 0 ||
      values.cruiseactivationSpeed > 150
    ) {
      invalidFieldsArray.push("cruiseactivationSpeed");
    }
    //sensor
    if (values.rfAngle < 0 || values.rfAngle > 360) {
      invalidFieldsArray.push("rfAngle");
    }
    if (values.rdr_act_spd < 0 || values.rdr_act_spd > 150) {
      invalidFieldsArray.push("rdr_act_spd");
    }
    //speed settings
    if (values.slope < -200 || values.slope > 200) {
      invalidFieldsArray.push("slope");
    }
    if (values.offset < -200 || values.offset > 200) {
      invalidFieldsArray.push("offset");
    }
    //shutdowndelay
    if (values.delay < -200 || values.delay > 200) {
      invalidFieldsArray.push("delay");
    }
    //Time based errors
    if (values.noAlarm < 0 || values.noAlarm > 60) {
      invalidFieldsArray.push("noAlarm");
    }
    if (values.speed < 0 || values.speed > 60) {
      invalidFieldsArray.push("speed");
    }
    if (values.accelerationBypass < 0 || values.accelerationBypass > 60) {
      invalidFieldsArray.push("accelerationBypass");
    }
    if (values.tim_err_tpms < 0 || values.tim_err_tpms > 200) {
      invalidFieldsArray.push("tim_err_tpms");
    }

    //speed based errors

    if (values.rfSensorAbsent < 0 || values.rfSensorAbsent > 200) {
      invalidFieldsArray.push("rfSensorAbsent");
    }
    if (values.gyroscopeAbsent < 0 || values.gyroscopeAbsent > 200) {
      invalidFieldsArray.push("gyroscopeAbsent");
    }
    if (values.hmiAbsent < 0 || values.hmiAbsent > 200) {
      invalidFieldsArray.push("hmiAbsent");
    }
    if (values.timeNotSet < 0 || values.timeNotSet > 200) {
      invalidFieldsArray.push("timeNotSet");
    }

    if (values.brakeError < 0 || values.brakeError > 200) {
      invalidFieldsArray.push("brakeError");
    }
    if (values.tpmsError < 0 || values.tpmsError > 200) {
      invalidFieldsArray.push("tpmsError");
    }
    if (values.obdAbsent < 0 || values.obdAbsent > 200) {
      invalidFieldsArray.push("obdAbsent");
    }
    if (values.noAlarmSpeed < 0 || values.noAlarmSpeed > 200) {
      invalidFieldsArray.push("noAlarmSpeed");
    }
    if (values.laserSensorAbsent < 0 || values.laserSensorAbsent > 200) {
      invalidFieldsArray.push("laserSensorAbsent");
    }
    if (values.rfidAbsent < 0 || values.rfidAbsent > 200) {
      invalidFieldsArray.push("rfidAbsent");
    }
    if (values.iotAbsent < 0 || values.iotAbsent > 200) {
      invalidFieldsArray.push("iotAbsent");
    }
    if (values.acc_board < 0 || values.acc_board > 200) {
      invalidFieldsArray.push("acc_board");
    }
    if (values.SBE_dd < 0 || values.SBE_dd > 200) {
      invalidFieldsArray.push("SBE_dd");
    }
    if (values.SBE_alcohol < 0 || values.SBE_alcohol > 200) {
      invalidFieldsArray.push("SBE_alcohol");
    }
    if (values.SBE_temp < 0 || values.SBE_temp > 200) {
      invalidFieldsArray.push("SBE_temp");
    }

    //alcohol detection
    if (values.alcoholinterval < 0 || values.alcoholinterval > 1440) {
      invalidFieldsArray.push("alcoholinterval");
    }
    if (values.alcoholact_spd < 0 || values.alcoholact_spd > 150) {
      invalidFieldsArray.push("alcoholact_spd");
    }
    if (values.alcoholstart_time < 0 || values.alcoholstart_time > 24) {
      invalidFieldsArray.push("alcoholstart_time");
    }
    if (values.alcoholstop_time < 0 || values.alcoholstop_time > 24) {
      invalidFieldsArray.push("alcoholstop_time");
    }

    //Driver monitoring

    if (values.dd_act_spd < 0 || values.dd_act_spd > 150) {
      invalidFieldsArray.push("dd_act_spd");
    }
    if (values.dd_strt_tim < 0 || values.dd_strt_tim > 24) {
      invalidFieldsArray.push("dd_strt_tim");
    }
    if (values.dd_stop_tim < 0 || values.dd_stop_tim > 24) {
      invalidFieldsArray.push("dd_stop_tim");
    }

    return invalidFieldsArray;
  }

  //add feature set api call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalidFieldsArray = validateForm(data, values);
    setInvalidFields(invalidFieldsArray);

    if (invalidFieldsArray.length > 0) {
      toastErr.current.show({
        severity: "warn",
        summary: "Warning",
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

  const GyroOptions = [
    {
      label: "External Gyro",
      value: "1",
    },
    {
      label: "inbuild Gyro",
      value: "2",
    },
    {
      label: "Steering Gyro",
      value: "3",
    },
  ];

  const BrakingOptions = [
    {
      label: "Internal Braking",
      value: "1",
    },
    {
      label: "PWN Braking",
      value: "2",
    },
    {
      label: "Actuator Braking",
      value: "3",
    },
  ];

  const ProtocolTypeoptions = [
    { label: "SAEJ1939", value: "SAEJ1939" },
    {
      label: "CAN",
      value: "CAN",
    },
  ];
  const radarOptions = [
    { label: "Radar 1", value: "1" },
    { label: "Radar 2", value: "2" },
    { label: "Radar 3", value: "3" },
  ];

  const alcothreshOptions = [
    { label: "Relaxed", value: "1" },
    { label: "Normal", value: "2" },
    { label: "Strict", value: "3" },
  ];

  // const BrakeTypeoptions = [
  //   { label: "Cylinder", value: "Cylinder" },
  //   { label: "Internal Braking", value: "Internal Braking" },
  //   {
  //     label: "Electromagnetic",
  //     value: "Electromagnetic",
  //   },
  // ];

  const Braking = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const SpeedSourceoptions = [
    { label: "Speed Wire", value: "Speed Wire" },
    { label: "OBD", value: "OBD" },
    { label: "GPS", value: "GPS" },
  ];

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      key: el.user_uuid,
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
      setSelectedValue(k[0].first_name + " " + k[0].last_name);
    }
  }, [listCustomers, customers]);

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
                borderRadius: "5px",
              }}
              placeholder="Feature Set Name"
              className={`border py-2 pl-2 ${
                invalidFields.includes("featureset_name")
                  ? "border-red-600"
                  : ""
              }`}
              name="featureset_name"
              onChange={(e) => {
                handleChange(e);
                setInvalidFields(
                  invalidFields.filter((field) => field !== "featureset_name")
                );
              }}
              autoComplete="off"
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
              className={`md:w-14rem mt-2 w-full border ${
                invalidFields.includes("featureset_users")
                  ? "border-red-600"
                  : ""
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
                checked={values.mode === "1"}
                value={1}
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
                checked={values.mode === "0"}
                value={0}
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
              value={"1"}
              onChange={handleData}
              checked={values.CASMode === "1"}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value={"0"}
              onChange={handleData}
              checked={values.CASMode === "0"}
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
              type="number"
              id="activationSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed")
                  ? "border-red-600"
                  : ""
              }`}
              placeholder="Enter a value"
              name="activationSpeed"
              onChange={handleData}
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.activationSpeed}
            />
            {invalidFields.includes("activationSpeed") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}
          </div>

          <div className="field my-3 w-[30vw]">
            <label htmlFor="alarmThreshold">Alarm Threshold</label>
            <InputText
              type="number"
              id="alarmThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alarmThreshold") ? "border-red-600" : ""
              }`}
              name="alarmThreshold"
              onChange={handleData}
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.alarmThreshold}
            />
            {invalidFields.includes("alarmThreshold") && (
              <small className="text-red-600">
                Alarm threshold should be greater than 0 and less than 10
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeThreshold">Brake Threshold</label>
            <InputText
              type="number"
              id="brakeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeThreshold") ? "border-red-600" : ""
              }`}
              name="brakeThreshold"
              onChange={handleData}
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.brakeThreshold}
            />
            {invalidFields.includes("brakeThreshold") && (
              <small className="text-red-600">
                Brake threshold should be greater than 0 and less than 10
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_speed">Brake Speed</label>
            <InputText
              type="number"
              id="brake_speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              name="brakeSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeSpeed") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.brakeSpeed}
            />
            {invalidFields.includes("brakeSpeed") && (
              <small className="text-red-600">
                Brake Speed should be greater than 0 and less than 150
              </small>
            )}
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
              placeholder="Select an option"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="detectStationaryObject"
              onChange={handleData}
              value={values.detectStationaryObject || "1"}
              className={`md:w-14rem  $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("detectStationaryObject")
                  ? "border-red-600"
                  : ""
              }`}
              disabled={values.CASMode === "0"}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="allowCompleteBrake">Allow Complete Brake</label>
            <Dropdown
              name="allowCompleteBrake"
              onChange={handleData}
              id="allowCompleteBrake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={CompleteBrakeoptions}
              placeholder="Select an option"
              value={values.allowCompleteBrake || "1"}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("allowCompleteBrake")
                  ? "border-red-600"
                  : ""
              }`}
              disabled={values.CASMode === "0"}
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
              value={values.detectOncomingObstacle || "1"}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              onChange={handleData}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("detectOncomingObstacle")
                  ? "border-red-600"
                  : ""
              }`}
              disabled={values.CASMode === "0"}
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
              value={values.safetyMode || "Normal"}
              placeholder="Select an option"
              onChange={handleData}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("safetyMode") ? "border-red-600" : ""
              }`}
              disabled={values.CASMode === "0"}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ttcThreshold">TTC Threshold</label>
            <InputText
              type="number"
              id="ttcThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("ttcThreshold") ? "border-red-600" : ""
              }`}
              name="ttcThreshold"
              onChange={handleData}
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.ttcThreshold}
            />
            {invalidFields.includes("ttcThreshold") && (
              <small className="text-red-600">
                TTCThreshold should be greater than 0 and less than 99.99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeOnDuration">Brake ON Duration</label>
            <InputText
              type="number"
              id="brakeOnDuration"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOnDuration"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeOnDuration")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.brakeOnDuration}
            />
            {invalidFields.includes("brakeOnDuration") && (
              <small className="text-red-600">
                Brake on duration should be greater than 0 and less than 9999.99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeOffDuration">Brake OFF Duration</label>
            <InputText
              type="number"
              id="brakeOffDuration"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOffDuration"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeOffDuration")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.brakeOffDuration}
            />
            {invalidFields.includes("brakeOffDuration") && (
              <small className="text-red-600">
                Brake off duration should be greater than 0 and less than
                9999.99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="start_time">Start Time</label>
            <InputText
              type="number"
              id="start_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="start_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("start_time") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.start_time}
            />
            {invalidFields.includes("start_time") && (
              <small className="text-red-600">
                Start time should be greater than 0 hour and less than 24 hours
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stop_time">Stop Time</label>
            <InputText
              type="number"
              id="stop_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stop_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("stop_time") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.CASMode === "0"}
              value={values.stop_time}
            />
            {invalidFields.includes("stop_time") && (
              <small className="text-red-600">
                Stop time should be greater than 0 hour and less than 24 hours
              </small>
            )}
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
              value={1}
              checked={values.sleepAlertMode === "1"}
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
              value={0}
              checked={values.sleepAlertMode === "0"}
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
              type="number"
              id="preWarning"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("preWarning") ? "border-red-600" : ""
              }`}
              name="preWarning"
              onChange={handleData}
              autoComplete="off"
              disabled={values.sleepAlertMode === "0"}
              value={values.preWarning}
            />
            {invalidFields.includes("preWarning") && (
              <small className="text-red-600">
                Prewarning should be greater than 0 hour and less than 24 hours
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sleepAlertInterval">Sleep Alert Interval</label>
            <InputText
              type="number"
              id="sleepAlertInterval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sleepAlertInterval"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("sleepAlertInterval")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.sleepAlertMode === "0"}
              value={values.sleepAlertInterval}
            />
            {invalidFields.includes("sleepAlertInterval") && (
              <small className="text-red-600">
                Sleep alert interval should be greater than 0 and less than 999
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sa_activationSpeed">Activation Speed</label>
            <InputText
              type="number"
              id="sa_activationSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sa_activationSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("sa_activationSpeed")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.sleepAlertMode === "0"}
              value={values.sa_activationSpeed}
            />
            {invalidFields.includes("sa_activationSpeed") && (
              <small className="text-red-600">
                Sleep alert interval should be greater than 0 and less than 150
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="startTime">Start Time</label>
            <InputText
              type="number"
              id="startTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="startTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("startTime") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.sleepAlertMode === "0"}
              value={values.startTime}
            />
            {invalidFields.includes("startTime") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stopTime">Stop Time</label>
            <InputText
              type="number"
              id="stopTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stopTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("stopTime") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.sleepAlertMode === "0"}
              value={values.stopTime}
            />
            {invalidFields.includes("stopTime") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeActivateTime">Brake Activate Time</label>
            <InputText
              type="number"
              id="brakeActivateTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeActivateTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeActivateTime")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.sleepAlertMode === "0"}
              value={values.brakeActivateTime}
            />
            {invalidFields.includes("brakeActivateTime") && (
              <small className="text-red-600">
                Brake activation time should be greater than 0 and less than 50
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="braking">Braking</label>
            <Dropdown
              name="braking"
              value={values.braking || "1"}
              onChange={handleData}
              id="braking"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={Braking}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("braking") ? "border-red-600" : ""
              }`}
              disabled={values.sleepAlertMode === "0"}
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
              onChange={handleData}
              checked={values.driverEvalMode === "1"}
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
              onChange={handleData}
              checked={values.driverEvalMode === "0"}
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
              type="number"
              id="maxLaneChangeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxLaneChangeThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxLaneChangeThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.maxLaneChangeThreshold}
            />
            {invalidFields.includes("maxLaneChangeThreshold") && (
              <small className="text-red-600">
                Max lane change threshold should be greater than -99 and less
                than 99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minLaneChangeThreshold">
              Min Lane Change Threshold
            </label>
            <InputText
              type="number"
              id="minLaneChangeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minLaneChangeThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minLaneChangeThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.minLaneChangeThreshold}
            />
            {invalidFields.includes("minLaneChangeThreshold") && (
              <small className="text-red-600">
                Min lane change threshold should be greater than -99 and less
                than 99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxHarshAccelerationThreshold">
              Max Harsh Acceleration Threshold
            </label>
            <InputText
              type="number"
              id="maxHarshAccelerationThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxHarshAccelerationThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxHarshAccelerationThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.maxHarshAccelerationThreshold}
            />
            {invalidFields.includes("maxHarshAccelerationThreshold") && (
              <small className="text-red-600">
                Max harsh acceleration should be greater than -99 and less than
                99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minHarshAccelerationThreshold">
              Min Harsh Acceleration Threshold
            </label>
            <InputText
              type="number"
              id="minHarshAccelerationThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minHarshAccelerationThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minHarshAccelerationThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.minHarshAccelerationThreshold}
            />
            {invalidFields.includes("minHarshAccelerationThreshold") && (
              <small className="text-red-600">
                Min harsh acceleration should be greater than -99 and less than
                99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="suddenBrakingThreshold">
              Sudden Braking Threshold
            </label>
            <InputText
              type="number"
              id="suddenBrakingThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="suddenBrakingThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("suddenBrakingThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.suddenBrakingThreshold}
            />
            {invalidFields.includes("suddenBrakingThreshold") && (
              <small className="text-red-600">
                Sudden Braking threshold should be greater than -99 and less
                than 99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxSpeedBumpThreshold">
              Max Speed Bump Threshold
            </label>
            <InputText
              type="number"
              id="maxSpeedBumpThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxSpeedBumpThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxSpeedBumpThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.maxSpeedBumpThreshold}
            />
            {invalidFields.includes("maxSpeedBumpThreshold") && (
              <small className="text-red-600">
                Max speed bump should be greater than -99 and less than 99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minSpeedBumpThreshold">
              Min Speed Bump Threshold
            </label>
            <InputText
              type="number"
              id="minSpeedBumpThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minSpeedBumpThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minSpeedBumpThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverEvalMode === "0"}
              value={values.minSpeedBumpThreshold}
            />
            {invalidFields.includes("minSpeedBumpThreshold") && (
              <small className="text-red-600">
                Min speed bump should be greater than -99 and less than 99
              </small>
            )}
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
              onChange={handleData}
              name="GovernerMode"
              value={1}
              checked={values.GovernerMode === "1"}
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
              onChange={handleData}
              checked={values.GovernerMode === "0"}
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
              type="number"
              id="speedLimit"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedLimit"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("speedLimit") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.GovernerMode === "0"}
              value={values.speedLimit}
            />
            {invalidFields.includes("speedLimit") && (
              <small className="text-red-600">
                Speed limit should be greater than 0 and less than 200
              </small>
            )}
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
              onChange={handleData}
              checked={values.cruiseMode === "1"}
            />
            <label htmlFor="mode2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="cruiseMode"
              onChange={handleData}
              name="cruiseMode"
              value={0}
              checked={values.cruiseMode === "0"}
            />
            <label htmlFor="mode1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="cruiseactivationSpeed">Activation Speed</label>
          <InputText
            type="number"
            id="cruiseactivationSpeed"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="cruiseactivationSpeed"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("cruiseactivationSpeed")
                ? "border-red-600"
                : ""
            }`}
            onChange={handleData}
            placeholder="Enter a value"
            autoComplete="off"
            disabled={values.cruiseMode === "0"}
            value={values.cruiseactivationSpeed}
          />
          {invalidFields.includes("cruiseactivationSpeed") && (
            <small className="text-red-600">
              Cruise activation speed should be greater than 0 and less than 150
            </small>
          )}
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
              onChange={handleData}
              disabled={values.cruiseMode === "0"}
              options={VehicleTypeoptions}
              value={values.vehicleType || "12V Pedal"}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("vehicleType") ? "border-red-600" : ""
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
              onChange={handleData}
              checked={values.obdMode === "1"}
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
              onChange={handleData}
              checked={values.obdMode === "0"}
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
              onChange={handleData}
              options={ProtocolTypeoptions}
              disabled={values.obdMode === "0"}
              placeholder="Select an option"
              value={values.protocolType || "SAEJ1939"}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("protocolType") ? "border-red-600" : ""
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
              id="tpmsMode"
              name="tpmsMode"
              value={1}
              onChange={handleData}
              checked={values.tpmsMode === "1"}
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
              onChange={handleData}
              checked={values.tpmsMode === "0"}
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
              value={values.acceleratorType || "Sensor"}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              name="acceleratorType"
              onChange={handleData}
              options={AcceleratorTypeoptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("acceleratorType")
                  ? "border-red-600"
                  : ""
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
              value={values.VS_brk_typ || 1}
              placeholder="Select an option"
              optionLabel="label"
              optionValue="value"
              name="VS_brk_typ"
              onChange={handleData}
              options={BrakingOptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("VS_brk_typ") ? "border-red-600" : ""
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
            value={values.VS_gyro_type || 1}
            placeholder="Select an option"
            optionLabel="label"
            optionValue="value"
            name="VS_gyro_type"
            onChange={handleData}
            options={GyroOptions}
            className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
              invalidFields.includes("VS_gyro_type") ? "border-red-600" : ""
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
              onChange={handleData}
              checked={values.lazerMode === "1"}
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
              onChange={handleData}
              checked={values.lazerMode === "0"}
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
              onChange={handleData}
              checked={true}
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
              onChange={handleData}
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
              type="number"
              id="rfAngle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfAngle"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfAngle") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.rfAngle}
            />
            {invalidFields.includes("rfAngle") && (
              <small className="text-red-600">
                RFAngle should be greater than 0 and less than 360
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rdr_act_spd">Radar activation speed</label>
            <InputText
              type="number"
              id="rdr_act_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rdr_act_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rdr_act_spd") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.rdr_act_spd}
            />
            {invalidFields.includes("rdr_act_spd") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}
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
              value={values.rdr_type || "1"}
              placeholder="Select an option"
              options={radarOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleData}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("rdr_type") ? "border-red-600" : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="Sensor_res1">Reserved 1</label>
            <InputText
              type="number"
              id="Sensor_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="Sensor_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("Sensor_res1") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.Sensor_res1}
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
              value={values.speedSource || "Speed Wire"}
              placeholder="Select an option"
              options={SpeedSourceoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleData}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("speedSource") ? "border-red-600" : ""
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="slope">Slope</label>
            <InputText
              type="number"
              id="slope"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="slope"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("slope") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.slope}
            />
            {invalidFields.includes("slope") && (
              <small className="text-red-600">
                Slope should be greater than -200 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="offset">Offset</label>
            <InputText
              type="number"
              id="offset"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="offset"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("offset") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.offset}
            />
            {invalidFields.includes("offset") && (
              <small className="text-red-600">
                Slope should be greater than -200 and less than 200
              </small>
            )}
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Shutdown Delay</p>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="delay">Delay</label>
          <InputText
            type="number"
            id="delay"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="delay"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("delay") ? "border-red-600" : ""
            }`}
            onChange={handleData}
            placeholder="Enter a value"
            autoComplete="off"
            value={values.delay}
          />
          {invalidFields.includes("delay") && (
            <small className="text-red-600">
              Delay should be greater than 0 and less than 200
            </small>
          )}
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
              onChange={handleData}
              checked={true}
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
              onChange={handleData}
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
              type="number"
              id="noAlarm"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarm"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("noAlarm") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.noAlarm}
            />
            {invalidFields.includes("noAlarm") && (
              <small className="text-red-600">
                No alarm should be greater than 0 and less than 60
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speed">Speed</label>
            <InputText
              type="number"
              id="speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("speed") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.speed}
            />
            {invalidFields.includes("speed") && (
              <small className="text-red-600">
                Speed should be greater than 0 and less than 60
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="accelerationBypass">Acceleration Bypass</label>
            <InputText
              type="number"
              id="accelerationBypass"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationBypass"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("accelerationBypass")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.accelerationBypass}
            />
            {invalidFields.includes("accelerationBypass") && (
              <small className="text-red-600">
                Acceleration bypass should be greater than 0 and less than 60
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tim_err_tpms">TPMS</label>
            <InputText
              type="number"
              id="tim_err_tpms"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tim_err_tpms"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("tim_err_tpms") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.tim_err_tpms}
            />
            {invalidFields.includes("tim_err_tpms") && (
              <small className="text-red-600">
                TPMS should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfSensorAbsent">RF Sensor Absent</label>
            <InputText
              type="number"
              id="rfSensorAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfSensorAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfSensorAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.rfSensorAbsent}
            />
            {invalidFields.includes("rfSensorAbsent") && (
              <small className="text-red-600">
                RF Sensor absent should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="gyroscopeAbsent">Gyroscope Absent</label>
            <InputText
              type="number"
              id="gyroscopeAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="gyroscopeAbsent"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("gyroscopeAbsent")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.gyroscopeAbsent}
            />
            {invalidFields.includes("gyroscopeAbsent") && (
              <small className="text-red-600">
                Gyroscope should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="hmiAbsent">HMI Absent</label>
            <InputText
              type="number"
              id="hmiAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="hmiAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("hmiAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.hmiAbsent}
            />
            {invalidFields.includes("hmiAbsent") && (
              <small className="text-red-600">
                HMI should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="timeNotSet">Time Not Set</label>
            <InputText
              type="number"
              id="timeNotSet"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="timeNotSet"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("timeNotSet") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.timeNotSet}
            />
            {invalidFields.includes("timeNotSet") && (
              <small className="text-red-600">
                Time set should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeError">Brake Error</label>
            <InputText
              type="number"
              id="brakeError"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeError"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeError") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.brakeError}
            />
            {invalidFields.includes("brakeError") && (
              <small className="text-red-600">
                Brake error should be greater than 0 and less than 200
              </small>
            )}
          </div>

          <div className="field my-3 w-[30vw]">
            <label htmlFor="tpmsError">TPMS Error</label>
            <InputText
              type="number"
              id="tpmsError"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tpmsError"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("tpmsError") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.tpmsError}
            />
            {invalidFields.includes("tpmsError") && (
              <small className="text-red-600">
                TPMS error should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="obdAbsent">OBD Absent</label>
            <InputText
              type="number"
              id="obdAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="obdAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("obdAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.obdAbsent}
            />
            {invalidFields.includes("obdAbsent") && (
              <small className="text-red-600">
                OBD should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="noAlarmSpeed">No Alarm</label>
            <InputText
              type="number"
              id="noAlarmSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarmSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("noAlarmSpeed") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.noAlarmSpeed}
            />
            {invalidFields.includes("noAlarmSpeed") && (
              <small className="text-red-600">
                No alarm speed should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="laserSensorAbsent">Laser Sensor Absent</label>
            <InputText
              type="number"
              id="laserSensorAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="laserSensorAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("laserSensorAbsent")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.laserSensorAbsent}
            />
            {invalidFields.includes("laserSensorAbsent") && (
              <small className="text-red-600">
                Laser sensor absent should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfidAbsent">RFID Absent</label>
            <InputText
              type="number"
              id="rfidAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfidAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfidAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.rfidAbsent}
            />
            {invalidFields.includes("rfidAbsent") && (
              <small className="text-red-600">
                RFID absent should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="iotAbsent">IoT Absent</label>
            <InputText
              type="number"
              id="iotAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="iotAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("iotAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.iotAbsent}
            />
            {invalidFields.includes("iotAbsent") && (
              <small className="text-red-600">
                IoT absent should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acc_board">Accessory Board</label>
            <InputText
              type="number"
              id="acc_board"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="acc_board"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("acc_board") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.acc_board}
            />
            {invalidFields.includes("acc_board") && (
              <small className="text-red-600">
                Acc board should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_dd">Driver Drowsiness</label>
            <InputText
              type="number"
              id="SBE_dd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_dd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_dd") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.SBE_dd}
            />
            {invalidFields.includes("SBE_dd") && (
              <small className="text-red-600">
                Driver Drowsiness should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_alcohol">Alcohol Sensor</label>
            <InputText
              type="number"
              id="SBE_alcohol"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_alcohol"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_alcohol") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.SBE_alcohol}
            />
            {invalidFields.includes("SBE_alcohol") && (
              <small className="text-red-600">
                Alcohol should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_temp">Temperature Sensor</label>
            <InputText
              type="number"
              id="SBE_temp"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_temp"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_temp") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.SBE_temp}
            />
            {invalidFields.includes("SBE_temp") && (
              <small className="text-red-600">
                Temperature should be greater than 0 and less than 200
              </small>
            )}{" "}
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
              onChange={handleData}
              checked={values.firmwareOtaUpdate === "1"}
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
              onChange={handleData}
              checked={values.firmwareOtaUpdate === "0"}
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
              type="number"
              id="firewarereserver1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver1")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.firmwareOtaUpdate === "0"}
              value={values.firewarereserver1}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="firewarereserver2">Reserved 2</label>
            <InputText
              type="number"
              id="firewarereserver2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver2")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.firmwareOtaUpdate === "0"}
              value={values.firewarereserver2}
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
              onChange={handleData}
              checked={values.alcoholDetectionMode === "1"}
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
              onChange={handleData}
              checked={values.alcoholDetectionMode === "0"}
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
              type="number"
              id="alcoholinterval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholinterval"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholinterval")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.alcoholDetectionMode === "0"}
              value={values.alcoholinterval}
            />
            {invalidFields.includes("alcoholinterval") && (
              <small className="text-red-600">
                Alcohol should be greater than 0 and less than 1440
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholact_spd">Activation Speed</label>
            <InputText
              type="number"
              id="alcoholact_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholact_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholact_spd") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.alcoholDetectionMode === "0"}
              value={values.alcoholact_spd}
            />
            {invalidFields.includes("alcoholact_spd") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholstart_time">Start time</label>
            <InputText
              type="number"
              id="alcoholstart_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholstart_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholstart_time")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.alcoholDetectionMode === "0"}
              value={values.alcoholstart_time}
            />
            {invalidFields.includes("alcoholstart_time") && (
              <small className="text-red-600">
                Start time should be greater than 0 and less than 24
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholstop_time">Stop time</label>
            <InputText
              type="number"
              id="alcoholstop_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholstop_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholstop_time")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.alcoholDetectionMode === "0"}
              value={values.alcoholstop_time}
            />
            {invalidFields.includes("alcoholstop_time") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
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
              value={values.alcoholmode || "1"}
              placeholder="Select an option"
              options={alcothreshOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleData}
              disabled={values.alcoholDetectionMode === "0"}
              className={`border dark:bg-gray-900 ${
                invalidFields.includes("alcoholmode") ? "border-red-600" : ""
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
              onChange={handleData}
              checked={values.driverDrowsinessMode === "1"}
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
              onChange={handleData}
              checked={values.driverDrowsinessMode === "0"}
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
              type="number"
              id="dd_act_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_act_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_act_spd") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverDrowsinessMode === "0"}
              value={values.dd_act_spd}
            />
            {invalidFields.includes("dd_act_spd") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_acc_cut">ACC Cut Status</label>
            <InputText
              type="number"
              id="dd_acc_cut"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_acc_cut"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_acc_cut") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverDrowsinessMode === "0"}
              value={values.dd_acc_cut}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_strt_tim">Start Time</label>
            <InputText
              type="number"
              id="dd_strt_tim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_strt_tim"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_strt_tim") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverDrowsinessMode === "0"}
              value={values.dd_strt_tim}
            />
            {invalidFields.includes("dd_act_spd") && (
              <small className="text-red-600">
                Start time should be greater than 0 and less than 24
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_stop_tim">Stop Time</label>
            <InputText
              type="number"
              id="dd_stop_tim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_stop_tim"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_stop_tim") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              value={values.dd_stop_tim}
            />
            {invalidFields.includes("dd_stop_tim") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_res1">Reserved 1</label>
            <InputText
              type="number"
              id="dd_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_res1") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.driverDrowsinessMode === "0"}
              value={values.dd_res1}
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
              onChange={handleData}
              checked={values.load_sts === "1"}
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
              onChange={handleData}
              checked={values.load_sts === "0"}
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
              type="number"
              id="load_max_cap"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="load_max_cap"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("load_max_cap") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.load_sts === "0"}
              value={values.load_max_cap}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="load_acc">Accelerator</label>
            <InputText
              type="number"
              id="load_acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="load_acc"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("load_acc") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.load_sts === "0"}
              value={values.load_acc}
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
              onChange={handleData}
              checked={values.fuelMode === "1"}
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
              onChange={handleData}
              checked={values.fuelMode === "0"}
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
              type="number"
              id="fuel_tnk_cap"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_tnk_cap"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_tnk_cap") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.fuelMode === "0"}
              value={values.fuel_tnk_cap}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_intvl1">Interval 1</label>
            <InputText
              type="number"
              id="fuel_intvl1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_intvl1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_intvl1") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.fuelMode === "0"}
              value={values.fuel_intvl1}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_intvl2">Interval 2</label>
            <InputText
              type="number"
              id="fuel_intvl2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_intvl2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_intvl2") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.fuelMode === "0"}
              value={values.fuel_intvl2}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_acc">Acc Cut</label>
            <InputText
              type="number"
              id="fuel_acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_acc"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_acc") ? "border-red-600" : ""
              }`}
              onChange={handleData}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={values.fuelMode === "0"}
              value={values.fuel_acc}
            />
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="fuel_thrsh">Threshold</label>
          <InputText
            type="number"
            id="fuel_thrsh"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="fuel_thrsh"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("fuel_thrsh") ? "border-red-600" : ""
            }`}
            onChange={handleData}
            placeholder="Enter a value"
            autoComplete="off"
            disabled={values.fuelMode === "0"}
            value={values.fuel_thrsh}
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-2 text-white dark:bg-gray-150 dark:font-bold dark:text-blue-800"
          >
            Add Feature Set
          </button>
        </div>
      </form>
    </>
  );
};

export default AddFeatureSet;
