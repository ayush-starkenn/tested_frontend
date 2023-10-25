import Cookies from "js-cookie";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
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
  const user_uuid = Cookies.get("user_uuid");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [triggerName, setTriggerName] = useState("");
  const [recipientsData, setRecipientsData] = useState([]);

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
          className="border border-red-600 text-red-600"
          onClick={() => openDeleteDialog(rowData)}
        />
      </React.Fragment>
    );
  };

  //dialog functions

  const openEditDialog = (rowData) => {
    setEditData(rowData);
    let x = JSON.parse(rowData.recipients);
    setRecipientsData(x);
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

  //handle Submity function

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {
      trigger_name: editData.trigger_name,
      trigger_description: editData.trigger_description,
      vehicle_uuid: editData.vehicle_uuid,
      trigger_type: editData.trigger_type,
      recipients: JSON.stringify(selectedContacts),
      trigger_status: editData.trigger_status,
      user_uuid: user_uuid,
    };

    editTrigger(editData?.trigger_id, updateData);
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

  const handleContactChange = (contactId, type) => {
    let updatedRecipientsData = [...recipientsData];
    const recipientIndex = updatedRecipientsData.findIndex(
      (recipient) => recipient.recipients === contactId
    );

    if (recipientIndex !== -1) {
      // If the recipient exists in the list, toggle the type
      updatedRecipientsData[recipientIndex][type] =
        !updatedRecipientsData[recipientIndex][type];

      // Check if both email and mobile are unchecked, then remove the recipient
      if (
        !updatedRecipientsData[recipientIndex].email &&
        !updatedRecipientsData[recipientIndex].mobile
      ) {
        updatedRecipientsData.splice(recipientIndex, 1);
      }
    } else {
      // If the recipient doesn't exist, add it to the list
      updatedRecipientsData.push({
        recipients: contactId,
        [type]: true,
        [type === "email" ? "mobile" : "email"]: false,
      });
    }

    setRecipientsData(updatedRecipientsData);

    // Update the state with the new updatedRecipientsData

    // Collect selected contacts, excluding those with empty values and recipients key
    const selectedContacts = contactsData
      .map((contact) => {
        const email = updatedRecipientsData.some(
          (recipient) =>
            recipient.recipients === contact.contact_uuid && recipient.email
        );
        const mobile = updatedRecipientsData.some(
          (recipient) =>
            recipient.recipients === contact.contact_uuid && recipient.mobile
        );

        if (email || mobile) {
          const selectedContact = { recipients: contact.contact_uuid };

          if (email) {
            selectedContact.email = getContactEmailFromData(
              contact.contact_uuid
            );
          }
          if (mobile) {
            selectedContact.mobile = getContactMobileFromData(
              contact.contact_uuid
            );
          }

          return selectedContact;
        } else {
          return null; // Exclude objects with empty values and recipients key
        }
      })
      .filter(Boolean); // Remove null values

    setSelectedContacts(selectedContacts);
  };

  const getContactEmailFromData = (contactId) => {
    // Find the contact in contactsData by contactId and return the email
    const contact = contactsData.find((c) => c.contact_uuid === contactId);
    return contact ? contact.contact_email : "";
  };

  const getContactMobileFromData = (contactId) => {
    // Find the contact in contactsData by contactId and return the mobile
    const contact = contactsData.find((c) => c.contact_uuid === contactId);
    return contact ? contact.contact_mobile : "";
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
          style={{ minWidth: "8rem", maxWidth: "14rem" }}
          body={(rowData) => {
            // Parse the recipients string into an array of objects
            const recipientsArray = JSON.parse(rowData.recipients);

            return (
              <>
                {recipientsArray.map((recipient, index) => {
                  // Find the matching contact based on contact_uuid
                  const matchingContact = contactsData.find(
                    (contact) => contact.contact_uuid === recipient.recipients
                  );

                  if (matchingContact) {
                    return (
                      <Tag
                        key={index}
                        className="my-1 mr-2 bg-gray-200 text-gray-800"
                        icon="pi pi-user"
                        style={{
                          width: "fit-content",
                          height: "25px",
                          lineHeight: "40px",
                        }}
                      >
                        <span style={{ fontSize: "12px" }}>
                          {matchingContact.contact_first_name +
                            " " +
                            matchingContact.contact_last_name}
                        </span>
                      </Tag>
                    );
                  } else {
                    return null;
                  }
                })}
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
          style={{ minWidth: "8rem" }}
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
              <label htmlFor="trigger_type" className="dark:text-gray-300">
                Trigger Type
              </label>
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
              <label htmlFor="trigger_name" className="dark:text-gray-300">
                Trigger Name
              </label>
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
              <label htmlFor="vehicle_uuid" className="dark:text-gray-300">
                Select Vehicle
              </label>
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
              <label
                htmlFor="trigger_description"
                className="dark:text-gray-300"
              >
                Trigger Description
              </label>
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
              <label htmlFor="trigger_status" className="dark:text-gray-300">
                Select Status
              </label>
            </span>
          </div>

          <div className="mx-auto mt-8 w-[34.5vw]">
            <p className="mb-2 pl-2">Select Contacts</p>
            <ScrollPanel style={{ width: "100%", height: "150px" }}>
              <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 dark:border-gray-700">
                      Contact Name
                    </th>
                    <th className="border px-4 py-2 dark:border-gray-700">
                      Email
                    </th>
                    <th className="border px-4 py-2 dark:border-gray-700">
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contactsData.map((contact) => (
                    <tr key={contact.contact_id}>
                      <td className="border px-4 py-2 text-sm dark:border-gray-700">
                        {contact.contact_first_name +
                          " " +
                          contact.contact_last_name}
                      </td>
                      <td className="whitespace-nowrap border px-4 py-2 text-sm dark:border-gray-700">
                        <label>
                          <input
                            type="checkbox"
                            checked={recipientsData.some(
                              (recipient) =>
                                recipient.recipients === contact.contact_uuid &&
                                recipient.email
                            )}
                            onChange={() =>
                              handleContactChange(contact.contact_uuid, "email")
                            }
                          />
                          &nbsp;{contact.contact_email}
                        </label>
                      </td>
                      <td className="whitespace-nowrap border px-4 py-2 text-sm dark:border-gray-700">
                        <label>
                          <input
                            type="checkbox"
                            checked={recipientsData.some(
                              (recipient) =>
                                recipient.recipients === contact.contact_uuid &&
                                recipient.mobile
                            )}
                            onChange={() =>
                              handleContactChange(
                                contact.contact_uuid,
                                "mobile"
                              )
                            }
                          />
                          &nbsp;{contact.contact_mobile}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollPanel>
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
        <div>Are you sure you want to delete {triggerName}?</div>
      </Dialog>
    </div>
  );
};

export default AlertTriggerList;
