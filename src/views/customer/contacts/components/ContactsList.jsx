import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";

const ContactsList = ({ contactsData, editContacts, deleteContact }) => {
  const [isDialog, setIsDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const toastRef = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [editId, setEditId] = useState("");
  const [fieldValidities, setFieldValidities] = useState({
    contact_first_name: true,
    contact_last_name: true,
    contact_email: true,
    contact_mobile: true,
    contact_status: true,
  });

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
    setEditData({
      ...rowData,
      contact_status: rowData.contact_status.toString(),
    });
  };

  const closeDialog = () => {
    setIsDialog(false);
    setFieldValidities({
      contact_first_name: true,
      contact_last_name: true,
      contact_email: true,
      contact_mobile: true,
      contact_status: true,
    });
  };

  const openDeleteDialog = (rowData) => {
    setDeleteDialog(true);
    setDeleteId(rowData.contact_uuid);
    setDeleteName(rowData.contact_first_name + " " + rowData.contact_last_name);
  };
  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleDelete = () => {
    if (deleteId !== "") {
      deleteContact(deleteId, deleteName);
      closeDeleteDialog();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = Object.values(editData).every((value) => value !== "");
    const isValidPhoneNumber = (phoneNumber) => {
      // Regular expression to check for exactly 10 digits
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phoneNumber);
    };
    // Update field validities based on the check
    const newFieldValidities = {};
    for (const key in editData) {
      if (editData.hasOwnProperty(key)) {
        newFieldValidities[key] = editData[key] !== "";
      }
    }
    setFieldValidities(newFieldValidities);
    if (!isValid) {
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
    }
    if (!isValidPhoneNumber(editData.contact_mobile)) {
      toastRef.current.show({
        severity: "warn",
        summary: "Invalid Phone Number",
        detail: "Please enter a 10-digit valid phone number.",
        life: 3000,
      });
      return;
    }
    if (isValid) {
      editContacts(editId, editData);
      closeDialog();
    }
  };
  const getClassName = (fieldName) => {
    return fieldValidities[fieldName] ? "" : "border-red-600";
  };

  const stateOptions = [
    { label: "Active", value: "1" },
    { label: "Deactive", value: "2" },
  ];

  //onChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFieldValidities = { ...fieldValidities };

    // Check if the value is not empty and update the field validity
    newFieldValidities[name] = value !== "";
    setFieldValidities(newFieldValidities);

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
          tooltip="Edit"
          tooltipOptions={{ position: "mouse" }}
          className="mr-3 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          tooltip="Delete"
          tooltipOptions={{ position: "mouse" }}
          style={{ width: "2rem", height: "2rem" }}
          className="border border-red-600 text-red-600"
          onClick={() => openDeleteDialog(rowData)}
        />
      </React.Fragment>
    );
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div>
        <DataTable
          value={contactsData}
          paginator
          dataKey="contact_uuid"
          header={header}
          rows={5}
          removableSort
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
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "4rem" }}
          ></Column>
          <Column
            field="full_name"
            header="Name"
            sortable
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="contact_email"
            header="Email"
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="contact_mobile"
            header="Mobile Number"
            className="border-b dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="contact_status"
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
            style={{ minWidth: "6rem" }}
          ></Column>
        </DataTable>
        {/* Dialog to Edit contact */}
        <Dialog
          visible={isDialog}
          onHide={closeDialog}
          style={{ width: "45vw" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Edit the details"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit}>
            <div className="mx-auto mt-8">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_first_name"
                  name="contact_first_name"
                  onChange={handleChange}
                  value={editData?.contact_first_name}
                  className={`border py-2 pl-2 ${getClassName(
                    "contact_first_name"
                  )}`}
                />
                <label
                  htmlFor="contact_first_name"
                  className="dark:text-gray-300"
                >
                  First Name
                </label>
              </span>
            </div>
            <div className="mx-auto mt-7">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_last_name"
                  name="contact_last_name"
                  onChange={handleChange}
                  value={editData?.contact_last_name}
                  className={`border py-2 pl-2 ${getClassName(
                    "contact_last_name"
                  )}`}
                />
                <label
                  htmlFor="contact_last_name"
                  className="dark:text-gray-300"
                >
                  Last Name
                </label>
              </span>
            </div>
            <div className="mx-auto mt-7">
              <span className={`p-float-label`}>
                <InputText
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  onChange={handleChange}
                  value={editData?.contact_email}
                  className={`border py-2 pl-2 ${getClassName(
                    "contact_email"
                  )}`}
                />
                <label htmlFor="contact_email" className="dark:text-gray-300">
                  Email
                </label>
              </span>
            </div>
            <div className="mx-auto mt-7">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_mobile"
                  name="contact_mobile"
                  keyfilter="pint"
                  onChange={handleChange}
                  value={editData?.contact_mobile}
                  className={`border py-2 pl-2 ${getClassName(
                    "contact_mobile"
                  )}`}
                />
                <label htmlFor="contact_mobile" className="dark:text-gray-300">
                  Mobile Number
                </label>
              </span>
            </div>
            <div className="mx-auto mt-7">
              <span className="p-float-label">
                <Dropdown
                  id="status"
                  name="contact_status"
                  options={stateOptions}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) => {
                    handleChange(e, "contact_status");
                  }}
                  value={editData?.contact_status}
                  className="border"
                />
                <label htmlFor="status" className="dark:text-gray-300">
                  Status
                </label>
              </span>
            </div>
            <div className="p-field p-col-12 mt-7 flex justify-center">
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
                icon="pi pi-check"
                className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
                onClick={handleDelete}
              />
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
                onClick={closeDeleteDialog}
              />
            </div>
          }
        >
          <div>Are you sure you want to delete {deleteName}?</div>
        </Dialog>
      </div>
    </>
  );
};

export default ContactsList;
