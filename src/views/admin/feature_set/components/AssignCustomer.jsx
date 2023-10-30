import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import { AppContext } from "context/AppContext";

const AssignCustomer = ({ parameters, onSuccess }) => {
  //this component not in use
  const [currentUsers, setCurrentUsers] = useState([]);
  const [newUser, setNewUser] = useState();
  const [listCustomers, setListCustomers] = useState([]);
  const [featuresetUsers, setFeaturesetUsers] = useState([]);
  const toastErr = useRef(null);
  const [validationError, setValidationError] = useState(false);
  const { updateFunc } = useContext(AppContext);

  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/featuresets/get-list-assign-users/${parameters.propValue.featureset_uuid}`,
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
  }, [token, parameters.propValue.featureset_uuid]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}customers/get-all-customer`, {
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

  //update and assign FS to customer
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser) {
      setValidationError(true);
      return;
    }
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/featuresets/assign-user/${parameters.propValue.featureset_uuid}`,
        newUser,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        updateFunc();

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    setNewUser(e.value);
    setNewUser({ [e.target.name]: e.value });
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
              value={newUser && newUser.featureset_user}
              options={userOptions()}
              // onChange={(e) => {
              //   setNewUser({ [e.target.name]: e.value }); // Use e.value and e.target.name
              // }}
              onChange={handleChange}
              className={`rounded-lg border border-gray-300 bg-gray-50 py-0 shadow-sm dark:bg-gray-900 dark:placeholder-gray-50 ${
                validationError ? "p-invalid" : ""
              }`}
              optionLabel="label"
            />
            <label htmlFor="dd-city">Select a customer</label>
          </span>
          {validationError && (
            <small className="text-red-600">Please select a customer.</small>
          )}
          <div className="mt-4 text-right">
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white dark:bg-gray-150 dark:font-bold dark:text-blue-800"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AssignCustomer;
