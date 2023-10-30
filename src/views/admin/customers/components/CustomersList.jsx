import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
// import { CiMenuKebab } from "react-icons/ci";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

const CustomersList = ({ data, onDelete, onUpdate }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [customerData, setCustomerData] = useState(data);
  const toastRef = useRef(null);
  const toastErr = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const menuRight = useRef(null);

  //For getting serial no. column
  useEffect(() => {
    setCustomerData(
      data.map((customer, index) => ({
        ...customer,
        serialNo: index + 1,
      }))
    );
  }, [data]);

  // Edit Customer Dialog code
  const EditCustomerDialog = ({ visible, onHide, customer }) => {
    const isValidPhoneNumber = (phoneNumber) => {
      // Regular expression to check for exactly 10 digits
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phoneNumber);
    };
    const [editedCustomerData, setEditedCustomerData] = useState(
      customer || {}
    );
    const [isUpdating, setIsUpdating] = useState(false);

    const onSave = async () => {
      if (!isValidPhoneNumber(editedCustomerData.phone)) {
        toastRef.current.show({
          severity: "warn",
          summary: "Invalid Phone Number",
          detail: "Please enter a 10-digit valid phone number.",
          life: 3000,
        });
        return;
      }
      if (
        editedCustomerData.first_name === "" ||
        editedCustomerData.last_name === "" ||
        editedCustomerData.email === "" ||
        editedCustomerData.company_name === "" ||
        editedCustomerData.address === "" ||
        editedCustomerData.city === "" ||
        editedCustomerData.state === "" ||
        editedCustomerData.pincode === "" ||
        editedCustomerData.phone === ""
      ) {
        toastRef.current.show({
          severity: "warn",
          summary: "Missing field",
          detail: "Field cannot be empty",
          life: 3000,
        });
        return;
      }

      try {
        setIsUpdating(true);
        await onUpdate(customer.user_uuid, editedCustomerData);

        // const updatedData = customerData.map((customer) => {
        //   if (customer.user_uuid === editedCustomerData.user_uuid) {
        //     return {
        //       ...customer,
        //       ...editedCustomerData,
        //     };
        //   }
        //   return customer;
        // });
        setIsUpdating(false);
        onHide();
      } catch (error) {
        setIsUpdating(false);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;

      setEditedCustomerData((prevState) => {
        const updatedData = { ...prevState, [name]: value };

        if (name === "first_name") {
          updatedData.full_name = `${value} ${prevState.last_name || ""}`;
        } else if (name === "last_name") {
          updatedData.full_name = `${prevState.first_name || ""} ${value}`;
        }

        const { address, city, state, pincode } = updatedData;
        updatedData.full_address = `${address || ""}, ${city || ""}, ${
          state || ""
        }, ${pincode || ""}`;

        return updatedData;
      });
    };

    const handleUserStatusChange = (event) => {
      const newValue = parseInt(event.target.value);
      setEditedCustomerData({ ...editedCustomerData, user_status: newValue });
    };

    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Edit Customer"
        footer={
          <div>
            <Button
              label={isUpdating ? "Updating..." : "Update"}
              icon={isUpdating ? "pi pi-spin pi-spinner" : "pi pi-check"}
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              disabled={isUpdating}
              onClick={onSave}
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="flex justify-between">
            <div className="card justify-content-center mr-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="first_name"
                  name="first_name"
                  value={editedCustomerData?.first_name || ""}
                  onChange={handleInputChange}
                  className={`border py-2 pl-2 ${
                    !editedCustomerData.first_name ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="first_name" className="dark:text-gray-300">
                  First Name
                </label>
              </span>
            </div>
            <div className="card justify-content-center ml-1 mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="last_name"
                  name="last_name"
                  value={editedCustomerData?.last_name || ""}
                  onChange={handleInputChange}
                  className={`border py-2 pl-2 ${
                    !editedCustomerData.last_name ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="last_name" className="dark:text-gray-300">
                  Last Name
                </label>
              </span>
            </div>
          </div>
          <div className="mx-auto mt-8 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="email"
                type="email"
                name="email"
                value={editedCustomerData?.email || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  !editedCustomerData.email ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="email" className="dark:text-gray-300">
                Email
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="company_name"
                type="text"
                name="company_name"
                value={editedCustomerData?.company_name || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  !editedCustomerData.company_name ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="company_name" className="dark:text-gray-300">
                Company Name
              </label>
            </span>
          </div>
          <div className="mx-auto mb-3 mt-8 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="phone"
                keyfilter="pint"
                type="tel"
                name="phone"
                value={editedCustomerData?.phone || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  isValidPhoneNumber(editedCustomerData?.phone || "")
                    ? ""
                    : "border-red-600"
                }`}
              />
              <label htmlFor="phone" className="dark:text-gray-300">
                Contact Number
              </label>
            </span>
            {!isValidPhoneNumber(editedCustomerData.phone) && (
              <p className="p-error">Contact number must contain 10 digits.</p>
            )}
          </div>
          <div className="mx-auto mt-6 w-[50.1vw]">
            <span>Address:</span>
          </div>
          <div className="mx-auto mt-6 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="address"
                type="text"
                name="address"
                value={editedCustomerData?.address || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  !editedCustomerData.address ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="address" className="dark:text-gray-300">
                Flat No./ Plot No., Area/Society
              </label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="city"
                type="text"
                name="city"
                value={editedCustomerData?.city || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  !editedCustomerData.city ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="city" className="dark:text-gray-300">
                City
              </label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="state"
                type="text"
                name="state"
                value={editedCustomerData?.state || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  !editedCustomerData.state ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="state" className="dark:text-gray-300">
                State
              </label>
            </span>
          </div>
          <div className="mx-auto mt-6 w-[50.1vw]">
            <span className="p-float-label">
              <InputText
                id="pincode"
                type="text"
                name="pincode"
                value={editedCustomerData?.pincode || ""}
                onChange={handleInputChange}
                className={`border py-2 pl-2 ${
                  !editedCustomerData.pincode ? "border-red-600" : ""
                }`}
              />
              <label htmlFor="pincode" className="dark:text-gray-300">
                Pincode
              </label>
            </span>
          </div>

          <div className="my-4">
            <input
              type="radio"
              className="inlinemx-2 mx-2"
              name="user_status"
              id="userActive"
              value={1}
              onChange={handleUserStatusChange}
              checked={editedCustomerData.user_status === 1}
            />
            <label htmlFor="userActive">Active</label>
            <input
              type="radio"
              className="mx-2 inline"
              name="user_status"
              id="userDeactive"
              value={2}
              onChange={handleUserStatusChange}
              checked={editedCustomerData.user_status === 2}
            />
            <label htmlFor="userDeactive">Deactive</label>
          </div>
        </div>
      </Dialog>
    );
  };

  // Delete Customer Dialog code
  const DeleteCustomerDialog = ({ visible, onHide, customer }) => {
    const handleConfirmDelete = async () => {
      try {
        // Send the delete request using the onDelete prop
        await onDelete(customer.user_uuid);
        // If the delete is successful, update the customerData state to remove the deleted customer
        const updatedData = await customerData
          .filter((c) => c.user_uuid !== customer.user_uuid)
          .map((customer, index) => ({
            ...customer,
            serialNo: index + 1,
            key: customer.user_uuid,
          }));

        setCustomerData(updatedData);

        onHide();
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Customer ${selectedCustomer?.first_name} deleted successfully`,
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        onHide();
        toastErr.current.show({
          severity: "danger",
          summary: "Error",
          detail: "Error while deleting",
          life: 3000,
        });
      }
    };

    // Delete dialog
    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={handleConfirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={onHide}
            />
          </div>
        }
      >
        <div>
          Are you sure you want to delete {selectedCustomer?.full_name}?
        </div>
      </Dialog>
    );
  };

  // Global Filter
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

  const header = (
    <div className="align-items-center flex flex-wrap justify-end gap-2 py-3 dark:bg-gray-950">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
          className="searchbox dark:stext-gray-50 w-[25vw] cursor-pointer rounded-full border py-3 pl-8 dark:bg-gray-950"
        />
        {globalFilterValue && (
          <Button
            icon="pi pi-times"
            className="p-button-rounded  p-button-text dark:text-gray-50 dark:hover:text-gray-50"
            onClick={clearSearch}
          />
        )}
      </span>
    </div>
  );

  // Action menu
  const actionBodyTemplate = (rowData) => {
    const handleEdit = () => {
      setEditedCustomer(rowData);
      setEditDialogVisible(true);
    };

    const handleDelete = () => {
      setSelectedCustomer(rowData);
      setDeleteDialogVisible(true);
    };

    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          className="mr-3 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          tooltip="Edit"
          tooltipOptions={{ position: "mouse" }}
          onClick={handleEdit}
        />
        <Button
          icon="pi pi-trash"
          rounded
          tooltip="Delete"
          tooltipOptions={{ position: "mouse" }}
          style={{ width: "2rem", height: "2rem" }}
          className="mr-3 border border-red-600 text-red-600"
          onClick={handleDelete}
        />
        {/* <Button
          rounded
          tooltip="More"
          tooltipOptions={{ position: "mouse" }}
          className="border border-blue-500 text-blue-500 dark:text-blue-500"
          onClick={(event) => menuRight.current.toggle(event)}
          style={{ padding: "0.4rem" }}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <CiMenuKebab />
        </Button> */}
        <Menu
          model={[
            {
              label: "Rights Management",
              icon: "pi pi-lock",
              // command: () => {
              //   navigate("/edit-customer");
              // },
            },
            {
              label: "Manage Assigned",
              icon: "pi pi-users",
              // command: () => {
              //   navigate("/edit-customer");
              // },
            },
            {
              label: "Manage Unassigned",
              icon: "pi pi-user-minus",
              // command: () => {
              //   navigate("/edit-customer");
              // },
            },
          ]}
          popup
          ref={menuRight}
          id="popup_menu_right"
          popupAlignment="right"
        />
      </React.Fragment>
    );
  };

  // status body
  const getStatusSeverity = (option) => {
    switch (option) {
      case 1:
        return "success";

      case 2:
        return "danger";

      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.user_status === 1 ? "Active" : "Deactive"}
        severity={getStatusSeverity(rowData.user_status)}
      />
    );
  };

  // Customers List
  return (
    <div>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} className="bg-red-400" />
      <DataTable
        removableSort
        value={customerData}
        selection={selectedCustomer}
        onSelectionChange={(e) => setSelectedCustomer(e.value)}
        dataKey="user_uuid"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        filterDisplay="menu"
        filters={filters}
        globalFilterFields={[
          "full_name",
          "email",
          "company_name",
          "phone",
          "user_status",
        ]}
        emptyMessage="No customers found."
        header={header}
      >
        <Column
          key="user_uuid"
          field="serialNo"
          header="Sr. no."
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "3rem" }}
        />
        <Column
          key="user_uuid"
          field="full_name"
          header="Name"
          style={{ minWidth: "8rem" }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          body={(rowData) => (
            <>
              {rowData.first_name.charAt(0).toUpperCase() +
                rowData.first_name.slice(1)}{" "}
              {rowData.last_name.charAt(0).toUpperCase() +
                rowData.last_name.slice(1)}
            </>
          )}
        />
        <Column
          key="user_uuid"
          field="email"
          header="Email"
          style={{ minWidth: "10rem" }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
        />
        <Column
          key="user_uuid"
          field="company_name"
          header="Company Name"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        />
        <Column
          key="user_uuid"
          field="phone"
          header="Contact No."
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
        />
        <Column
          key="user_uuid"
          field="user_status"
          header="Status"
          body={statusBodyTemplate}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
        />
        <Column
          key="user_uuid"
          header="Action"
          headerStyle={{ width: "9rem", textAlign: "left" }}
          bodyStyle={{ textAlign: "left", overflow: "visible" }}
          body={actionBodyTemplate}
          className="border-b dark:bg-navy-800 "
        />
      </DataTable>
      <EditCustomerDialog
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        customer={editedCustomer}
      />
      <DeleteCustomerDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersList;
