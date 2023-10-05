import Cookies from "js-cookie";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useState } from "react";

const AlertTriggerList = ({
  data,
  editTrigger,
  deleteTrigger,
  contactsData,
  vehiData,
}) => {
  const token = Cookies.get("token");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const [deleteId, setDeleteId] = useState("");
  const [triggerName, setTriggerName] = useState("");

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
        <Button
          icon="pi pi-pencil"
          rounded
          className="mr-2 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openEditDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          style={{ width: "2rem", height: "2rem" }}
          className="mr-2 border border-red-600 text-red-600"
          onClick={() => openDeleteDialog(rowData)}
        />
      </React.Fragment>
    );
  };

  //dialog functions

  const openEditDialog = (rowData) => {
    setEditData(rowData);
    setEditVisible(true);
  };

  const closeEditDialog = () => {
    setEditVisible(false);
  };

  const openDeleteDialog = (rowData) => {
    setDeleteId(rowData.trigger_id);
    setTriggerName(rowData.trigger_name);
    setDeleteVisible(true);
  };

  const closeDeleteDialog = () => {
    setDeleteVisible(false);
  };

  //options
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
    const tagValue = rowData?.trigger_status === 1 ? "Active" : "Deactive";
    const tagSeverity = rowData?.trigger_status === 1 ? "success" : "danger";

    return <Tag value={tagValue} severity={tagSeverity} />;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  const vehiclesOptions = () => {
    return vehiData?.map((el) => ({
      label: el.vehicle_name,
      value: el.vehicle_uuid,
    }));
  };

  const contactsOptions = () => {
    return contactsData?.map((el) => ({
      label: el.contact_first_name + " " + el.contact_last_name,
      value: el.contact_uuid,
    }));
  };

  //handle Submity function

  const handleSubmit = (e) => {
    e.preventDefault();

    editTrigger(editData?.trigger_id, editData);
    setTimeout(() => {
      closeEditDialog();
    }, [500]);
  };

  const mapVehicleName = (vehicleUuid) => {
    const vehicle = vehiData?.find((v) => v.vehicle_uuid === vehicleUuid);
    return vehicle ? vehicle.vehicle_name : "";
  };

  const handleDelete = () => {
    deleteTrigger(deleteId, token);
    closeDeleteDialog();
  };

  return (
    <div>
      <DataTable
        value={data}
        paginator
        dataKey="trigger_id"
        header={header}
        rows={5}
        removableSort
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "trigger_name",
          "trigger_type",
          "trigger_status",
          "recipients",
          "vehicle_uuid",
        ]}
        emptyMessage="No devices found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          header="Sr. No."
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="trigger_name"
          header="Trigger Name"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
          body={(rowData) => (
            <>
              {rowData.trigger_name.charAt(0).toUpperCase() +
                rowData.trigger_name.slice(1)}
            </>
          )}
        ></Column>
        <Column
          field="trigger_type"
          header="Trigger Type"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="recipients"
          header="Recipient"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
          body={(rowData) => {
            console.log(rowData);
            const matchingContacts = contactsData.filter(
              (el) => el.contact_uuid === rowData.recipients
            );
            return (
              <>
                {matchingContacts.map((contact) => (
                  <Tag
                    key={contact.contact_uuid}
                    className="my-1 mr-2 bg-gray-200 text-gray-800"
                    icon="pi pi-user"
                    style={{
                      width: "fit-content",
                      height: "25px",
                      lineHeight: "40px",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>
                      {contact.contact_first_name +
                        " " +
                        contact.contact_last_name}
                    </span>
                  </Tag>
                ))}
              </>
            );
          }}
        />

        <Column
          field="trigger_status"
          header="Status"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={renderStatusCell}
        ></Column>

        <Column
          field="vehicle_uuid"
          header="Vehicle Name"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={(rowData) => (
            <span>{mapVehicleName(rowData.vehicle_uuid)}</span>
          )}
        />
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
        ></Column>
      </DataTable>
      {/* edit Dialog */}
      <Dialog
        visible={editVisible}
        onHide={closeEditDialog}
        style={{
          width: "40rem",
        }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="mx-auto mt-5 w-[34.5vw]">
            <span className="p-float-label">
              <InputText
                id="trigger_type"
                name="trigger_type"
                value={editData?.trigger_type}
                className="border py-2 pl-2"
              />
              <label htmlFor="trigger_type">Trigger Type</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className={"p-float-label"}>
              <InputText
                id="trigger_name"
                name="trigger_name"
                onChange={handleChange}
                value={editData?.trigger_name}
                className="border py-2 pl-2"
              />
              <label htmlFor="trigger_name">Trigger Name</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className={"p-float-label"}>
              <Dropdown
                id="vehicle_uuid"
                name="vehicle_uuid"
                optionLabel="label"
                optionValue="value"
                options={vehiclesOptions()}
                onChange={handleChange}
                value={editData?.vehicle_uuid}
                className="border"
              />
              <label htmlFor="vehicle_uuid">Select Vehicle</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className={"p-float-label"}>
              <InputText
                id="trigger_description"
                name="trigger_description"
                onChange={handleChange}
                value={editData?.trigger_description}
                className="border py-2 pl-2"
              />
              <label htmlFor="trigger_description">Trigger Description</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className={"p-float-label"}>
              <Dropdown
                id="recipients"
                name="recipients"
                optionLabel="label"
                optionValue="value"
                options={contactsOptions()}
                onChange={handleChange}
                value={editData?.recipients}
                className="border"
              />
              <label htmlFor="recipients">Select Contact</label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[34.5vw]">
            <span className={"p-float-label"}>
              <Dropdown
                id="trigger_status"
                name="trigger_status"
                optionLabel="label"
                optionValue="value"
                options={statusOptions}
                onChange={handleChange}
                value={editData?.trigger_status}
                className="border"
              />
              <label htmlFor="trigger_status">Select Status</label>
            </span>
          </div>

          <div className="p-field p-col-12 mt-3 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Edit Alert Trigger
            </button>
          </div>
        </form>
      </Dialog>
      {/* delete Dialog */}
      <Dialog
        visible={deleteVisible}
        onHide={closeDeleteDialog}
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
              onClick={closeDeleteDialog}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {triggerName}?</div>
      </Dialog>
    </div>
  );
};

export default AlertTriggerList;
