import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import logo from "../../../../assets/img/logo.png";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ReactApexChart from "react-apexcharts";
import { useReactToPrint } from "react-to-print";

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
        console.log(res.data.vehicleResults);
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

  // const vehicleList = JSON.parse(vehicles);
  console.log(vehicles, "sapna");

  useEffect(() => {
    // Parse the vehicles data and create chart data
    const parsedChartData = Object.values(vehicles).map((vehicle) => {
      const { vehicle_name, events } = vehicle;
      const eventTypes = events.map((event) => event.eventType);
      const eventCounts = events.map((event) => event.eventCount);
      return {
        name: vehicle_name,
        eventTypes,
        eventCounts,
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
    documentTitle: title,
  });

  return (
    <>
      <div ref={tableRef}>
        <div id="pdf-content">
          <div className="flex justify-between p-5">
            <img src={logo} className="w-[177px]" alt="" />
            <div className="flex flex-col">
              <span>Date: {formatTimestamp(date).formattedDate}</span>
              <span>Time: {formatTimestamp(date).formattedTime}</span>
            </div>
          </div>
          <div className="card p-8">
            <div className="relative m-0 w-[95vw] bg-white text-left ">
              <h1 className="px-6 py-4 text-2xl font-bold underline">
                Summary
              </h1>
              <table className="w-[95vw] text-left text-sm ">
                <tbody>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      Title
                    </th>
                    <td className="px-6 py-4">{title}</td>
                  </tr>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      Date Range
                    </th>
                    <td className="px-6 py-4">
                      {formatTimestamp(fromdate).formattedDate} to{" "}
                      {formatTimestamp(todate).formattedDate}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      Vehicles Selected
                    </th>
                    <td className="px-6 py-4">
                      <ul>
                        {Object.values(vehicles).map((vehicle, index) => (
                          <li key={index}>{vehicle.vehicle_name}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card p-8">
            <Fieldset legend="Analytical Graph" className="pl-6">
              <div className="relative overflow-x-auto">
                <table className="w-[50vw] text-left text-sm text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        X-axis
                      </th>
                      <td className="px-6 py-4">Events</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Y-axis
                      </th>
                      <td className="px-6 py-4">Event Count</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-between">
                  {chartData.map((vehicleData, index) => (
                    <div className="card p-8" key={index}>
                      <Fieldset
                        legend={`Analytical Graph for ${vehicleData.name}`}
                        className="pl-6"
                      >
                        <ReactApexChart
                          options={{
                            chart: {
                              type: "bar",
                            },
                            xaxis: {
                              categories: vehicleData.eventTypes,
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
                        />
                      </Fieldset>
                    </div>
                  ))}
                </div>
              </div>
            </Fieldset>
          </div>
        </div>
        <div className="card p-8">
          <div className="relative m-0 w-[95vw] bg-white text-left ">
            <h1 className="px-6 py-4 text-2xl font-bold underline">
              Trip Data
            </h1>
            {tableData.map((trip, index) => (
              <div key={index}>
                <h2>{trip.vehicle_name}</h2>
                <table className="w-[95vw] text-left text-sm ">
                  <tbody>
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Sr. No.
                      </th>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Trip ID
                      </th>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Event
                      </th>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Count
                      </th>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Date
                      </th>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        View
                      </th>
                    </tr>
                    {trip.tripdata.map((tripItem, tripIndex) => (
                      <tr
                        key={tripIndex}
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {tripIndex + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {tripItem.trip_id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {tripItem.event}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {tripItem.eventCount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {formatTimestamp(tripItem.date).formattedDate}
                        </td>
                        <td className=" px-6 py-4 font-medium text-gray-900 dark:text-white">
                          <a
                            href={`http://localhost:3000/customer/vehicles/completed-trip/${tripItem.trip_id}`}
                            target="_blank"
                            className="text-blue-600 underline"
                            rel="noopener noreferrer"
                          >
                            http://localhost:3000/customer/vehicles/completed-trip/
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
