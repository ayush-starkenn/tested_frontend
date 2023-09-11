import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import { GiMineTruck } from "react-icons/gi";
import { TabPanel, TabView } from "primereact/tabview";
import FeatureSet from "./FeatureSet";
import VehicleTrips from "./VehicleTrips";

export default function VehiclesGrid({
  vehiData,
  editvehicle,
  deleteVehicle,
  ecuData,
  iotData,
  dmsData,
  feauresetData,
}) {
  const token = Cookies.get("token");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [viewDialog, setViewDialog] = useState(false);
  const [localEcuData, setLocalEcuData] = useState([]);
  const [localIoTData, setLocalIoTData] = useState([]);
  const [localDMSData, setLocalDMSData] = useState([]);
  const [myData, setMyData] = useState();

  useEffect(() => {
    if (ecuData) {
      setLocalEcuData(ecuData);
    }
    if (iotData) {
      setLocalIoTData(iotData);
    }
    if (dmsData) {
      setLocalDMSData(dmsData);
    }
  }, [ecuData, iotData, dmsData]);

  const openEditDialog = (rowData) => {
    setEditDialog(true);
    setEditData(rowData);
    setLocalEcuData((prevData) => [
      ...prevData,
      { device_id: rowData.ecu, device_type: "ecu" },
    ]);
    setLocalIoTData((prevData) => [
      ...prevData,
      { device_id: rowData.iot, device_type: "iot" },
    ]);
    setLocalDMSData((prevData) => [
      ...prevData,
      { device_id: rowData.dms, device_type: "dms" },
    ]);
    setEditId(rowData?.vehicle_uuid);
  };

  const closeEditDialog = () => {
    setEditDialog(false);
    setEditData({});
    setEditId("");
  };

  const DeleteDialog = (rowData) => {
    setDeleteDialog(!deleteDialog);
    setDeleteId(rowData?.vehicle_uuid);
  };

  const handleDelete = () => {
    if (deleteId !== "") {
      deleteVehicle(deleteId, token);
      DeleteDialog();
    }
  };

  const ViewDialog = (rowData) => {
    setMyData(rowData);
    setViewDialog(true);
  };
  const closeViewDialog = () => {
    setViewDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  //onSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId && editData) {
      editvehicle(editId, editData);
      closeEditDialog();
    }
  };

  //dropdown options

  const featuresetOptions = () => {
    return feauresetData?.map((el) => ({
      label: el.featureset_name,
      value: el.featureset_uuid,
    }));
  };

  const statusOptions = [
    {
      label: "Active",
      value: 1,
    },
    {
      label: "Deactive",
      value: 2,
    },
  ];

  const itemTemplate = (item) => {
    return (
      <div className="p-col-12 vehicle-card mb-6 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-150">
        <div className="card">
          <div className="card-header">
            <div className="p-text-bold">{`${item.vehicle_name} - ${item.vehicle_registration}`}</div>
          </div>
          <div className="card-body flex-grow">
            <div className="flex-col">
              <div className=" flex justify-around">
                <div>
                  <div>
                    <GiMineTruck
                      className="text-red-450 dark:text-red-550"
                      style={{
                        fontSize: "4rem",
                      }}
                    />
                  </div>
                </div>
                <div></div>
                <div className="p-grid">
                  <div className="p-col">
                    {item.ecu && <h1 className="p-text-bold">ECU:</h1>}
                    {item.iot && <h1 className="p-text-bold">IoT:</h1>}
                    {item.dms && <h1 className="p-text-bold">DMS:</h1>}
                    <h1 className="p-text-bold">Status:</h1>
                  </div>

                  <div className="p-col">
                    {item.ecu && <p>{item.ecu}</p>}
                    {item.iot && <p>{item.iot}</p>}
                    {item.dms && <p>{item.dms}</p>}
                    <Tag
                      value={item?.vehicle_status === 1 ? "Active" : "Deactive"}
                      severity={
                        item?.vehicle_status === 1 ? "success" : "danger"
                      }
                      rounded
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-card-footer mb-2">
            <div className="flex justify-center">
              <Button
                icon="pi pi-map-marker"
                rounded
                outlined
                className="mr-2"
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                severity="info"
              />
              <Button
                icon="pi pi-pencil"
                rounded
                outlined
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                className="mr-2"
                onClick={() => openEditDialog(item)}
              />

              <Button
                icon="pi pi-trash"
                rounded
                outlined
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                className="mr-2"
                severity="danger"
                onClick={() => DeleteDialog(item)}
              />

              <Button
                icon="pi pi-info-circle"
                rounded
                outlined
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                className="mr-2"
                severity="help"
                onClick={() => ViewDialog(item)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      {/* GridView */}
      <DataView
        value={vehiData}
        layout="grid"
        itemTemplate={itemTemplate}
        paginator
        rows={6}
        emptyMessage="No devices found."
      />
      {/* Edit vehicle Data */}
      <Dialog
        visible={editDialog}
        onHide={closeEditDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Device"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="vehicle_name"
                name="vehicle_name"
                onChange={handleChange}
                value={editData?.vehicle_name}
              />
              <label htmlFor="vehicle_name">Vehicle Name</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="vehicle_registration"
                name="vehicle_registration"
                onChange={handleChange}
                value={editData?.vehicle_registration}
              />
              <label htmlFor="vehicle_registration">Vehicle Registration</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="ecu"
                name="ecu"
                optionLabel="device_id"
                optionValue="device_id"
                options={localEcuData}
                onChange={handleChange}
                value={editData?.ecu}
              />
              <label htmlFor="ecu">Select ECU</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="iot"
                name="iot"
                optionLabel="device_id"
                optionValue="device_id"
                options={localIoTData}
                onChange={handleChange}
                value={editData?.iot}
              />
              <label htmlFor="iot">Select IoT</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="dms"
                name="dms"
                optionLabel="device_id"
                optionValue="device_id"
                options={localDMSData}
                onChange={handleChange}
                value={editData?.dms || ""}
              />
              <label htmlFor="dms">Select DMS</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="featureset"
                name="featureset_uuid"
                optionLabel="label"
                optionValue="value"
                options={featuresetOptions()}
                onChange={handleChange}
                value={editData?.featureset_uuid}
              />
              <label htmlFor="status">Select Featureset</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="vehicle_status"
                name="vehicle_status"
                optionLabel="label"
                optionValue="value"
                options={statusOptions}
                onChange={handleChange}
                value={editData?.vehicle_status}
              />
              <label htmlFor="status">Select Status</label>
            </span>
          </div>
          <div className="p-field p-col-12 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Edit Vehicle
            </button>
          </div>
        </form>
      </Dialog>
      {/* Delete vehicle Data */}
      <Dialog
        visible={deleteDialog}
        onHide={DeleteDialog}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-times"
              className="p-button-danger px-3 py-2 hover:bg-none dark:hover:bg-gray-50"
              onClick={handleDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-check"
              className="p-button-secondary px-3 py-2 hover:bg-none dark:hover:bg-gray-50"
              onClick={DeleteDialog}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete ?</div>
      </Dialog>
      {/* ViewDialog */}
      <Dialog
        visible={viewDialog}
        onHide={closeViewDialog}
        header="View Page"
        style={{ width: "70vw" }}
      >
        <TabView>
          <TabPanel header="Vehicle's Trips" leftIcon="pi pi-truck mr-2">
            <VehicleTrips />
          </TabPanel>
          <TabPanel header="Feature Set" leftIcon="pi pi-cog mr-2">
            <FeatureSet myData={myData} closeDialog={closeViewDialog} />
          </TabPanel>
        </TabView>
      </Dialog>
    </div>
  );
}
