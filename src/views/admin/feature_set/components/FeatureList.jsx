import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddFeatureSet from "./AddFeatureSet";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import EditFeatureset from "./EditFeatureset";
import Cookies from "js-cookie";
import { useContext } from "react";
import { AppContext } from "context/AppContext";
import AssignCustomer from "./AssignCustomer";
import UnAssignCustomer from "./UnAssignCustomer";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { FiPlus } from "react-icons/fi";

const FeatureList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDialogVisible1, setIsDialogVisible1] = useState(false);
  const [isDialogVisible2, setIsDialogVisible2] = useState(false);
  const [isDialogVisible3, setIsDialogVisible3] = useState(false);
  const [listCustomers, setListCustomers] = useState([]);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [myData, setMyData] = useState();
  const [fs, setFs] = useState();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [data, setData] = useState([]);
  const toastRef = useRef(null);
  const toastErr = useRef(null);
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { updateData, resetState } = useContext(AppContext);

  //get list of featureset

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/featuresets/get-all-featureset`,

        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        const formattedData = res.data.results.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          key: index + 1,
        }));
        setData(formattedData);
      })
      .catch((err) => console.log(err));
  }, [token, fs]);

  //opens delete dialog
  const openDeleteDialog = (rowData) => {
    setSelectedFeature(rowData);
    setIsDeleteDialogVisible(true);
  };

  //closes delete dialog
  const closeDeleteDialog = () => {
    setFs(updateData);
    setIsDeleteDialogVisible(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/customers/get-all-customer", {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.customerData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const usersBodyTemplate = (rowData) => {
    try {
      let assignedusers = JSON.parse(rowData.featureset_users);

      let currentUsers = assignedusers.map((el) => el.user_uuid);

      let filterUsers = listCustomers?.filter(
        (el) => currentUsers.includes(el.user_uuid) && el.user_type === 2
      );

      let mapUsers = filterUsers?.map((el, ind) => (
        <Tag
          key={ind}
          className="my-1 mr-2 bg-gray-200 text-gray-800"
          icon="pi pi-user"
          value={el.first_name + " " + el.last_name}
        ></Tag>
      ));

      return <div className="tag-container">{mapUsers}</div>;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return rowData.featureset_status === 1 ? (
      <Tag
        value={"Active"}
        severity={"success"}
        style={{ width: "75px" }}
      ></Tag>
    ) : (
      <Tag
        value={"Deactive"}
        severity={"danger"}
        style={{ width: "75px" }}
      ></Tag>
    );
  };
  //delete api call
  const handleDeleteConfirmation = async () => {
    if (selectedFeature) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/featuresets/delete-featureset/${selectedFeature?.featureset_uuid}`,
          { user_uuid },
          {
            headers: { authorization: `bearer ${token}` },
          }
        );

        setFs(myData); // Fetch the updated list of featuresets after the delete operation

        closeDeleteDialog();

        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Feature set deleted successfully`,
          life: 3000,
        });
      } catch (error) {
        console.error("Error during delete:", error);

        closeDeleteDialog();

        if (error.response) {
          // Server responded with a status code other than 2xx
          toastErr.current.show({
            severity: "danger",
            summary: "Error",
            detail: error.response.data.message || "An error occurred",
            life: 3000,
          });
        } else if (error.request) {
          // The request was made but no response was received
          toastErr.current.show({
            severity: "danger",
            summary: "Error",
            detail: "No response received from the server",
            life: 3000,
          });
        } else {
          // Something happened in setting up the request
          toastErr.current.show({
            severity: "danger",
            summary: "Error",
            detail: "Error while deleting feature set",
            life: 3000,
          });
        }
      }
    }
  };

  //add FS success toast
  const handleAddSuccess = () => {
    setIsDialogVisible(false);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: "Feature Set Added successfully",
      life: 3000,
    });
    setFs(updateData); // Fetch the updated list of featuresets
  };
  //assign FS success toast
  const handleAssignSuccess = () => {
    setIsDialogVisible2(false);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: "Feature Set Assigned successfully",
      life: 3000,
    });
    setFs(myData);
  };
  //unassign FS success toast
  const handleUnAssignSuccess = () => {
    setIsDialogVisible3(false);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: "Feature Set unassigned successfully",
      life: 3000,
    });
    setFs(myData);
  };
  //edit FS success toast
  const handleEditSuccess = () => {
    setIsDialogVisible1(false);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: "Feature Set updated successfully",
      life: 3000,
    });
    setFs(myData);
  };
  //open add dialog
  const openDialog = () => {
    setIsDialogVisible(true);
  };
  //closes add dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
    resetState();
  };
  //opens edit dialog
  const openDialog1 = (rowData) => {
    setMyData(rowData); // Set the rowData to myData state
    setIsDialogVisible1(true);
  };
  //closes edit dialog
  const closeDialog1 = () => {
    setIsDialogVisible1(false);
    resetState();
  };
  //open assign dialog
  const openDialog2 = (rowData) => {
    setMyData(rowData);
    setIsDialogVisible2(true);
  };
  //closes assign dialog
  const closeDialog2 = () => {
    setIsDialogVisible2(false);
    resetState();
  };
  //opens unassign dialog
  const openDialog3 = (rowData) => {
    setMyData(rowData);
    setIsDialogVisible3(true);
  };
  //closes unassign dialog
  const closeDialog3 = () => {
    setIsDialogVisible3(false);
    resetState();
  };

  //global search dialog
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

  //searchbox
  const header = (
    <div className="align-items-center flex flex-wrap justify-end gap-2 py-3 dark:bg-gray-950">
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
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-file"
          rounded
          className="mr-2 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog2(rowData)}
        />
        <Button
          icon="pi pi-file-excel"
          rounded
          className="mr-2 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog3(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          className="mr-2 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          onClick={() => openDialog1(rowData)}
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
  return (
    <>
      <div>
        <button
          className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
          onClick={openDialog}
        >
          <FiPlus className="mr-2" />
          New Feature Set
        </button>
      </div>
      {/* assign dialog  */}
      <Dialog
        visible={isDialogVisible2}
        onHide={closeDialog2}
        style={{ width: "37vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Assign Feature-Set to Client Company"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <AssignCustomer
          parameters={{ propValue: myData }}
          onSuccess={handleAssignSuccess}
        />
      </Dialog>
      {/* unassign dialog */}
      <Dialog
        visible={isDialogVisible3}
        onHide={closeDialog3}
        style={{ width: "37vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Unassign Client Company from Feature-Set"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <UnAssignCustomer
          parameters={{ propValue: myData }}
          onSuccess={handleUnAssignSuccess}
        />
      </Dialog>
      {/* edit dialog */}
      <Dialog
        visible={isDialogVisible1}
        onHide={closeDialog1}
        style={{ width: "70vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Featureset Details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <EditFeatureset
          parameters={{ propValue: myData }}
          onSuccess={handleEditSuccess}
        />
      </Dialog>
      {/* add dialog */}
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "70vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <p className="text-right text-sm text-red-400">
          All Fields Are Required<span className="text-red-500">**</span>
        </p>
        <AddFeatureSet onSuccess={handleAddSuccess} />
      </Dialog>

      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <Toast ref={toastErr} className="bg-red-400" />
      {/* delete dialog */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={closeDeleteDialog}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white"
              onClick={handleDeleteConfirmation}
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
        <div>
          Are you sure you want to delete {selectedFeature?.featureset_name}?
        </div>
      </Dialog>
      {/* List View */}
      <DataTable
        removableSort
        value={data}
        dataKey="featureset_uuid"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        filterDisplay="menu"
        filters={filters}
        globalFilterFields={["featureset_name", "featureset_users"]}
        emptyMessage="No featureset found."
        header={header}
      >
        <Column
          field="serialNo"
          header="Sr. No."
          style={{ minWidth: "3rem" }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
        />
        <Column
          field="featureset_name"
          header="Featureset Name"
          style={{ minWidth: "12rem" }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
        />
        <Column
          field="featureset_users"
          header="Featureset Users"
          body={usersBodyTemplate}
          style={{ minWidth: "16rem" }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
        />
        <Column
          field="featureset_status"
          header="Featureset Status"
          body={statusBodyTemplate}
          sortable
          style={{ minWidth: "8rem" }}
          className="border-b dark:bg-navy-800 dark:text-gray-200"
        />
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        />
      </DataTable>
    </>
  );
};

export default FeatureList;
