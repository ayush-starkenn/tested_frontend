import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Knob } from "primereact/knob";
import { TabPanel, TabView } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { Badge } from "primereact/badge";
import Cookies from "js-cookie";
import { BsFillPlayCircleFill } from "react-icons/bs";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "350px",
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

  // CAS faults
  const [accident, setAccident] = useState(0);
  const [harshacc, setHarshacc] = useState(0);
  const [sleeptAlt, setSleepAlt] = useState(0);
  const [laneChng, setLaneChng] = useState(0);
  const [spdBump, setSpdBump] = useState(0);
  const [suddenBrk, setSuddenBrk] = useState(0);
  const [tailgating, setTailgating] = useState(0);
  const [overspeed, setOverspeed] = useState(0);
  const [engineOff, setEngineOff] = useState(0);

  // SET DMS data & Alerts
  const [media, setMedia] = useState([]);
  const [drowsiness, setDrowsiness] = useState(0);
  const [distraction, setDistraction] = useState(0);
  const [dmsoverSpd, setDmsoverSpd] = useState(0);
  const [noSeatbelt, setNotSeatBelt] = useState(0);
  const [usePhone, setUsePhone] = useState(0);
  const [unknownDriver, setUnknownDriver] = useState(0);
  const [noDriver, setNoDriver] = useState(0);
  const [smoking, setSmoking] = useState(0);
  const [rashDrive, setRashDrive] = useState(0);
  const [dmsAccident, setDmsAccident] = useState(0);
  const [tripStartAlert, setTripStartAlert] = useState(0);
  const [vehicle, setVehicle] = useState([]);
  const [autoBrk, setAutoBrk] = useState(0);
  const [faultData, setFaultData] = useState(0);
  const [alarm1, setAlarm1] = useState(0);
  const [alarm2, setAlarm2] = useState(0);

  // Set faultcount locations and data
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterMarker, setFilterMarker] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    AUTOMATIC_BRAKING: false,
    ACCIDENT_SAVED: false,
    ACC_Cut: false,
    CVN: false,
    Harsh_Acceleration: false,
    Speed_Bump: false,
    Lane_Change: false,
    Sudden_Braking: false,
    Tailgating: false,
    Overspeeding: false,
    Alarm_2: false,
    Alarm_3: false,
    TRIP_START: false,
    DROWSINESS: false,
    DISTRACTION: false,
    OVERSPEEDING: false,
    NO_DRIVER: false,
  });

  // Get trip summary data
  useEffect(() => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [trip_id, token]);

  useEffect(() => {
    console.log(markers);
    console.log(filterMarker);
  }, [markers, filterMarker]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/trips/get-completed-tripdata-by-tripid/${trip_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
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
    if (tripData.length > 0 && startPoint !== "" && endPoint !== "") {
      const getAddress = async (lat, lng, setAddress) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU`
        );
        if (response) {
          setIsLoading(false);
        }
        const data = await response.json();
        setAddress(data.results[0].formatted_address);
      };

      getAddress(startPoint.lat, startPoint.lng, setStartAddress);
      getAddress(endPoint.lat, endPoint.lng, setEndAddress);
    }
  }, [tripData]);

  //get fault counts data

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/trips/get-fault-counts/${trip_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((response) => {
        setFaultData(response.data.results);
        let parameters = [];
        let params = {};
        let myData = response.data.results;

        // Set all notifications data
        for (let i = 0; i < myData.length; i++) {
          // Set Alarm data
          if (myData[i].event === "ALM") {
            let almData = myData[i].jsondata;
            let almparse = JSON.parse(almData);
            if (almparse.data.alarm === 2) {
              setAlarm1((prev) => prev + 1);
            }
            if (almparse.data.alarm === 3) {
              setAlarm2((prev) => prev + 1);
            }
          }

          // Set Notification data
          if (myData[i].event === "NTF") {
            let ntfData = myData[i].jsondata;
            let ntfparse = JSON.parse(ntfData);

            if (ntfparse.notification === 2) {
              setHarshacc((prev) => prev + 1);
            }
            if (ntfparse.notification === 13) {
              setSleepAlt((prev) => prev + 1);
            }
            if (ntfparse.notification === 5) {
              setLaneChng((prev) => prev + 1);
            }
            if (ntfparse.notification === 4) {
              setSpdBump((prev) => prev + 1);
            }
            if (ntfparse.notification === 3) {
              setSuddenBrk((prev) => prev + 1);
            }
            if (ntfparse.notification === 6) {
              setTailgating((prev) => prev + 1);
            }
            if (ntfparse.notification === 7) {
              setOverspeed((prev) => prev + 1);
            }
            if (ntfparse.notification === 16) {
              setEngineOff((prev) => prev + 1);
            }
          }
        }

        // loop to set markers
        for (let l = 0; l < myData.length; l++) {
          // parsing break json
          let parseJson = JSON.parse(myData[l].jsondata);

          if (myData[l].event === "BRK") {
            let ttcdiff = parseJson.data.on_ttc - parseJson.data.off_ttc;
            let acd = ttcdiff / parseJson.data.off_ttc;
            let accSvd = acd * 100;
            let updatedTime = new Date(myData[l].timestamp * 1000);
            let contentTime = updatedTime.toLocaleString();

            // Set Accident save
            if (accSvd > 50 && accSvd < 100) {
              setAccident((prevCount) => prevCount + 1);
              params = {
                id: myData[l].id,
                lat: parseFloat(myData[l].lat),
                lng: parseFloat(myData[l].lng),
                title: "ACCIDENT_SAVED",
                content: contentTime,
                speed: parseFloat(myData[l].spd),
                event: myData[l].event,
                reason: parseJson.data.reason,
                brake_duration:
                  parseJson.data.off_timestamp - parseJson.data.on_timestamp,
              };
              parameters.push(params);
            }
            setAutoBrk((prevCount) => prevCount + 1);
            params = {
              id: myData[l].id,
              lat: parseFloat(myData[l].lat),
              lng: parseFloat(myData[l].lng),
              title: "AUTOMATIC_BRAKING",
              content: contentTime,
              bypass: parseJson.data.bypass,
              speed: parseFloat(myData[l].spd),
              event: myData[l].event,
              reason: parseJson.data.reason,
              brake_duration:
                parseJson.data.off_timestamp - parseJson.data.on_timestamp,
            };
            parameters.push(params);
          }

          // DMS markers
          if (myData[l].event === "DMS") {
            let updatedTime = new Date(myData[l].timestamp * 1000);
            let contentTime = updatedTime.toLocaleString();
            params = {
              id: myData[l].id,
              lat: parseFloat(myData[l].lat),
              lng: parseFloat(myData[l].lng),
              title: parseJson.data.alert_type,
              content: contentTime,
              speed: parseJson.data.speed,
              event: myData[l].event,
              reason: parseJson.data.alert_type,
              alert_type: parseJson.data.alert_type,
              media: parseJson.data.media,
              dashcam: parseJson.data.dashcam,
              severity: parseJson.data.severity,
            };
            parameters.push(params);
          }

          // adding brk json to markers
          if (parseJson.notification !== undefined) {
            let updatedTime = new Date(myData[l].timestamp * 1000);
            let contentTime = updatedTime.toLocaleString();
            params = {
              id: myData[l].id,
              lat: parseFloat(myData[l].lat),
              lng: parseFloat(myData[l].lng),
              title: parseJson.notification,
              content: contentTime,
              speed: parseFloat(myData[l].spd),
              event: myData[l].event,
              reason: parseJson.notification,
            };
            parameters.push(params);
          }
          if (parseJson.event === "BRK") {
            params = {
              id: myData[l].id,
              lat: parseFloat(myData[l].lat),
              lng: parseFloat(myData[l].lng),
              title: myData[l].message,
              event: myData[l].event,
              reason: parseJson.data.reason,
              bypass: parseJson.data.bypass,
              speed: parseFloat(myData[l].spd),
              brake_duration:
                parseJson.data.off_timestamp - parseJson.data.on_timestamp,
            };
            parameters.push(params);
          }

          // ALM markers
          if (myData[l].event === "ALM") {
            let updatedTime = new Date(myData[l].timestamp * 1000);
            let contentTime = updatedTime.toLocaleString();
            params = {
              id: myData[l].id,
              lat: parseFloat(myData[l].lat),
              lng: parseFloat(myData[l].lng),
              reason: myData[l].message,
              title: myData[l].message,
              speed: Math.round(myData[l].spd),
              content: contentTime,
              event: parseJson.data.alarm == 2 ? "ALM2" : "ALM3",
              alarm_no: parseJson.data.alarm,
            };
            parameters.push(params);
          }
        }
        setMarkers(parameters);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, trip_id]);

  // Set DMS media
  useEffect(() => {
    if (faultData.length > 0) {
      let mediaData = [];
      faultData.forEach((item) => {
        if (item.event === "DMS") {
          let dmsData = JSON.parse(item.jsondata);
          let dmsTimeStamp = item.timestamp;
          let updatedmsTimeStamp = new Date(dmsTimeStamp * 1000);
          mediaData.push({
            dms: dmsData.data.media,
            dashcam: dmsData.data.dashcam,
            alert: dmsData.data.alert_type,
            timestamp: updatedmsTimeStamp.toLocaleString(),
          });
          if (dmsData.data.alert_type === "DROWSINESS") {
            setDrowsiness((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "TRIP_START") {
            setTripStartAlert((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "DISTRACTION") {
            setDistraction((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "OVERSPEEDING") {
            setDmsoverSpd((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "NO_SEATBELT") {
            setNotSeatBelt((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "USING_PHONE") {
            setUsePhone((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "UNKNOWN_DRIVER") {
            setUnknownDriver((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "NO_DRIVER") {
            setNoDriver((prev) => prev + 1);
            const NoDTime = new Date(item.timestamp * 1000);
            console.log(
              "ID:",
              item.id,
              "Event:",
              dmsData.data.alert_type,
              "Time:",
              NoDTime
            );
          }
          if (dmsData.data.alert_type === "SMOKING") {
            setSmoking((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "RASH_DRIVING") {
            setRashDrive((prev) => prev + 1);
          }
          if (dmsData.data.alert_type === "ACCIDENT") {
            setDmsAccident((prev) => prev + 1);
          }
        }
      });

      setMedia(mediaData);
    }
  }, [faultData]);

  const [activeTab, setActiveTab] = useState("Summary");

  const changeTab = (tabName) => {
    setActiveTab(tabName);
  };

  const SummaryContent = () => (
    <div className="">
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8">
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
        <TripInfoItem title="Source" value={startAddress + " " + startTime} />
        <TripInfoItem title="Destination" value={endAddress + " " + endTime} />
      </dl>
    </div>
  );

  const [checked, setChecked] = useState(false);

  const DMSContent = () => (
    <div className="p-grid">
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="TRIP_START"
            onChange={handlecheckbox}
            name="TRIP_START"
            checked={checkboxes?.TRIP_START}
            disabled={tripStartAlert === 0}
          />
          <label htmlFor="TRIP_START" className="ml-2 dark:text-white">
            Trip Start
            {tripStartAlert === 0 ? (
              <Badge
                value={tripStartAlert}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={tripStartAlert} className="mx-3" />
            )}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="DROWSINESS"
            onChange={handlecheckbox}
            name="DROWSINESS"
            checked={checkboxes.DROWSINESS}
            disabled={drowsiness === 0}
          />
          <label htmlFor="ACCIDENT_SAVED" className="ml-2 dark:text-white">
            Drowsiness
            {drowsiness === 0 ? (
              <Badge
                value={drowsiness}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={drowsiness} className="mx-3" />
            )}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="DISTRACTION"
            onChange={handlecheckbox}
            name="DISTRACTION"
            checked={checkboxes.DISTRACTION}
            disabled={distraction === 0}
          />
          <label htmlFor="CAScheckboxId3" className="ml-2 dark:text-white">
            Distraction
            {distraction === 0 ? (
              <Badge
                value={distraction}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={distraction} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>

      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="OVERSPEEDING"
            onChange={handlecheckbox}
            name="OVERSPEEDING"
            checked={checkboxes.OVERSPEEDING}
            disabled={dmsoverSpd === 0}
          />
          <label htmlFor="CAScheckboxId4" className="ml-2 dark:text-white">
            Overspeeding
            {dmsoverSpd === 0 ? (
              <Badge
                value={dmsoverSpd}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={dmsoverSpd} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="NO_DRIVER"
            onChange={handlecheckbox}
            name="NO_DRIVER"
            checked={checkboxes.Speed_Bump}
            disabled={noDriver === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            No Driver
            {noDriver === 0 ? (
              <Badge
                value={noDriver}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={noDriver} className="mx-3" />
            )}
          </label>
        </div>
      </div>
    </div>
  );

  const handlecheckbox = (e) => {
    const { value, name } = e.target;

    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));

    let customAttribute;

    if (name === "AUTOMATIC_BRAKING" && value === "AUTOMATIC_BRAKING") {
      customAttribute = "BRK";
    }
    if (name === "ACCIDENT_SAVED" && value === "AUTOMATIC_BRAKING") {
      customAttribute = "BRK";
    }
    if (name === "ACC_Cut" && value === 16) {
      customAttribute = "NTF";
    }
    if (name === "Harsh_Acceleration" && value === 2) {
      customAttribute = "NTF";
    }
    if (name === "Sudden_Braking" && value === 3) {
      customAttribute = "NTF";
    }
    if (name === "Speed_Bump" && value === 4) {
      customAttribute = "NTF";
    }
    if (name === "Lane_Change" && value === 5) {
      customAttribute = "NTF";
    }
    if (name === "Tailgating" && value === 3) {
      customAttribute = "NTF";
    }
    if (name === "ACCIDENT_SAVED" && value === 6) {
      customAttribute = "BRK";
    }
    if (name === "Overspeeding" && value === 7) {
      customAttribute = "NTF";
    }
    if (name === "Alarm_2" && value === 5) {
      customAttribute = "ALM2";
    }
    if (name === "Alarm_3" && value === 5) {
      customAttribute = "ALM3";
    }
    if (name === "TRIP_START" && value === "TRIP_START") {
      customAttribute = "DMS";
    }
    if (name === "DROWSINESS" && value === "DROWSINESS") {
      customAttribute = "DMS";
    }
    if (name === "DISTRACTION" && value === "DISTRACTION") {
      customAttribute = "DMS";
    }
    if (name === "OVERSPEEDING" && value === "OVERSPEEDING") {
      customAttribute = "DMS";
    }
    if (name === "NO_DRIVER" && value === "NO_DRIVER") {
      customAttribute = "DMS";
    }

    if (e.target.checked) {
      let x = [];
      markers.map((el) => {
        if (el.title == value && el.event == customAttribute) {
          x.push(el);
        }
      });
      setFilterMarker([...filterMarker, x]);
    } else {
      let y = [];

      [].concat(...filterMarker)?.map((el) => {
        if (el.title == value && el.event == customAttribute) {
        } else {
          y.push(el);
        }
      });

      setFilterMarker([y]);
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const CASContent = () => (
    <div className="p-grid">
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="AUTOMATIC_BRAKING"
            onChange={handlecheckbox}
            name="AUTOMATIC_BRAKING"
            checked={checkboxes?.AUTOMATIC_BRAKING}
            disabled={autoBrk === 0}
          />
          <label htmlFor="AUTOMATIC_BRAKING" className="ml-2 dark:text-white">
            Automatic Braking
            {autoBrk === 0 ? (
              <Badge
                value={autoBrk}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={autoBrk} className="mx-3" />
            )}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value="ACCIDENT_SAVED"
            onChange={handlecheckbox}
            name="ACCIDENT_SAVED"
            checked={checkboxes.ACCIDENT_SAVED}
            disabled={accident === 0}
          />
          <label htmlFor="ACCIDENT_SAVED" className="ml-2 dark:text-white">
            Accident Saved
            {accident === 0 ? (
              <Badge
                value={accident}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={accident} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={16}
            onChange={handlecheckbox}
            name="ACC_Cut"
            checked={checkboxes.ACC_Cut}
            disabled={engineOff === 0}
          />
          <label htmlFor="CAScheckboxId3" className="ml-2 dark:text-white">
            ACC Cut
            {engineOff === 0 ? (
              <Badge
                value={engineOff}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={engineOff} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      {/* <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            data-custom-attribute="CVN"
            value="CVN"
            name="CVN"
            checked={checkboxes.CVN}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            CVN
            <Badge value="Badge 5" className="mx-3" />
          </label>
        </div>
      </div> */}
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={2}
            onChange={handlecheckbox}
            name="Harsh_Acceleration"
            checked={checkboxes.Harsh_Acceleration}
            disabled={harshacc === 0}
          />
          <label htmlFor="CAScheckboxId4" className="ml-2 dark:text-white">
            Harsh Acceleration
            {harshacc === 0 ? (
              <Badge
                value={harshacc}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={harshacc} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={4}
            onChange={handlecheckbox}
            name="Speed_Bump"
            checked={checkboxes.Speed_Bump}
            disabled={spdBump === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Speed Bump
            {spdBump === 0 ? (
              <Badge
                value={spdBump}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={spdBump} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={5}
            onChange={handlecheckbox}
            name="Lane_Change"
            checked={checkboxes.Lane_Change}
            disabled={laneChng === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Lane Change
            {laneChng === 0 ? (
              <Badge
                value={laneChng}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={laneChng} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={3}
            onChange={handlecheckbox}
            name="Sudden_Braking"
            checked={checkboxes.Sudden_Braking}
            disabled={suddenBrk === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Sudden_Braking
            {suddenBrk === 0 ? (
              <Badge
                value={suddenBrk}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={suddenBrk} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={6}
            onChange={handlecheckbox}
            name="Tailgating"
            checked={checkboxes.Tailgating}
            disabled={tailgating === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Tailgating
            {tailgating === 0 ? (
              <Badge
                value={tailgating}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={tailgating} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={7}
            onChange={handlecheckbox}
            name="Overspeeding"
            checked={checkboxes.Overspeeding}
            disabled={overspeed === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Overspeeding
            {overspeed === 0 ? (
              <Badge
                value={overspeed}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={overspeed} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={5}
            onChange={handlecheckbox}
            name="Alarm_2"
            checked={checkboxes.Alarm_2}
            disabled={alarm1 === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Alarm 2
            {alarm1 === 0 ? (
              <Badge
                value={alarm1}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={alarm1} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
      <div className="p-col-6 my-5">
        <div className="align-items-center flex">
          <Checkbox
            value={5}
            onChange={handlecheckbox}
            name="Alarm_3"
            checked={checkboxes.Alarm_3}
            disabled={alarm2 === 0}
          />
          <label htmlFor="CAScheckboxId5" className="ml-2 dark:text-white">
            Alarm 3
            {alarm2 === 0 ? (
              <Badge
                value={alarm2}
                style={{ backgroundColor: "gray", color: "white" }}
                className="mx-3"
              />
            ) : (
              <Badge value={alarm2} className="mx-3" />
            )}{" "}
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
            {[].concat(...filterMarker)?.map((marker, index) => (
              <Marker
                key={`${marker.id}-${index}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => handleMarkerClick(marker)}
                icon={markerIcons.blue}
              >
                {selectedMarker === marker && (
                  <InfoWindow
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    {marker.event === "BRK" ? (
                      <div>
                        {marker.reason === 0 ? (
                          <>
                            <div>
                              {marker.title} Due to{" "}
                              <b>Collosion Avoidance System</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                              <p className="mb-0">
                                Brake Duration: {marker.brake_duration}Sec
                              </p>
                              <p className="mb-0">
                                Bypass:{" "}
                                {marker.bypass !== 0 ? "Bypass" : "No Bypass"}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              {marker.title} Due to <b>Sleep Alert Missed</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                              {/* <p className="mb-0">
                                Brake Duration: {marker.brake_duration}
                              </p> */}
                              <p></p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : marker.event === "DMS" ? (
                      <>
                        <div>
                          <h6>
                            <strong>{marker.title}</strong>
                          </h6>
                          <p className="mb-0">TimeStamp: {marker.content}</p>
                          <p className="mb-0">Speed: {marker.speed}Kmph</p>
                          <p className="mb-0">
                            Alert_type: {marker.alert_type}
                          </p>
                          <p className="mb-0">Severity:{marker.severity}</p>
                          <button
                            className="btn btn-danger btn-sm rounded-pill mt-2"
                            // onClick={() =>
                            //   handleDMSVideoShow(
                            //     marker.media,
                            //     marker.dashcam,
                            //     marker.title,
                            //     marker.content,
                            //     marker.speed,
                            //     marker.alert_type,
                            //     marker.severity
                            //   )
                            // }
                          >
                            Play <BsFillPlayCircleFill />
                          </button>
                          {/* <Iframe
                            src={marker.media}
                            width="80%"
                            height="200px"
                            key=""
                          ></Iframe> */}
                        </div>
                      </>
                    ) : (
                      <div>
                        <>
                          {marker.reason === 2 ? (
                            <div>
                              <b>Harsh Acceleration</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 3 ? (
                            <div>
                              <b>Sudden Braking</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 4 ? (
                            <div>
                              <b>Speed Bump</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 5 && marker.event == "NTF" ? (
                            <div>
                              <b>Lane change</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 6 ? (
                            <div>
                              <b>Tailgating</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 7 ? (
                            <div>
                              <b>Overspeed</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 16 ? (
                            <div>
                              <b>ACC Cut due to Tipper ON</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 5 &&
                          (marker.event == "ALM2" || marker.event == "ALM3") &&
                          marker.alarm_no !== 0 ? (
                            <div>
                              <b>Alarm</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                              <p className="mb-0">
                                Alarm_NO: {marker.alarm_no}
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      </div>
                    )}
                  </InfoWindow>
                )}
              </Marker>
            ))}

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
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 sm:py-8 lg:max-w-7xl lg:grid-cols-2">
        <div className="bg-gray-100  p-5 dark:bg-navy-700">
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

        <div className="bg-white dark:bg-navy-700">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              DMS Media
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
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
      </div>
    </>
  );
};

export default CompletedTrip;
