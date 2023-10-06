import axios from "axios";
import Cookies from "js-cookie";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

const LogsTable = () => {
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/dashboardCustomers/get-alert/${userUUID}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setLogs(res.data.trip_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, userUUID]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <>
      <Card className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <h1 className="align-self-center mb-3 font-bold sm:text-2xl">
          Alert Logs
        </h1>
        <div className="flex flex-col gap-3 dark:!bg-navy-700 dark:text-white dark:shadow-none ">
          <ScrollPanel
            style={{ width: "100%", height: "350px" }}
            className="custombar1 dark:bg-navy-800"
          >
            {logs != "" ? (
              <>
                {logs.map((log, index) => (
                  <div className="mb-5 flex w-full items-center" key={index}>
                    <div className="flex h-full w-[75px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                      <BsInfoCircle />
                    </div>
                    <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                      <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                        Event Generated for Vehicle- {log.vehicle_name} at{" "}
                        {/* {log.trip_data.map((trip, tripIndex) => (
                      <span key={tripIndex}>
                        {formatTimestamp(trip.timestamp)}
                      </span>
                    ))} */}
                      </p>
                      <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p>No Records Found!</p>
              </>
            )}
          </ScrollPanel>
        </div>
      </Card>
    </>
  );
};

export default LogsTable;
