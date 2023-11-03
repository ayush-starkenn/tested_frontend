import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ReactApexChart from "react-apexcharts";
import { useReactToPrint } from "react-to-print";
import { BiLogoSlackOld } from "react-icons/bi";

const Report = () => {
  const token = Cookies.get("token");
  const { report_uuid } = useParams();
  const [date, setDate] = useState();
  const [title, setTitle] = useState();
  const [fromdate, setFromDate] = useState();
  const [todate, setToDate] = useState();
  const [vehicles, setVehicles] = useState({});
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/reports/get_Reports/${report_uuid}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setFromDate(res.data.report.from_date);
        setToDate(res.data.report.to_date);
        setTitle(res.data.report.title);
        setDate(res.data.report.report_created_at);
        setVehicles(JSON.parse(res.data.report.vehicles) || {});
        setTableData(res.data.vehicleResults);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, report_uuid]);

  useEffect(() => {
    // Parse the vehicles data and create chart data
    const parsedChartData = Object.values(vehicles).map((vehicle) => {
      const { vehicle_name, events, vehicle_registration } = vehicle;
      const eventTypes = events.map((event) => event.eventType);
      const eventCounts = events.map((event) => event.eventCount);
      return {
        name: vehicle_name,
        eventTypes,
        eventCounts,
        reg: vehicle_registration,
      };
    });
    setChartData(parsedChartData);
  }, [vehicles]);
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    return { formattedDate, formattedTime };
  };

  const downloadPDF = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: title + "@" + formatTimestamp(date).formattedDate,
  });

  return (
    <>
      <div ref={tableRef}>
        <div className="flex justify-between p-5">
          <img src={logo} className="w-[177px]" alt="" />
          <div className="flex flex-col">
            <span>Date: {formatTimestamp(date).formattedDate}</span>
            <span>Time: {formatTimestamp(date).formattedTime}</span>
          </div>
        </div>
        <div className="card bg-white">
          <div className="text-center">
            <p
              className="pt-4 text-2xl font-medium"
              style={{ textShadow: "1px 1px 1px #ddd" }}
            >
              {title}
            </p>
            <i>
              <p className="py-2  font-normal">
                {formatTimestamp(fromdate).formattedDate} to{" "}
                {formatTimestamp(todate).formattedDate}
              </p>
            </i>
          </div>

          <div>
            <div className="bg-gray-500 px-4 py-2">
              <p
                className="text-xl font-medium"
                style={{ textShadow: "1px 1px 1px #ddd" }}
              >
                Trip Event Statistics
              </p>
            </div>
            <div className="relative overflow-x-auto">
              <div className="flex flex-wrap justify-around">
                {chartData.map((vehicleData, index) => (
                  <div className="card p-8" key={index}>
                    <div>
                      <p className="flex items-center">
                        <BiLogoSlackOld className="text-blue-600" />
                        &nbsp;&nbsp;Analytical Graph for {vehicleData.name} (
                        {vehicleData.reg})
                      </p>
                      <ReactApexChart
                        options={{
                          chart: {
                            type: "bar",
                            animations: {
                              enabled: true,
                              easing: "easeinout",
                              speed: 800,
                              animateGradually: {
                                enabled: true,
                                delay: 150,
                              },
                              dynamicAnimation: {
                                enabled: true,
                                speed: 350,
                              },
                            },
                          },
                          dropShadow: {
                            enabled: false,
                            enabledOnSeries: undefined,
                            top: 0,
                            left: 0,
                            blur: 3,
                            color: "#000",
                            opacity: 0.35,
                          },
                          xaxis: {
                            categories: vehicleData.eventTypes,
                            title: {
                              text: "Event",
                              style: {
                                fontSize: "14px",
                                fontWeight: 600,
                              },
                            },
                          },
                          yaxis: {
                            title: {
                              text: "Count",
                              style: {
                                fontSize: "14px",
                                fontWeight: 600,
                              },
                            },
                          },
                        }}
                        series={[
                          {
                            name: "Event Count",
                            data: vehicleData.eventCounts,
                          },
                        ]}
                        type="bar"
                        height={350}
                        width={550}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-500 px-4 py-2">
            <p
              className="text-xl font-medium"
              style={{ textShadow: "1px 1px 1px #ddd" }}
            >
              Trip Event Details
            </p>
          </div>
          {tableData.map((trip, index) => (
            <div key={index} className="p-8">
              <p className="flex items-center">
                <BiLogoSlackOld className="text-blue-600" />
                &nbsp;&nbsp;{trip.vehicle_name}
              </p>
              <table
                className="mx-6 my-4 text-center text-sm font-light"
                style={{ width: "-webkit-fill-available" }}
              >
                <thead className="dark:border-neutral-500 dark:text-neutral-800 border border-b bg-gray-100 font-medium">
                  <tr>
                    <th scope="col" className="border px-6 py-4">
                      #
                    </th>
                    <th scope="col" className="border px-6 py-4">
                      Trip ID
                    </th>
                    <th scope="col" className="border px-6 py-4">
                      Event
                    </th>
                    <th scope="col" className="border px-6 py-4">
                      Count
                    </th>
                    <th scope="col" className="border px-6 py-4">
                      Date
                    </th>
                    <th scope="col" className="border px-6 py-4">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50">
                  {trip.tripdata.map((tripItem, tripIndex) => (
                    <tr
                      className="dark:border-neutral-500 border-b"
                      key={tripIndex}
                    >
                      <td className="whitespace-nowrap border px-6 py-4 font-medium">
                        {" "}
                        {tripIndex + 1}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {" "}
                        {tripItem.trip_id}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {tripItem.event}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {tripItem.eventCount}
                      </td>
                      <td className="whitespace-nowrap border px-6 py-4">
                        {" "}
                        {formatTimestamp(tripItem.date).formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        {" "}
                        <a
                          href={`${process.env.REACT_APP_BASE_URL}/customer/vehicles/completed-trip/${tripItem.trip_id}`}
                          target="_blank"
                          className="text-blue-600 underline"
                          rel="noopener noreferrer"
                        >
                          `{process.env.REACT_APP_BASE_URL}
                          /customer/vehicles/completed-trip/`
                          {tripItem.trip_id}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Button
          label="Download"
          icon="pi pi-cloud-download"
          severity="secondary"
          className="mx-2 my-4 rounded-md bg-blueSecondary px-4 py-2 text-white dark:!bg-gray-100 dark:!text-gray-850"
          onClick={downloadPDF}
        />
        <Link to="/customer/reports">
          <Button
            label="Go Back"
            icon="pi pi-arrow-circle-left"
            severity="Primary"
            className="mx-2 my-4 rounded-md bg-gray-700 px-4 py-2 text-white dark:!bg-gray-100 dark:!text-gray-850"
          />
        </Link>
      </div>
    </>
  );
};

export default Report;
