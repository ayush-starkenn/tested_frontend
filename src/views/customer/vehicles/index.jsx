import React, { useEffect, useRef, useState } from "react";
import VehiclesList from "./components/VehiclesList";
import VehiclesGrid from "./components/VehiclesGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

const Marketplace = () => {
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [vehiData, setVehiData] = useState([]);
  const [dialog1, setDialog1] = useState(false);
  const [addData, setAddData] = useState({});
  const [ecuData, setEcuData] = useState([]);
  const [iotData, setIotData] = useState([]);
  const [dmsData, setDmsData] = useState([]);
  const [feauresetData, setFeaturesetData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [refresh, setRefresh] = useState(false);
  const toastRef = useRef(null);
  const user_uuid = Cookies.get("user_uuid");
  const token = Cookies.get("token");

  const validateForm = () => {
    let errors = {};

    if (!addData.vehicle_name) {
      errors.vehicle_name = "Vehicle Name is required";
    }

    if (!addData.vehicle_registration) {
      errors.vehicle_registration = "Vehicle Registration is required";
    }

    if (!addData.featureset_uuid) {
      errors.featureset_uuid = "Vehicle Featureset is required";
    }

    if (addData.dms) {
      // If DMS is selected, no need to validate ECU and IoT
      return errors;
    }

    // If DMS is not selected, validate ECU and IoT
    if (!addData.ecu) {
      errors.ecu = "ECU device is required";
    }
    if (!addData.iot) {
      errors.iot = "IoT device is required";
    }

    return errors;
  };

  const handleToggleView = () => {
    const newView = !isListView;
    setIsListView(newView);
    // Store the view preference in localStorage
    localStorage.setItem("viewPreference", newView ? "list" : "grid");
  };

  const openDialog1 = () => {
    setDialog1(true);
  };

  const closeDialog1 = () => {
    setDialog1(false);
    setAddData({});
    setFormErrors({});
  };

  //api call to get vehicle list
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/vehicles/get-user-vehiclelist/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        const formatedData = res.data.results.map((item, ind) => ({
          ...item,
          serialNo: ind + 1,
        }));
        setVehiData(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token, user_uuid]);

  // get ECUData
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/devices/get-user-ecu/${user_uuid}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setEcuData(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token, user_uuid]);

  //get IoTData
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/devices/get-user-iot/${user_uuid}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setIotData(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token, user_uuid]);

  //get dmsData
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/devices/get-user-dms/${user_uuid}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setDmsData(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token, user_uuid]);

  //get featureset
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/featuresets/get-user-featureset/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setFeaturesetData(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  //edit vehicle Function

  const editvehicle = (vehicle_uuid, data) => {
    axios
      .put(
        `http://localhost:8080/api/vehicles/edit-vehicle/${vehicle_uuid}`,
        data,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setRefresh(!refresh);
        closeDialog1();
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Vehicle added successfully!",
          life: 3000,
        });
      })
      .catch((err) => {
        if (err.response.request.status === 400) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Vehicle Registration-Number already exists.",
            life: 3000,
          });
        } else {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add vehicle. Please try again.",
            life: 3000,
          });
        }
      });
  };

  //Delete vehcile Function

  const deleteVehicle = (vehicle_uuid, token) => {
    axios
      .put(
        `http://localhost:8080/api/vehicles/delete-vehicle/${vehicle_uuid}`,
        { user_uuid },
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setRefresh(!refresh);
        closeDialog1();
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Vehicle added successfully!",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add vehicle. Please try again.",
          life: 3000,
        });
      });
  };

  //onChange function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddData({ ...addData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post(
          "http://localhost:8080/api/vehicles/add-vehicle",
          { ...addData, user_uuid },
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          setRefresh(!refresh);
          closeDialog1();
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: "Vehicle added successfully!",
            life: 3000,
          });
        })
        .catch((err) => {
          if (err.response.request.status === 400) {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "Vehicle Registration-Number already exists.",
              life: 3000,
            });
          } else {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to add vehicle. Please try again.",
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

  //dropdown options

  const ecuOptions = () => {
    return ecuData?.map((el) => ({
      label: el.device_id,
      value: el.device_id,
    }));
  };

  const iotOptions = () => {
    return iotData?.map((el) => ({
      label: el.device_id,
      value: el.device_id,
    }));
  };
  const dmsOptions = () => {
    return dmsData?.map((el) => ({
      label: el.device_id,
      value: el.device_id,
    }));
  };

  const featuresetOptions = () => {
    return feauresetData?.map((el) => ({
      label: el.featureset_name,
      value: el.featureset_uuid,
    }));
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Vehicles
        </h4>
        <div className="pt-3">
          <button
            className={`${
              isListView === true
                ? "list-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "list-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsListUl />
          </button>
          <button
            className={`${
              isListView === false
                ? "grid-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "grid-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsGrid />
          </button>
        </div>
      </div>
      {/* button to add vehicle */}
      <Button
        label="New Vehicle"
        icon="pi pi-plus"
        severity="primary"
        className="mt-2 h-10 px-3 py-0 text-left dark:hover:text-white"
        onClick={openDialog1}
      />
      {/* dialog for adding vehicle */}
      <Dialog
        visible={dialog1}
        onHide={closeDialog1}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="mx-auto mt-1 w-[34.5vw]">
            <span
              className={`p-float-label ${
                formErrors.vehicle_name && "p-invalid"
              }`}
            >
              <InputText
                id="vehicle_name"
                name="vehicle_name"
                onChange={handleChange}
              />
              <label htmlFor="vehicle_name">Vehicle Name</label>
            </span>
            {formErrors.vehicle_name && (
              <small className="p-error">{formErrors.vehicle_name}</small>
            )}
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span
              className={`p-float-label ${
                formErrors.vehicle_registration && "p-invalid"
              }`}
            >
              <InputText
                id="vehicle_registration"
                name="vehicle_registration"
                onChange={handleChange}
              />
              <label htmlFor="vehicle_registration">Vehicle Registration</label>
            </span>
            {formErrors.vehicle_registration && (
              <small className="p-error">
                {formErrors.vehicle_registration}
              </small>
            )}
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className={`p-float-label ${formErrors.dms && "p-invalid"}`}>
              <Dropdown
                id="ecu"
                name="ecu"
                options={ecuOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.ecu}
              />
              <label htmlFor="status">Select ECU</label>
            </span>
            {formErrors.ecu && (
              <small className="p-error">{formErrors.ecu}</small>
            )}
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className={`p-float-label ${formErrors.dms && "p-invalid"}`}>
              <Dropdown
                id="iot"
                name="iot"
                options={iotOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.iot}
              />
              <label htmlFor="status">Select IoT</label>
            </span>
            {formErrors.iot && (
              <small className="p-error">{formErrors.iot}</small>
            )}
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="dms"
                name="dms"
                options={dmsOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.dms}
              />
              <label htmlFor="status">Select DMS</label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className={`p-float-label ${formErrors.dms && "p-invalid"}`}>
              <Dropdown
                id="featureset_uuid"
                name="featureset_uuid"
                options={featuresetOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.featureset_uuid}
              />
              <label htmlFor="status">Select Featureset</label>
            </span>
            {formErrors.featureset_uuid && (
              <small className="p-error">{formErrors.featureset_uuid}</small>
            )}
          </div>

          <div className="p-field p-col-12 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </Dialog>
      {/* This is grid and list views */}
      {!isListView && (
        <VehiclesGrid
          vehiData={vehiData}
          editvehicle={editvehicle}
          deleteVehicle={deleteVehicle}
          ecuData={ecuData}
          iotData={iotData}
          dmsData={dmsData}
          feauresetData={feauresetData}
        />
      )}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <VehiclesList
            vehiData={vehiData}
            editvehicle={editvehicle}
            deleteVehicle={deleteVehicle}
            ecuData={ecuData}
            iotData={iotData}
            dmsData={dmsData}
            feauresetData={feauresetData}
          />
        </div>
      )}
    </>
  );
};

export default Marketplace;
