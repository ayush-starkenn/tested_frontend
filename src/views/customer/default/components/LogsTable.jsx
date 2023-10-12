import axios from "axios";
import Cookies from "js-cookie";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs"

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
        console.log(res.data.trip_data);
        setLogs(res.data.trip_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, userUUID]);

  const formatTimestamp = (time) => {
    let formattedDate = new Date(time * 1000);
    let formatDta = formattedDate.toLocaleString();
    return formatDta;
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
            {logs.map((log, index) => (
              <div className="mb-5 flex w-full items-center " key={index}>
                <div className="flex items-center justify-center rounded-xl bg-yellow-500  text-2xl text-white ">
                  <BsInfoCircle />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="text-left text-base font-bold text-gray-700 dark:text-white">
                    Alert{" "}
                    <span className="text-gray-900">
                      {log.event === "LMP" ? (
                        <span>Limp Mode</span>
                      ) : log.event === "ACC" ? (
                        <span>Acceleration Cut Off</span>
                      ) : log.event === "ACD" ? (
                        <span>Accident Saved</span>
                      ) : log.event === "DMS" ? (
                        <span>DMS</span>
                      ) : null}
                    </span>{" "}
                    Generated for Vehicle- {log.vehicle_name} (
                    {log.vehicle_registration})
                  </p>
                  <p>
                    <small>{formatTimestamp(log.timestamp)}</small>
                  </p>
                </div>
              </div>
            ))}
          </ScrollPanel>
        </div>
      </Card>
    </>
  );
};

export default LogsTable;
