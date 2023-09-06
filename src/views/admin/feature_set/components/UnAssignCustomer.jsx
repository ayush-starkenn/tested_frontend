import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import { useContext } from "react";
import { AppContext } from "context/AppContext";

const UnAssignCustomer = ({ parameters, onSuccess }) => {
  const [user, setUser] = useState({});
  const [currentUsers, setCurrentUsers] = useState();
  const [listCustomers, setListCustomers] = useState([]);
  const [featuresetUsers, setFeaturesetUsers] = useState([]);
  const toastErr = useRef(null);
  const [validationError, setValidationError] = useState(false);
  const { updateFunc } = useContext(AppContext);

  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/featuresets/get-list-unassign-users/${parameters.propValue.featureset_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setCurrentUsers(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, parameters]);

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

  useEffect(() => {
    if (currentUsers) {
      let mapCurrentUsers = currentUsers?.map((el) => el.user_uuid);

      let usersList = listCustomers?.filter((el) =>
        mapCurrentUsers.includes(el.user_uuid)
      );
      setFeaturesetUsers(usersList);
    }
  }, [listCustomers, currentUsers]);

  //update and unassign FS to customer
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setValidationError(true);
      return;
    }
    axios
      .put(
        `http://localhost:8080/api/featuresets/unassign-user/${parameters.propValue.featureset_uuid}`,
        user,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        updateFunc();

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userOptions = () => {
    if (!featuresetUsers) {
      return [];
    }
    return featuresetUsers
      .filter((el) => el.user_type === 2)
      .map((el) => ({
        key: el.user_uuid,
        label: el.first_name + " " + el.last_name,
        value: {
          user_uuid: el.user_uuid,
        },
      }));
  };

  return (
    <>
      <Toast ref={toastErr} className="bg-red-400" />
      <div className="field my-3 w-[30vw]">
        <form onSubmit={handleSubmit}>
          <span className="p-float-label mt-8">
            <Dropdown
              name="featureset_user"
              value={user && user.featureset_user}
              options={userOptions()}
              onChange={(e) => setUser({ [e.target.name]: e.target.value })}
              className={`rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                validationError ? "p-invalid" : ""
              }`}
              optionLabel="label"
            />

            <label htmlFor="dd-city">Select a customer</label>
          </span>
          {validationError && (
            <div className="text-red-600">Please select a customer.</div>
          )}
          <div className="mt-4 text-right">
            <Button
              label="Unassign"
              icon="pi pi-check"
              type="submit"
              className="px-3 py-2 text-right hover:bg-none dark:hover:bg-gray-50"
              style={{ width: "fit-content", background: "#2152FF" }}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UnAssignCustomer;
