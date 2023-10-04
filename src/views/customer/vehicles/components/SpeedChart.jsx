import React from "react";
import ReactApexChart from "react-apexcharts";

const SpeedChart = () => {
  const chartOptions = {
    chart: {
      id: "line-chart",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };

  const chartSeries = [
    {
      name: "Series 1",
      data: [30, 40, 45, 50, 49, 60, 70],
    },
  ];

  return (
    <div className="line-chart">
      <ReactApexChart options={chartOptions} series={chartSeries} type="line" />
    </div>
  );
};

export default SpeedChart;
