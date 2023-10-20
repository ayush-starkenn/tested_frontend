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
  const [deleteVehicleName, setDeleteVehicleName] = useState("");
  const [myData, setMyData] = useState();
  const [devices, setDevices] = useState({});

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const _filters = { ...filters };
    _filters["global"].value = null;
    setFilters(_filters);
  };

  useEffect(() => {
    // Initialize editData based on default values or props if needed
    setEditData({
      vehicle_name: "",
      vehicle_registration: "",
      ecu: null,
      iot: null,
      dms: null,
      featureset_uuid: null,
      vehicle_status: null,
    });
  }, []);

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
              className="searchbox w-[25vw] cursor-pointer rounded-full border py-3 pl-8 dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text dark:text-gray-50 dark:hover:text-gray-50"
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
        {/* <Link to={`ongoing-trip/${rowData.vehicle_uuid}`} target="_blank">
          <Button
            icon="pi pi-map-marker"
            rounded
            className="mr-2 border border-green-600 text-green-600"
            style={{
              width: "2rem",
              height: "2rem",
            }}
          />
        </Link> */}
        <Button
          icon="pi pi-pencil"
          rounded
          tooltip="Edit"
          tooltipOptions={{ position: "mouse" }}
          className="mr-3 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openEditDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          tooltip="Delete"
          tooltipOptions={{ position: "mouse" }}
          style={{ width: "2rem", height: "2rem" }}
          className="mr-3 border border-red-600 text-red-600"
          onClick={() => DeleteDialog(rowData)}
        />
        <Button
          icon="pi pi-eye"
          rounded
          tooltip="View"
          tooltipOptions={{ position: "mouse" }}
          className="border border-blue-500 text-blue-500 dark:text-blue-500"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => ViewDialog(rowData)}
        />
      </React.Fragment>
    );
  };

  const openEditDialog = (rowData) => {
    setEditDialog(true);
    setEditData(rowData);
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
    setDeleteVehicleName(rowData?.vehicle_name);
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

    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const ecuOptions = () => {
    const options =
      ecuData?.map((el) => ({
        label: el.device_id,
        value: el.device_id,
      })) || [];

    options.unshift({ label: "Unassign", value: "null" });
    return options;
  };

  const iotOptions = () => {
    const options =
      iotData?.map((el) => ({
        label: el.device_id,
        value: el.device_id,
      })) || [];

    options.unshift({ label: "Unassign", value: null });
    return options;
  };

  const dmsOptions = () => {
    const options =
      dmsData?.map((el) => ({
        label: el.device_id,
        value: el.device_id,
      })) || [];

    options.unshift({ label: "Unassign", value: null });
    return options;
  };

  const handleDevices = (e) => {
    const { name, value } = e.target;
    setDevices({ ...devices, [name]: value });
  };

  useEffect(() => {
    console.log(devices.ecu);
  }, [devices]);

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
        emptyMessage="No vehicles found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          header="Sr. No."
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="vehicle_name"
          header="Vehicle name"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="vehicle_registration"
          header="Vehicle registration"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="dms"
          header="DMS"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
          body={(rowData) => renderCellWithNA(rowData.dms)}
        ></Column>
        <Column
          field="ecu"
          header="ECU"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
          body={(rowData) => renderCellWithNA(rowData.ecu)}
        ></Column>
        <Column
          field="iot"
          header="IoT"
          sortable
          className="border-b dark:bg-navy-800  dark:text-gray-200"
          style={{ minWidth: "5rem" }}
          body={(rowData) => renderCellWithNA(rowData.iot)}
        ></Column>

        <Column
          field="vehicle_status"
          header="Status"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={renderStatusCell}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
      </DataTable>
      {/* Edit vehicle Data */}
      <Dialog
        visible={editDialog}
        onHide={closeEditDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Vehicle"
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
                value={editData?.vehicle_name}
                className="border py-2 pl-2"
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
                className="border py-2 pl-2"
              />
              <label htmlFor="vehicle_registration">Vehicle Registration</label>
            </span>
          </div>
          <div className="mx-auto mt-4 w-[34.5vw]">
            <small>Selected ECU</small>
            <p className="rounded-lg bg-gray-200 px-4 py-2">{editData.ecu}</p>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="ecu"
                name="ecu"
                options={ecuOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleDevices}
                value={devices?.ecu === null ? "Unassign" : devices?.ecu}
                className={`border dark:bg-gray-800 `}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select New ECU
              </label>
            </span>
          </div>
          <div className="mx-auto mt-4 w-[34.5vw]">
            <small>Selected IoT</small>
            <p className="rounded-lg bg-gray-200 px-4 py-2">{editData.iot}</p>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="iot"
                name="iot"
                options={iotOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleDevices}
                value={devices?.iot === null ? "Unassign" : devices?.ecu}
                className={`border dark:bg-gray-800 `}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select New IoT
              </label>
            </span>
          </div>
          <div className="mx-auto mt-4 w-[34.5vw]">
            <small>Selected IoT</small>
            <p className="rounded-lg bg-gray-200 px-4 py-2">{editData.dms}</p>
          </div>
          <div className="mx-auto mt-7 w-[34.5vw]">
            <span className="p-float-label">
              <Dropdown
                id="dms"
                name="dms"
                options={dmsOptions()}
                optionLabel="label"
                optionValue="value"
                onChange={handleDevices}
                value={devices?.dms === null ? "Unassign" : devices?.ecu}
                className={`border dark:bg-gray-800 `}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Select New DMS
              </label>
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
                className="border"
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
                className="border"
              />
              <label htmlFor="status">Select Status</label>
            </span>
          </div>
          <div className="p-field p-col-12 mt-7 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Update
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
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white"
              onClick={handleDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 "
              onClick={DeleteDialog}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {deleteVehicleName}?</div>
      </Dialog>

      {/* ViewDialog */}
      <Dialog
        visible={viewDialog}
        onHide={closeViewDialog}
        header="View Page"
        style={{ width: "85vw" }}
      >
        <TabView>
          <TabPanel header="Completed Trips" leftIcon="pi pi-truck mr-2">
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
