import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { BsFillPinMapFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const OngoingTable = () => {
  const user_uuid = Cookies.get("user_uuid");
  const token = Cookies.get("token");

  const [tripData, setTripData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const OngoingTripsHere = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/dashboardCustomers/get-ongoing-trip-data/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      );
      console.log(res.data);
      if (res.data.length > 0) {
        setTripData(res.data.result);
        setDataLoaded(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    OngoingTripsHere();
  }, []);

  const getTimeStamp = (time) => {
    let formattedDate = new Date(time * 1000);
    let formatDta = formattedDate.toLocaleString();
    return formatDta;
  };

  return (
    <>
      <Card className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <h1 className="align-self-center font-bold sm:text-2xl">
          Ongoing Trips
        </h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block w-full p-1.5 align-middle">
              <div className="overflow-hidden">
                <ScrollPanel
                  style={{ width: "100%", height: "350px" }}
                  className="custombar1"
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th
                          scope="col"
                          className="flex items-center px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                        >
                          Sr.No
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 13l-5 5m0 0l-5-5m5 5V6"
                            />
                          </svg>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                        >
                          <span className="inline-flex items-center">
                            Vehicle Name
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 11l5-5m0 0l5 5m-5-5v12"
                              />
                            </svg>
                          </span>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                        >
                          <span className="inline-flex items-center">
                            Start Time
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 13l-5 5m0 0l-5-5m5 5V6"
                              />
                            </svg>
                          </span>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                        >
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dataLoaded ? (
                        tripData.map((ele, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                              {ele.vehicle_name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                              {getTimeStamp(ele.trip_start_time)}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                              <Link
                                to={`${process.env.REACT_APP_BASE_URL}/customer/vehicles/ongoing-trip/${ele.trip_id}`}
                                target="_blank"
                                className="mx-auto"
                              >
                                <span className="mx-auto text-center text-xl">
                                  <BsFillPinMapFill className="text-center text-navy-600 dark:text-gray-400" />
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No Records Found!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollPanel>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default OngoingTable;
