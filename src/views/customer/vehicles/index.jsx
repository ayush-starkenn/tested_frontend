import React, { useEffect, useRef, useState } from "react";
import VehiclesList from "./components/VehiclesList";
import VehiclesGrid from "./components/VehiclesGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { FiPlus } from "react-icons/fi";
import DefaultFeatureset from "./components/DefaultFeatureset";
import { MdOutlineFeaturedPlayList } from "react-icons/md";

const Marketplace = () => {
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [featuresetDialog, setFeaturesetDialog] = useState(false);
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

    if (addData.ecu) {
      if (!addData.featureset_uuid) {
        errors.featureset_uuid = "Vehicle Featureset is required";
      }
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
        `${process.env.REACT_APP_API_URL}/vehicles/get-user-vehiclelist/${user_uuid}`,
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
      .get(
        `${process.env.REACT_APP_API_URL}/devices/get-user-ecu/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
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
      .get(
        `${process.env.REACT_APP_API_URL}/devices/get-user-iot/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
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
      .get(
        `${process.env.REACT_APP_API_URL}/devices/get-user-dms/${user_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
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
        `${process.env.REACT_APP_API_URL}/featuresets/get-user-featureset/${user_uuid}`,
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
        `${process.env.REACT_APP_API_URL}/vehicles/edit-vehicle/${vehicle_uuid}`,
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
          detail: "Vehicle updated successfully!",
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
        `${process.env.REACT_APP_API_URL}/vehicles/delete-vehicle/${vehicle_uuid}`,
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
          detail: "Vehicle deleted successfully!",
          life: 3000,
        });
      })
      .catch((err) => {
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
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? undefined : `${name} is required`,
    }));
    setAddData({ ...addData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/vehicles/add-vehicle`,
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

  const openFeatureset = () => {
    setFeaturesetDialog(true);
  };

  const closeFeatureset = () => {
    setFeaturesetDialog(false);
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
      <div className="flex">
        {/* button to add vehicle */}

        <button
          className="mx-2 mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
          onClick={openDialog1}
        >
          <FiPlus className="mr-2" />
          New Vehicle
        </button>
        {/* button to overwrite featureset */}
        <button
          className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
          onClick={openFeatureset}
        >
          <MdOutlineFeaturedPlayList className="mr-2" />
          Featureset
        </button>
      </div>
      <Dialog
        visible={featuresetDialog}
        onHide={closeFeatureset}
        header="Featureset Details"
        style={{ width: "70vw" }}
      >
        <DefaultFeatureset closeFeatureset={closeFeatureset} />
      </Dialog>

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
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap dark:text-gray-300"
        >
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="vehicle_name"
                name="vehicle_name"
                onChange={handleChange}
                className={`border py-2 pl-2 ${
                  formErrors.vehicle_name && "border-red-600"
                }`}
              />
              <label htmlFor="vehicle_name" className="dark:text-gray-300">
                Vehicle Name
              </label>
            </span>
            {formErrors.vehicle_name && (
              <small className="text-red-600">{formErrors.vehicle_name}</small>
            )}
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="vehicle_registration"
                name="vehicle_registration"
                onChange={handleChange}
                className={`border py-2 pl-2 ${
                  formErrors.vehicle_registration && "border-red-600"
                }`}
              />
              <label
                htmlFor="vehicle_registration"
                className="dark:text-gray-300"
              >
                Vehicle Registration
              </label>
            </span>
            {formErrors.vehicle_registration && (
              <small className="text-red-600">
                {formErrors.vehicle_registration}
              </small>
            )}
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="ecu"
                name="ecu"
                options={ecuOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.ecu}
                className={`border dark:bg-gray-800 ${
                  formErrors.ecu && "border-red-600"
                }`}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select ECU
              </label>
            </span>
            {formErrors.ecu && (
              <small className="text-red-600">{formErrors.ecu}</small>
            )}
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="iot"
                name="iot"
                options={iotOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.iot}
                className={`border ${formErrors.iot && "border-red-600"}`}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select IoT
              </label>
            </span>
            {formErrors.iot && (
              <small className="text-red-600">{formErrors.iot}</small>
            )}
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="dms"
                name="dms"
                options={dmsOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.dms}
                className={`border ${formErrors.dms && "border-red-600"}`}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select DMS
              </label>
            </span>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="featureset_uuid"
                name="featureset_uuid"
                options={featuresetOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleChange}
                value={addData?.featureset_uuid}
                className={`border ${
                  formErrors.featureset_uuid ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select Featureset
              </label>
            </span>
            {formErrors.featureset_uuid && (
              <small className="text-red-600">
                {formErrors.featureset_uuid}
              </small>
            )}
          </div>

          <div className="p-field p-col-12 mt-7 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white dark:bg-gray-150 dark:font-bold dark:text-blue-800"
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
