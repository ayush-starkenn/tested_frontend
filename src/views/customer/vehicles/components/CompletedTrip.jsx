import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Knob } from "primereact/knob";
import { TabPanel, TabView } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { Badge } from "primereact/badge";
import Cookies from "js-cookie";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// customized marker icons
const markerIcons = {
  red: {
    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    // scaledSize: new window.google.maps.Size(40, 40),
  },
  //   blue: {
  //     url: markerImage,
  //     // scaledSize: new window.google.maps.Size(30, 30),
  //   },
  green: {
    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    // scaledSize: new window.google.maps.Size(40, 40),
  },
};

const TripInfoItem = ({ title, value }) => (
  <div className="border-t border-gray-200 pt-4 dark:border-cyan-800">
    <dt className="font-medium text-gray-900 dark:text-white">{title}</dt>
    <dd className="mt-2 text-sm text-gray-700">{value}</dd>
  </div>
);

const CompletedTrip = () => {
  const token = Cookies.get("token");
  const { trip_id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [path, setPath] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [center, setCenter] = useState({});
  const [startPoint, setStartPoint] = useState({});
  const [endPoint, setEndPoint] = useState({});
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [distance, setDistance] = useState("");
  const [maxSpd, setMaxSpd] = useState("");
  const [avgSpd, setAvgSpd] = useState();
  const [duration, setDuration] = useState("");
  const [epochStart, setEpochStart] = useState();
  const [epochEnd, setEpochEnd] = useState();

  // Get trip summary data
  useEffect(() => {
    console.log("1");
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/trips/get-trip-summary-by-tripid/${trip_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        let resTripdata = res.data.tripdata;
        setAvgSpd(resTripdata[0].avg_spd);
        setDistance(resTripdata[0].total_distance);
        setMaxSpd(resTripdata[0].max_spd);
        setDuration(resTripdata[0].duration);
        const tripStartTime = new Date(resTripdata[0].trip_start_time * 1000);
        const tripEndTime = new Date(resTripdata[0].trip_end_time * 1000);
        setStartTime(tripStartTime.toLocaleString());
        setEndTime(tripEndTime.toLocaleString());
        setEpochStart(resTripdata[0].trip_start_time);
        setEpochEnd(resTripdata[0].trip_end_time);
        console.log(resTripdata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [trip_id, token]);

  useEffect(() => {
    console.log("One");
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/trips/get-completed-tripdata-by-tripid/${trip_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        // Set trip data
        setTripData(res.data.tripdata);

        const dataLength = res.data.tripdata.length - 1;

        // Set Map center
        setCenter({
          lat: parseFloat(res.data.tripdata[dataLength].lat),
          lng: parseFloat(res.data.tripdata[dataLength].lng),
        });

        // Set start point
        setStartPoint({
          lat: parseFloat(res.data.tripdata[0].lat),
          lng: parseFloat(res.data.tripdata[0].lng),
        });

        // Set path
        setPath(
          res.data.tripdata.map((location) => ({
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
          }))
        );

        // Set end point
        setEndPoint({
          lat: parseFloat(res.data.tripdata[dataLength].lat),
          lng: parseFloat(res.data.tripdata[dataLength].lng),
        });

        // Set Start time
        let sttime = res.data.tripdata[0].timestamp;
        let updateStTime = new Date(sttime * 1000);
        setStartTime(updateStTime.toLocaleString());
      })
      .catch((error) => {
        console.log(error);
      });
  }, [trip_id, token]);

  // Set Address
  useEffect(() => {
    console.log("two");
    if (tripData.length > 0 && startPoint !== "" && endPoint !== "") {
      const getAddress = async (lat, lng, setAddress) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU`
        );
        if (response) {
          setIsLoading(false);
        }
        const data = await response.json();
        // console.log(data);
        setAddress(data.results[0].formatted_address);
      };

      getAddress(startPoint.lat, startPoint.lng, setStartAddress);
      getAddress(endPoint.lat, endPoint.lng, setEndAddress);
    }
  }, [tripData]);

  const [activeTab, setActiveTab] = useState("Summary");

  const changeTab = (tabName) => {
    setActiveTab(tabName);
  };

  const SummaryContent = () => (
    <div className="">
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8">
        <TripInfoItem title="Source" value={startAddress + " " + startTime} />
        <TripInfoItem title="Destination" value={endAddress + " " + endTime} />
        <TripInfoItem title="Distance" value={distance + " KM "} />
        <TripInfoItem title="Duration" value={duration} />
        <TripInfoItem title="Average Speed" value={avgSpd + " Kmph "} />
        <TripInfoItem title="Max Speed" value={maxSpd + " Kmph "} />
        <div className="border-t border-gray-200 pt-4 dark:border-cyan-800">
          <p className="font-medium text-gray-900 dark:text-white">Fuel</p>
          <div className="card justify-content-center flex">
            <Knob
              value="100"
              valueTemplate={"{value}%"}
              strokeWidth={10}
              size={70}
            />
          </div>
        </div>

        <TripInfoItem title="Load" value="12 Tons" />
      </dl>
    </div>
  );

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setChecked(e.checked);
  };

  const DMScheckboxes = [
    { label: "Trip Start", badgeValue: "2" },
    { label: "Drowsiness" },
    { label: "Distraction" },
    { label: "No Driver" },
    { label: "Accident" },
    { label: "Overspeeding", badgeValue: "4" },
  ];

  const DMSContent = () => (
    <div className="p-grid">
      {DMScheckboxes.map((checkbox, index) => (
        <div className="p-col-6 my-5" key={index}>
          <div className="align-items-center flex">
            <Checkbox
              inputId={`checkboxId${index}`}
              value={`checkboxValue${index}`}
              checked={checked}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={`checkboxId${index}`}
              className="ml-2 dark:text-white"
            >
              {checkbox.label}
              {checkbox.badgeValue && (
                <Badge value={checkbox.badgeValue} className="mx-3" />
              )}
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  const CAScheckboxes = [
    { label: "Automatic Braking", badgeValue: "2" },
    { label: "Accident Saved" },
    { label: "ACC Cut" },
    { label: "Harsh Acceleration" },
    { label: "Speed Bump", badgeValue: "4" },
    { label: "Lane Change" },
    { label: "Sudden Braking" },
    { label: "Tailgating" },
    { label: "Overspeeding" },
    { label: "Alarm 2" },
    { label: "Alarm 3" },
  ];

  const CASContent = () => (
    <div className="p-grid">
      {CAScheckboxes.map((checkbox, index) => (
        <div className="p-col-6 my-5" key={index}>
          <div className="align-items-center flex">
            <Checkbox
              inputId={`checkboxId${index}`}
              value={`checkboxValue${index}`}
              checked={checked}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={`checkboxId${index}`}
              className="ml-2 dark:text-white"
            >
              {checkbox.label}
              {checkbox.badgeValue && (
                <Badge value={checkbox.badgeValue} className="mx-3" />
              )}
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 sm:py-8 lg:max-w-7xl lg:grid-cols-2">
        <div>
          <div className="page-title pb-4">
            <h2 className="text-gray-900 dark:text-white sm:text-2xl">
              Completed-Trip
            </h2>
            <p className="text-gray-700">TRIP-ID: {trip_id}</p>
          </div>

          <LoadScript googleMapsApiKey="AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
            >
              <Marker position={startPoint} icon={markerIcons.green} />
              <Polyline
                path={path}
                options={{
                  strokeColor: "#4252E0", // Set the color of the polyline path
                  strokeWeight: 4, // Set the stroke size of the polyline
                }}
              />
              <Marker position={endPoint} icon={markerIcons.red} />
            </GoogleMap>
          </LoadScript>
        </div>
        <div className="bg-gray-100 bg-white p-5 dark:bg-navy-700">
          <div className="">
            <TabView>
              <TabPanel header="Summary" className="font-medium">
                <SummaryContent />
              </TabPanel>
              <TabPanel header="DMS">
                <DMSContent />
              </TabPanel>
              <TabPanel header="CAS">
                <CASContent />
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-700">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            DMS Media
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div key="" className="group relative">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-700">Distraction</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    05/09/2023, 19:05:46
                  </p>
                </div>
                <p className="text-5xl font-medium text-cyan-300">&#9900;</p>
              </div>
              <div className="aspect-h-1 aspect-w-1 lg:aspect-none lg:h-50 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                <video
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  width="100%"
                  controls
                >
                  <source
                    src="http://svc-dms.s3-website.ap-south-1.amazonaws.com/vi_DMS_PROD_1_0225_20230905_190549.mp4"
                    type="video/mp4"
                  ></source>
                  Your browser does not support the video tag.
                </video>

                <video
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  width="100%"
                  controls
                >
                  <source
                    src="http://svc-dms.s3-website.ap-south-1.amazonaws.com/piyush-dashcam-test.mp4"
                    type="video/mp4"
                  ></source>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div key="" className="group relative">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-700">Distraction</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    05/09/2023, 19:05:46
                  </p>
                </div>
                <p className="text-5xl font-medium text-cyan-300">&#9900;</p>
              </div>
              <div className="aspect-h-1 aspect-w-1 lg:aspect-none lg:h-50 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                <video
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  width="100%"
                  controls
                >
                  <source
                    src="http://svc-dms.s3-website.ap-south-1.amazonaws.com/vi_DMS_PROD_1_0225_20230905_190549.mp4"
                    type="video/mp4"
                  ></source>
                  Your browser does not support the video tag.
                </video>

                <video
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  width="100%"
                  controls
                >
                  <source
                    src="http://svc-dms.s3-website.ap-south-1.amazonaws.com/piyush-dashcam-test.mp4"
                    type="video/mp4"
                  ></source>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompletedTrip;
