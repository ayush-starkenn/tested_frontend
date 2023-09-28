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
  const [recipient, setRecipient] = useState();
  const [check, setCheck] = useState(false);
  const [deleteId, setDeleteId] = useState("");

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

    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  const handleRecipient = (e) => {
    const { value } = e.target;

    setRecipient(value);
    setCheck(true);
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
      value: {
        contact_mobile: el.contact_mobile,
        contact_email: el.contact_email,
      },
    }));
  };

  const parsedRecipients = editData.recipients
    ? JSON.parse(editData.recipients)
    : null;

  //handle Submity function

  const handleSubmit = (e) => {
    e.preventDefault();

    let x;
    if (check === true) {
      x = { ...editData, ["recipients"]: recipient };
    } else {
      x = { ...editData, ["recipients"]: JSON.parse(editData?.recipients) };
    }

    editTrigger(editData?.trigger_id, x);
    setTimeout(() => {
      closeEditDialog();
    }, [500]);
  };

  const mapVehicleName = (vehicleUuid) => {
    const vehicle = vehiData?.find((v) => v.vehicle_uuid === vehicleUuid);
    return vehicle ? vehicle.vehicle_name : "";
  };

  const getRecipientFirstName = (recipients) => {
    try {
      const parsedRecipients = JSON.parse(recipients);
      if (
        parsedRecipients &&
        typeof parsedRecipients === "object" &&
        parsedRecipients.contact_email
      ) {
        const recipientEmail = parsedRecipients.contact_email;
        const contact = contactsData.find(
          (contact) => contact.contact_email === recipientEmail
        );
        return contact ? contact.contact_first_name : "N/A";
      }
    } catch (error) {
      console.error("Error parsing recipients JSON", error);
    }
    return "N/A";
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
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="trigger_name"
          header="Trigger Name"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="trigger_type"
          header="Trigger Type"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="recipients"
          header="Recipient"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
          body={(rowData) => (
            <Tag
              className="my-1 mr-2 bg-gray-200 text-gray-800"
              icon="pi pi-user"
              style={{ width: "100px", height: "25px", lineHeight: "40px" }}
            >
              <span style={{ fontSize: "13px" }}>
                {getRecipientFirstName(rowData.recipients)}
              </span>
            </Tag>
          )}
        />
        <Column
          field="trigger_status"
          header="Status"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={renderStatusCell}
        ></Column>

        <Column
          field="vehicle_uuid"
          header="Vehicle Name"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={(rowData) => (
            <span>{mapVehicleName(rowData.vehicle_uuid)}</span>
          )}
        />
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="dark:bg-navy-800 dark:text-gray-200"
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
                onChange={handleRecipient}
                value={check === false ? parsedRecipients : recipient}
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
              />
              <label htmlFor="recipients">Select Contact</label>
            </span>
          </div>

          <div className="p-field p-col-12 mt-3 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Add Trigger
            </button>
          </div>
        </form>
      </Dialog>
      {/* delete Dialog */}
      <Dialog
        visible={deleteVisible}
        onHide={closeDeleteDialog}
        header="Confirm Delete"
        style={{
          border: "2px solid lightblue",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          animation: "blinkBorder 1s infinite",
        }}
        modal
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
              onClick={closeDeleteDialog}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete ?</div>
      </Dialog>
    </div>
  );
};

export default AlertTriggerList;
