import Cookies from "js-cookie";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { TabPanel, TabView } from "primereact/tabview";
import VehicleTrips from "./VehicleTrips";
import FeatureSet from "./FeatureSet";
import { Link } from "react-router-dom";

export default function VehiclesList({
  vehiData,
  editvehicle,
  deleteVehicle,
  ecuData,
  iotData,
  dmsData,
  feauresetData,
}) {
  const token = Cookies.get("token");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [localEcuData, setLocalEcuData] = useState([]);
  const [localIoTData, setLocalIoTData] = useState([]);
  const [localDMSData, setLocalDMSData] = useState([]);
  const [myData, setMyData] = useState();

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearSearch = () => {
    setGlobalFilterValue(""); // Clear the search input value
    const _filters = { ...filters };
    _filters["global"].value = null; // Clear the global filter value
    setFilters(_filters);
  };

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

  const renderHeader = () => {
    return (
      <div className="my-4 flex justify-end">
        <div className="justify-content-between align-items-center flex flex-wrap gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              className="searchbox w-[25vw] cursor-pointer rounded-full dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
    );
  };
  const header = renderHeader();

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Link to={`ongoing-trip/${rowData.vehicle_uuid}`} target="_blank">
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
        </Link>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openEditDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          style={{ width: "2rem", height: "2rem" }}
          severity="danger"
          className="mr-2"
          onClick={() => DeleteDialog(rowData)}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="text-red-500 dark:text-blue-500"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => ViewDialog(rowData)}
        />
      </React.Fragment>
    );
  };

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

  const ViewDialog = (rowData) => {
    setMyData(rowData);
    setViewDialog(true);
  };
  const closeViewDialog = () => {
    setViewDialog(false);
  };

  const handleDelete = () => {
    if (deleteId !== "") {
      deleteVehicle(deleteId, token);
      DeleteDialog();
    }
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

  const renderStatusCell = (rowData) => {
    const tagValue = rowData?.vehicle_status === 1 ? "Active" : "Deactive";
    const tagSeverity = rowData?.vehicle_status === 1 ? "success" : "danger";

    return <Tag value={tagValue} severity={tagSeverity} />;
  };

  const renderCellWithNA = (data) => {
    return data ? data : "--";
  };

  return (
    <div>
      <DataTable
        value={vehiData}
        paginator
        dataKey="vehicle_uuid"
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "vehicle_name",
          "vehicle_registration",
          "ecu",
          "iot",
          "dms",
        ]}
        emptyMessage="No devices found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          header="SR.NO"
          className="border-none dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
        <Column
          field="vehicle_name"
          header="vehicle_name"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="vehicle_registration"
          header="vehicle_registration"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="dms"
          header="DMS"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
          body={(rowData) => renderCellWithNA(rowData.dms)}
        ></Column>
        <Column
          field="ecu"
          header="ECU"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
          body={(rowData) => renderCellWithNA(rowData.ecu)}
        ></Column>
        <Column
          field="iot"
          header="IoT"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
          body={(rowData) => renderCellWithNA(rowData.iot)}
        ></Column>

        <Column
          field="vehicle_status"
          header="Status"
          sortable
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={renderStatusCell}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="dark:bg-gray-900 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
        ></Column>
      </DataTable>
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
                value={editData?.ecu || ""}
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
                value={editData?.iot || ""}
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
              className="p-button-danger mr-2 px-3 hover:bg-none dark:hover:bg-gray-50"
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
            <VehicleTrips myData={myData} />
          </TabPanel>
          <TabPanel header="Feature Set" leftIcon="pi pi-cog mr-2">
            <FeatureSet myData={myData} closeDialog={closeViewDialog} />
          </TabPanel>
        </TabView>
      </Dialog>
    </div>
  );
}
