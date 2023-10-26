import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { CiMenuKebab } from "react-icons/ci";
// import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

const applyFilters = (filters, allData) => {
  let filteredData = allData;
  //condition to exclude these fields for global search
  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "label" &&
          key !== "password" &&
          key !== "accessToken" &&
          key !== "confirmPassword" &&
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "userId" &&
          key !== "user_type" &&
          key !== "_id" &&
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
      )
    );
  }

  return filteredData;
};

export default function CustomersGrid({ data, onDelete, onUpdate }) {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  // const menuLeft = useRef(null);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const totalItems = filteredData.length;
  const toastRef = useRef(null);
  const toastErr = useRef(null);

  //Global Search
  useEffect(() => {
    setAllData(data);
    const filteredData = applyFilters(filters, data);
    setFilteredData(filteredData);
  }, [data, filters]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    const updatedFilters = {
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const updatedFilters = {
      ...filters,
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  //delete api call
  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(selectedCustomer.user_uuid);

      const updatedData = allData.filter(
        (customer) => customer.user_uuid !== selectedCustomer.user_uuid
      );

      setAllData(updatedData);
      const filteredData = applyFilters(filters, updatedData);
      setFilteredData(filteredData);
      setSelectedCustomer(null);
      setIsDeleteDialogVisible(false);
      toastRef.current.show({
        severity: "success",
        summary: "Customer Deleted",
        detail: `Customer ${selectedCustomer?.first_name} deleted successfully`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      setIsDeleteDialogVisible(false);
      toastErr.current.show({
        severity: "danger",
        summary: "Error",
        detail: "Error while deleting",
        life: 3000,
      });
    }
  };

  //card
  const itemTemplate = (item) => {
    const tagSeverity = item?.user_status === 1 ? "success" : "danger";
    return (
      <div className="p-col-12 mb-6 rounded-lg bg-gray-50 transition duration-300 ease-in-out hover:shadow-lg dark:bg-gray-900 dark:text-gray-150">
        <div className="card flex h-full flex-col">
          <div className="card-header flex justify-between">
            <div className="p-text-bold">
              <span>
                {item.first_name.charAt(0).toUpperCase() +
                  item.first_name.slice(1)}{" "}
                {item.last_name.charAt(0).toUpperCase() +
                  item.last_name.slice(1)}
              </span>
            </div>
            <div className="p-text-bold">
              <Tag
                value={item.user_status === 1 ? "Active" : "Deactive"}
                severity={tagSeverity}
              />
            </div>
          </div>
          <div className="card-body px-6">
            <div className="flex justify-between pb-1">
              <div className="mr-16  flex-shrink-0 font-semibold">
                <span>Email</span>
              </div>
              <div>
                <span>{item.email}</span>
              </div>
            </div>
            <div className="flex justify-between py-1">
              <div className="mr-16 flex-shrink-0 font-semibold">
                <span>Address</span>
              </div>
              <div className="text-end">
                <span>{item.full_address}</span>
              </div>
            </div>
            <div className="flex  justify-between py-1">
              <div className="mr-16  flex-shrink-0 font-semibold">
                <span>Company Name</span>
              </div>
              <div>
                <span>{item.company_name}</span>
              </div>
            </div>
            <div className="text-bold flex justify-between py-1">
              <div className="mr-16 flex-shrink-0 font-semibold">
                <span>Contact No.</span>
              </div>
              <div>
                <span>{item.phone}</span>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-auto px-6 py-3">
            <Button
              icon="pi pi-pencil"
              rounded
              tooltip="Edit"
              tooltipOptions={{ position: "mouse" }}
              className="mr-3 border border-gray-700 text-gray-700"
              style={{ width: "2rem", height: "2rem" }}
              onClick={() => handleEdit(item)}
            />
            <Button
              icon="pi pi-trash"
              rounded
              tooltip="Delete"
              tooltipOptions={{ position: "mouse" }}
              style={{ width: "2rem", height: "2rem" }}
              className="mr-3 border border-red-600 text-red-600"
              onClick={() => handleDelete(item)}
            />
            {/* <Button
              rounded
              tooltip="More"
              tooltipOptions={{ position: "mouse" }}
              className="border border-blue-500 text-blue-500 dark:text-blue-500"
              onClick={(event) => menuLeft.current.toggle(event)}
              style={{ padding: "0.4rem" }}
              aria-controls="popup_menu_right"
              aria-haspopup
            >
              <CiMenuKebab />
            </Button>
            <Menu
              model={[
                {
                  label: "Rights Management",
                  icon: "pi pi-lock",
                },
                {
                  label: "Manage Assigned",
                  icon: "pi pi-users",
                },
                {
                  label: "Manage Unassigned",
                  icon: "pi pi-user-minus",
                },
              ]}
              popup
              ref={menuLeft}
              id="popup_menu_left"
              popupAlignment="left"
            /> */}
          </div>
        </div>
      </div>
    );
  };

  //edit api call
  const handleEdit = (customer) => {
    setEditedCustomer(customer);
    setIsEditDialogVisible(true);
  };

  const EditCustomerDialog = ({ visible, onHide, customer }) => {
    const [editedCustomerData, setEditedCustomerData] = useState(
      customer || {}
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const isValidPhoneNumber = (phoneNumber) => {
      // Regular expression to check for exactly 10 digits
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phoneNumber);
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

        setAllData(allData);
        const filteredData = applyFilters(filters, allData);
        setFilteredData(filteredData);
        setEditedCustomer(null);
        setIsEditDialogVisible(false);
      } catch (error) {
        console.error("Save error:", error);
        toastErr.current.show({
          severity: "danger",
          summary: "Error",
          detail: "Error while saving",
          life: 3000,
        });
      } finally {
        setIsUpdating(false); // Complete the update process
      }
    };

    //edit customer dialog
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
  //searchbox
  return (
    <div>
      <div className="my-4 mr-7  flex justify-end">
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
                className="p-button-rounded  p-button-text dark:text-gray-50 dark:hover:text-gray-50"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} className="bg-red-400" />

      {/* Grid view of customers */}
      <DataView
        value={filteredData}
        itemTemplate={itemTemplate}
        layout="grid"
        paginator
        rows={6}
        emptyMessage="No customers found."
      />
      <p className="text-center text-gray-700">Total Items : {totalItems}</p>

      {/* delete dialog */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={confirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={() => setIsDeleteDialogVisible(false)}
            />
          </div>
        }
      >
        <div>
          Are you sure you want to delete {selectedCustomer?.full_name}?
        </div>
      </Dialog>
      <EditCustomerDialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        customer={editedCustomer}
      />
    </div>
  );
}
