// import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
// import TotalSpent from "views/admin/default/components/TotalSpent";
// import { MdWebhook } from "react-icons/md";
import { BsTruck, BsFillCpuFill } from "react-icons/bs";
// import { AiOutlineCheckSquare } from "react-icons/ai";
import Widget from "components/widget/Widget";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import MapOverview from "./components/MapOverview";
import CheckTable from "./components/LogsTable";
import { Card } from "primereact/card";
import OngoingTable from "./components/OngoingTable";
import LogsTable from "./components/LogsTable";

const MainDashboard = () => {
  const user_uuid = Cookies.get("user_uuid");
  const token = Cookies.get("token");
  const [devicesCount, setDevicesCount] = useState();
  const [vehiclesCount, setVehiclesCount] = useState();
  const [driversCount, setDriversCount] = useState();

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/vehicles/get-user-vehiclelist/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setVehiclesCount(res.data.results.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/devices/get-user-devices-list/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDevicesCount(res.data.results.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid, devicesCount]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/drivers/get-driverslist/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDriversCount(res.data.results.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid, driversCount]);
  return (
    <div>
      {/* Card widget */}
      <h4 className="text-dark text-xl font-bold dark:text-white">Dashboard</h4>
      <div className="3xl:grid-cols-6 mt-3 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3">
        <Widget
          icon={<BsFillCpuFill className="h-6 w-6" />}
          title={"Devices"}
          subtitle={devicesCount}
          cardhref="/customer/devices"
        />
        <Widget
          icon={<RiContactsLine className="h-6 w-6" />}
          title={"Drivers"}
          subtitle={driversCount}
          cardhref="/customer/drivers"
        />
        <Widget
          icon={<BsTruck className="h-7 w-7" />}
          title={"Vehicles"}
          subtitle={vehiclesCount}
          cardhref="/customer/vehicles/*"
        />

        {/* <Widget
          icon={<MdWebhook className="h-7 w-7" />}
          title={"Ongoing Trips"}
          subtitle={"29"}
        /> */}
        {/* <Widget
          icon={<AiOutlineCheckSquare className="h-6 w-6" />}
          title={"Completed Trips"}
          subtitle={"10"}
        /> */}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2">
        <div className="my-3">
          <MapOverview />
        </div>
        <div className="my-3">
          <OngoingTable />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2">
        <div className="my-3">
          <LogsTable />
        </div>
        <div className="my-3">
          <LogsTable />
        </div>
      </div>
      {/* Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2">
        <div className="mb-5 md:mb-0">
          <TotalSpent />
          <br />
          <TotalSpent />
        </div>
        <div>
          <WeeklyRevenue />
        </div>
      </div> */}
    </div>
  );
};

export default MainDashboard;
