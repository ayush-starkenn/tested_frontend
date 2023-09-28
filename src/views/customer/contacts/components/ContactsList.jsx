import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useState } from "react";

const ContactsList = ({ contactsData, editContacts, deleteContact }) => {
  const [isDialog, setIsDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");

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

  const openDialog = (rowData) => {
    setIsDialog(true);
    setEditId(rowData.contact_uuid);
    setEditData(rowData);
  };

  const closeDialog = () => {
    setIsDialog(false);
  };

  const openDeleteDialog = (rowData) => {
    setDeleteDialog(true);
    setDeleteId(rowData.contact_uuid);
  };
  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleDelete = () => {
    if (deleteId !== "") {
      deleteContact(deleteId);
      closeDeleteDialog();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId && editData) {
      editContacts(editId, editData);
    }
  };

  //onChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  //
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

  //
  const renderStatusCell = (rowData) => {
    const tagValue = rowData?.contact_status === 1 ? "Active" : "Deactive";
    const tagSeverity = rowData?.contact_status === 1 ? "success" : "danger";

    return <Tag value={tagValue} severity={tagSeverity} />;
  };
  //
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog(rowData)}
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

  return (
    <div>
      <DataTable
        value={contactsData}
        paginator
        dataKey="contact_uuid"
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "contact_first_name",
          "contact_last_name",
          "contact_email",
          "contact_mobile",
          "contact_status",
        ]}
        emptyMessage="No contacts found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          header="Sr. No."
          className="border-none dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem" }}
        ></Column>
        <Column
          field="full_name"
          header="Name"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="contact_email"
          header="Email"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="contact_mobile"
          header="Mobile Number"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="contact_status"
          header="Status"
          sortable
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={renderStatusCell}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
        ></Column>
      </DataTable>
      {/* dialog to Edit contact */}
      <Dialog
        visible={isDialog}
        onHide={closeDialog}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit}>
          <div className="mx-auto mt-1 w-[34.5vw]">
            <span className={`p-float-label `}>
              <InputText
                id="contact_first_name"
                name="contact_first_name"
                onChange={handleChange}
                value={editData?.contact_first_name}
              />
              <label htmlFor="contact_first_name">First Name</label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className={`p-float-label `}>
              <InputText
                id="contact_last_name"
                name="contact_last_name"
                onChange={handleChange}
                value={editData?.contact_last_name}
              />
              <label htmlFor="contact_last_name">Last Name</label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className={`p-float-label`}>
              <InputText
                id="contact_email"
                name="contact_email"
                type="email"
                onChange={handleChange}
                value={editData?.contact_email}
              />
              <label htmlFor="contact_email">Email</label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[34.5vw]">
            <span className={`p-float-label `}>
              <InputText
                id="contact_mobile"
                name="contact_mobile"
                keyfilter="pint"
                onChange={handleChange}
                value={editData?.contact_mobile}
              />
              <label htmlFor="contact_mobile">Mobile Number</label>
            </span>
          </div>
          <div className="p-field p-col-12 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Edit Contact
            </button>
          </div>
        </form>
      </Dialog>
      {/* Delete vehicle Data */}
      <Dialog
        visible={deleteDialog}
        onHide={closeDeleteDialog}
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

export default ContactsList;
