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
// import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import simplify from "simplify-js";

// All customized icons
import drowsinessIcon from "../../../../assets/img/icons/drowsiness.png";
import accCutIcon from "../../../../assets/img/icons/accCut.png";
import accidentCasIcon from "../../../../assets/img/icons/accidentCas.png";
import accidentdmsIcon from "../../../../assets/img/icons/accidentdms.png";
import alarm2Icon from "../../../../assets/img/icons/alarm2.png";
import alarm3Icon from "../../../../assets/img/icons/alarm3.png";
import automaticBrakingIcon from "../../../../assets/img/icons/automaticBraking.png";
import cvnIcon from "../../../../assets/img/icons/cvn.png";
import defaultIcon from "../../../../assets/img/icons/default.png";
import distractionIcon from "../../../../assets/img/icons/distraction.png";
import harshAccIcon from "../../../../assets/img/icons/harshAcc.png";
import laneChngIcon from "../../../../assets/img/icons/laneChng.png";
import nodriverIcon from "../../../../assets/img/icons/nodriver.png";
import overspeedDMSIcon from "../../../../assets/img/icons/overspdDMS.png";
import overspeedIcon from "../../../../assets/img/icons/overspeed.png";
import spdBumpIcon from "../../../../assets/img/icons/spdBump.png";
import suddenBrkIcon from "../../../../assets/img/icons/suddenBrk.png";
import tailgatingIcon from "../../../../assets/img/icons/tailgating.png";
import tripstartIcon from "../../../../assets/img/icons/tripstart.png";
import truckGIF from "../../../../assets/img/truck.gif";
import liveCar from "../../../../assets/img/car.png";
import { ScrollPanel } from "primereact/scrollpanel";

const containerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "20px",
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

const OngoingTrip = () => {
  const token = Cookies.get("token");
  const { trip_id } = useParams();

  // const [isLoading, setIsLoading] = useState(true);
  const [path, setPath] = useState([]);
  const [cvnPath, setCVNPath] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [center, setCenter] = useState({});
  const [startPoint, setStartPoint] = useState({});
  const [endPoint, setEndPoint] = useState({});
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [startTime, setStartTime] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [endTime, setEndTime] = useState();
  const [carPosition, setCarPosition] = useState([]);

  const [distance, setDistance] = useState("");
  const [maxSpd, setMaxSpd] = useState("");
  const [avgSpd, setAvgSpd] = useState();
  const [duration, setDuration] = useState("");
  // eslint-disable-next-line
  const [epochStart, setEpochStart] = useState();
  // eslint-disable-next-line
  const [epochEnd, setEpochEnd] = useState();
  const [haltTime, setHaltTime] = useState("");

  // CAS faults
  const [accident, setAccident] = useState(0);
  const [harshacc, setHarshacc] = useState(0);
  // eslint-disable-next-line
  const [sleeptAlt, setSleepAlt] = useState(0);
  const [laneChng, setLaneChng] = useState(0);
  const [spdBump, setSpdBump] = useState(0);
  const [suddenBrk, setSuddenBrk] = useState(0);
  const [tailgating, setTailgating] = useState(0);
  const [overspeed, setOverspeed] = useState(0);
  const [accCutTipper, setAccCutTipper] = useState(0);
  const [cvn, setCVN] = useState(0);
  const [wrongCvn, setWrongCvn] = useState(0);
  const [load, setLoad] = useState(0);
  const [actualLoad, setActualLoad] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [actualFuel, setActualFuel] = useState(0);
  const [accidentSaved, setAccidentSaved] = useState(0);

  // SET DMS data & Alerts
  // eslint-disable-next-line
  const [media, setMedia] = useState([]);
  const [drowsiness, setDrowsiness] = useState(0);
  const [distraction, setDistraction] = useState(0);
  const [dmsoverSpd, setDmsoverSpd] = useState(0);
  // // eslint-disable-next-line
  // const [noSeatbelt, setNotSeatBelt] = useState(0);
  // // eslint-disable-next-line
  // const [usePhone, setUsePhone] = useState(0);
  // // eslint-disable-next-line
  // const [unknownDriver, setUnknownDriver] = useState(0);
  const [noDriver, setNoDriver] = useState(0);
  // eslint-disable-next-line
  // const [smoking, setSmoking] = useState(0);
  // eslint-disable-next-line
  // const [rashDrive, setRashDrive] = useState(0);
  // eslint-disable-next-line
  const [dmsAccident, setDmsAccident] = useState(0);
  const [tripStartAlert, setTripStartAlert] = useState(0);
  // eslint-disable-next-line
  const [vehicleId, setVehicleId] = useState([]);
  const [autoBrk, setAutoBrk] = useState(0);
  const [faultData, setFaultData] = useState(0);
  const [alarm1, setAlarm1] = useState(0);
  const [alarm2, setAlarm2] = useState(0);

  // Alchohol data set
  const [passAlc, setPassAlc] = useState(0);
  const [failAlc, setFailAlc] = useState(0);
  const [timeoutAlc, setTimeoutAlc] = useState(0);
  const [nonZeroAlc, setNonZeroAlc] = useState(0);

  // Set faultcount locations and data
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterMarker, setFilterMarker] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    AUTOMATIC_BRAKING: false,
    ACCIDENT_SAVED: false,
    ACC_Cut: false,
    WRONG_CVN: false,
    Load: false,
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
    ALCPass: false,
    ALCFail: false,
    ALCTimeout: false,
    ALCNonZero: false,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const showVideo = () => {
    setActiveIndex(2);
  };

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
        setVehicleId(resTripdata[0].vehicle_uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [trip_id, token]);

  // Calculate distance between two coordinates using Haversine formula
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  // Convert degrees to radians
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // useEffect(() => {
  //   // console.log(markers);
  //   console.log(filterMarker);
  // }, [markers, filterMarker]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios
          .get(
            `${process.env.REACT_APP_API_URL}/trips/get-ongoing-tripdata-by-tripid/${trip_id}`,
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

            // Set Map center
            setCenter({
              lat: parseFloat(res.data.tripdata[dataLength].lat),
              lng: parseFloat(res.data.tripdata[dataLength].lng),
            });

            // Set car position
            setCarPosition({
              lat: parseFloat(res.data.tripdata[dataLength].lat),
              lng: parseFloat(res.data.tripdata[dataLength].lng),
            });

            // Set start point
            setStartPoint({
              lat: parseFloat(res.data.tripdata[0].lat),
              lng: parseFloat(res.data.tripdata[0].lng),
            });

            setCoordinates(
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

            // Halt calculation
            const allTripData = res.data.tripdata;
            let startHalt = 0;
            let endHalt = 0;
            let totalHalt = 0;
            allTripData.forEach((tdata) => {
              if (tdata.spd == 0 && startHalt == 0) {
                startHalt = tdata.timestamp;
              } else if (tdata.spd == 0) {
                endHalt = tdata.timestamp;
              } else {
                startHalt = 0;
                endHalt = 0;
              }

              let timeDiff = endHalt - startHalt;

              if (timeDiff > 60) {
                totalHalt = totalHalt + timeDiff;
              }
            });
            const haltHr = Math.floor(totalHalt / 3600);
            const remainingSeconds = totalHalt % 3600;
            const haltMin = Math.floor(remainingSeconds / 60);
            const haltSec = remainingSeconds % 60;
            setHaltTime(`${haltHr} Hr : ${haltMin} Min : ${haltSec} Sec`);

            // Set Start time
            let sttime = res.data.tripdata[0].timestamp;
            let updateStTime = new Date(sttime * 1000);
            setStartTime(updateStTime.toLocaleString());

            // Set Current time
            let currtime = res.data.tripdata[dataLength].timestamp;
            let updateCurrTime = new Date(currtime * 1000);
            setCurrentTime(updateCurrTime.toLocaleString());

            setEpochStart(res.data.tripdata[0].timestamp);
            setEpochEnd(res.data.tripdata[dataLength].timestamp);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch the initial data immediately
    fetchData();
    // Fetch subsequent data at the specified interval
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [trip_id, token]);

  // Set Address
  useEffect(() => {
    if (tripData.length > 0 && startPoint !== "" && endPoint !== "") {
      const getAddress = async (lat, lng, setAddress) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU`
        );
        if (response) {
          // setIsLoading(false);
        }
        const data = await response.json();
        if (data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Loading address...");
        }
      };

      getAddress(startPoint.lat, startPoint.lng, setStartAddress);
      getAddress(endPoint.lat, endPoint.lng, setEndAddress);
    }
  }, [tripData, endPoint, startPoint]);

  // Get fault counts data
  useEffect(() => {
    const timerId = setTimeout(() => {
      // Set CAS Count
      let autoBrkCount = 0;
      let harshAccCount = 0;
      let sleepAltCount = 0;
      let laneChngCount = 0;
      let spdBumpCount = 0;
      let suddenBrkCount = 0;
      let tailgatingCount = 0;
      let overspeedCount = 0;
      let accSavedCount = 0;
      let alarm1Count = 0;
      let alarm2Count = 0;
      let accCutTipperCount = 0;
      let wrongCvnCount = 0;
      let cvnCount = 0;
      let fuelCount = 0;
      let loadCount = 0;

      let passAlcCount = 0;
      let failAlcCount = 0;
      let timeoutAlcCount = 0;
      let nonZeroAlcCount = 0;

      // DMS data
      let drowsinessCount = 0;
      let tripstartCount = 0;
      let distractionCount = 0;
      let overspdCount = 0;
      // let noSeatbeltCount = 0;
      // let usingMobCount = 0;
      // let unknownDriverCount = 0;
      let noDriverCount = 0;
      // let smokingCount = 0;
      // let rashDrivingCount = 0;
      let accidentCount = 0;

      axios
        .get(
          `${process.env.REACT_APP_API_URL}/trips/get-ongoing-fault-counts/${trip_id}/${epochStart}/${epochEnd}`,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((response) => {
          setFaultData(response.data.results);
          let parameters = [];
          let params = {};
          let myData = response.data.results;

          let mediaData = []; // dms media data

          myData.forEach((item) => {
            let jsonDataa = JSON.parse(item.jsondata);

            // Braking data
            if (item.event === "BRK") {
              autoBrkCount++; // Set automatic braking count

              let ttcdiff = jsonDataa.data.on_ttc - jsonDataa.data.off_ttc;
              let acd = ttcdiff / jsonDataa.data.off_ttc;
              let accSvd = acd * 100;
              if (accSvd > 50 && accSvd < 100) {
                accSavedCount++; // Set accident saved count
              }
            }

            // Notification data
            if (item.event === "NTF" && jsonDataa.notification === 2) {
              harshAccCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 13) {
              sleepAltCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 5) {
              laneChngCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 4) {
              spdBumpCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 3) {
              suddenBrkCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 6) {
              tailgatingCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 7) {
              overspeedCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 16) {
              accCutTipperCount++;
            }
            if (item.event === "NTF" && jsonDataa.notification === 17) {
              wrongCvnCount++;
            }

            // Set Alarm data
            if (item.event === "ALM" && jsonDataa.data.alarm === 2) {
              alarm1Count++;
            }
            if (item.event === "ALM" && jsonDataa.data.alarm === 3) {
              alarm2Count++;
            }

            // DMS data
            if (item.event === "DMS") {
              let dmsTimeStamp = item.timestamp;
              let updatedmsTimeStamp = new Date(dmsTimeStamp * 1000);
              mediaData.push({
                dms: jsonDataa.data.media,
                dashcam: jsonDataa.data.dashcam,
                alert: jsonDataa.data.alert_type,
                timestamp: updatedmsTimeStamp.toLocaleString(),
              });
            }
            if (
              item.event === "DMS" &&
              jsonDataa.data.alert_type === "DROWSINESS"
            ) {
              drowsinessCount++;
            }
            if (
              item.event === "DMS" &&
              jsonDataa.data.alert_type === "TRIP_START"
            ) {
              tripstartCount++;
            }
            if (
              item.event === "DMS" &&
              jsonDataa.data.alert_type === "DISTRACTION"
            ) {
              distractionCount++;
            }
            if (
              item.event === "DMS" &&
              jsonDataa.data.alert_type === "OVERSPEEDING"
            ) {
              overspdCount++;
            }
            // if (
            //   item.event === "DMS" &&
            //   jsonDataa.data.alert_type === "USING_PHONE"
            // ) {
            //   usingMobCount++;
            // }
            // if (
            //   item.event === "DMS" &&
            //   jsonDataa.data.alert_type === "NO_SEATBELT"
            // ) {
            //   noSeatbeltCount++;
            // }
            // if (
            //   item.event === "DMS" &&
            //   jsonDataa.data.alert_type === "UNKNOWN_DRIVER"
            // ) {
            //   unknownDriverCount++;
            // }
            if (
              item.event === "DMS" &&
              jsonDataa.data.alert_type === "NO_DRIVER"
            ) {
              noDriverCount++;
            }
            // if (item.event === "DMS" && jsonDataa.data.alert_type === "SMOKING") {
            //   smokingCount++;
            // }
            // if (
            //   item.event === "DMS" &&
            //   jsonDataa.data.alert_type === "RASH_DRIVING"
            // ) {
            //   rashDrivingCount++;
            // }
            if (
              item.event === "DMS" &&
              jsonDataa.data.alert_type === "ACCIDENT"
            ) {
              accidentCount++;
            }

            // set CVN
            if (item.event === "CVN" && jsonDataa.data.status === 1) {
              cvnCount++;

              const cvnPathArray = [];
              // Set CVN path
              // setCVNPath({
              //   lat: parseFloat(parsejsonDATA.lat),
              //   lng: parseFloat(parsejsonDATA.lng),
              // });
              tripData.forEach((row) => {
                if (row.timestamp > jsonDataa.timestamp) {
                  cvnPathArray.push({
                    lat: parseFloat(row.lat),
                    lng: parseFloat(row.lng),
                  });
                }
              });
              // Set cvnPath to the array of lat/lng data
              setCVNPath(cvnPathArray);
            }

            // Set LOAD
            if (item.event === "LDS") {
              loadCount++;
              setActualLoad(jsonDataa.data.actual_load);
            }

            // Set Fuel
            if (item.event === "FLS") {
              fuelCount++;
              setActualFuel(jsonDataa.data.current_fuel);
            }

            // Set Alchohol
            if (item.event === "ALC") {
              if (jsonDataa.data.result === 1) {
                failAlcCount++;
              }
              if (jsonDataa.data.result === 2) {
                passAlcCount++;
              }
              if (jsonDataa.data.result === 3) {
                timeoutAlcCount++;
              }
              if (jsonDataa.data.result === 4) {
                nonZeroAlcCount++;
              }
            }
          });

          // Set CAS Count
          setAutoBrk(autoBrkCount);
          setHarshacc(harshAccCount);
          setSleepAlt(sleepAltCount);
          setLaneChng(laneChngCount);
          setSpdBump(spdBumpCount);
          setSuddenBrk(suddenBrkCount);
          setTailgating(tailgatingCount);
          setOverspeed(overspeedCount);
          setAccidentSaved(accSavedCount);
          setAlarm1(alarm1Count);
          setAlarm2(alarm2Count);
          setAccCutTipper(accCutTipperCount);
          setWrongCvn(wrongCvnCount);
          setFuel(fuelCount);
          setLoad(loadCount);
          setCVN(cvnCount);

          // Set DMS count
          setMedia(mediaData);
          setDrowsiness(drowsinessCount);
          setDistraction(distractionCount);
          setDmsoverSpd(overspdCount);
          // setNotSeatBelt(noSeatbeltCount);
          // setUsePhone(usingMobCount);
          // setUnknownDriver(unknownDriverCount);
          setNoDriver(noDriverCount);
          // setSmoking(smokingCount);
          // setRashDrive(rashDrivingCount);
          setDmsAccident(accidentCount);
          setTripStartAlert(tripstartCount);

          setFailAlc(failAlcCount);
          setPassAlc(passAlcCount);
          setTimeoutAlc(timeoutAlcCount);
          setNonZeroAlc(nonZeroAlcCount);

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
                  icon: accidentCasIcon,
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
                icon: automaticBrakingIcon,
              };
              parameters.push(params);
            }

            // DMS markers
            if (myData[l].event === "DMS") {
              let updatedTime = new Date(myData[l].timestamp * 1000);
              let contentTime = updatedTime.toLocaleString();
              let dmsIcon = defaultIcon;
              if (parseJson.data.alert_type === "DROWSINESS") {
                dmsIcon = drowsinessIcon;
              } else if (parseJson.data.alert_type === "DISTRACTION") {
                dmsIcon = distractionIcon;
              } else if (parseJson.data.alert_type === "TRIP_START") {
                dmsIcon = tripstartIcon;
              } else if (parseJson.data.alert_type === "NO_DRIVER") {
                dmsIcon = nodriverIcon;
              } else if (parseJson.data.alert_type === "OVERSPEEDING") {
                dmsIcon = overspeedDMSIcon;
              } else if (parseJson.data.alert_type === "ACCIDENT") {
                dmsIcon = accidentdmsIcon;
              }
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
                icon: dmsIcon,
              };
              parameters.push(params);
            }

            // adding brk json to markers
            if (parseJson.notification !== undefined) {
              let updatedTime = new Date(myData[l].timestamp * 1000);
              let contentTime = updatedTime.toLocaleString();
              let ntfIcons = defaultIcon;
              if (parseJson.notification === 2) {
                ntfIcons = harshAccIcon;
              } else if (parseJson.notification === 3) {
                ntfIcons = suddenBrkIcon;
              } else if (parseJson.notification === 4) {
                ntfIcons = spdBumpIcon;
              } else if (parseJson.notification === 5) {
                ntfIcons = laneChngIcon;
              } else if (parseJson.notification === 6) {
                ntfIcons = tailgatingIcon;
              } else if (parseJson.notification === 7) {
                ntfIcons = overspeedIcon;
              } else if (parseJson.notification === 16) {
                ntfIcons = accCutIcon;
              } else if (parseJson.notification === 17) {
                ntfIcons = cvnIcon;
              }
              params = {
                id: myData[l].id,
                lat: parseFloat(myData[l].lat),
                lng: parseFloat(myData[l].lng),
                title: parseJson.notification,
                content: contentTime,
                speed: parseFloat(myData[l].spd),
                event: myData[l].event,
                reason: parseJson.notification,
                icon: ntfIcons,
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
              let almIcon = defaultIcon;
              if (parseJson.data.alarm === 2) {
                almIcon = alarm2Icon;
              } else {
                almIcon = alarm3Icon;
              }
              params = {
                id: myData[l].id,
                lat: parseFloat(myData[l].lat),
                lng: parseFloat(myData[l].lng),
                reason: myData[l].message,
                title: myData[l].message,
                speed: Math.round(myData[l].spd),
                content: contentTime,
                event: parseJson.data.alarm === 2 ? "ALM2" : "ALM3",
                alarm_no: parseJson.data.alarm,
                icon: almIcon,
              };
              parameters.push(params);
            }

            // Set CVN data
            if (myData[l].event === "CVN") {
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
                event: myData[l].event,
                icon: cvnIcon,
              };
              parameters.push(params);
            }

            // Set Load data
            if (myData[l].event === "LDS") {
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
                max_cap: parseJson.data.max_cap + "Kg",
                percent: parseJson.data.percentage + "%",
                actual_load: parseJson.data.actual_load + "Kg",
                event: myData[l].event,
                icon: defaultIcon,
              };
              parameters.push(params);
            }

            // Set Fuel data
            if (myData[l].event === "FLS") {
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
                current_fuel: parseJson.data.current_fuel + "Ltr",
                percent: parseJson.data.percentage + "%",
                event: myData[l].event,
                icon: defaultIcon,
              };
              parameters.push(params);
            }

            // Set Alchohol data
          }
          setMarkers(parameters);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);

    // Clear the timer if the component unmounts before 2 seconds
    return () => clearTimeout(timerId);
  }, [token, trip_id, tripData]);

  // Set the stroke color based on whether it's a special route --------------
  const polylineOptions = {
    strokeWeight: 4,
  };
  const [cvnRoute, setCvnRoute] = useState(false);
  if (cvnRoute) {
    polylineOptions.strokeColor = "#FF5733"; // Change the color for the special route
  } else {
    polylineOptions.strokeColor = "#4252E0"; // Default color
  }
  //  ---------------------------

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
        }
      });

      setMedia(mediaData);
    }
  }, [faultData]);

  // Set optimized path that will eliminate jumping
  useEffect(() => {
    // Specify the maximum distance threshold in kilometers
    const maxDistanceThreshold = 1; // Adjust as needed

    // Specify the tolerance level to control the amount of simplification
    const tolerance = 0.00005;

    // Convert the fetched coordinates to a format that simplify-js accepts
    const simplifiedPath = coordinates.map((coord) => ({
      x: coord.lat,
      y: coord.lng,
    }));
    // Simplify the path using the simplify function
    const simplifiedCoordinates = simplify(simplifiedPath, tolerance).map(
      (coord) => ({ lat: coord.x, lng: coord.y })
    );

    // Filter coordinates based on distance threshold
    const filteredCoordinates = [simplifiedCoordinates[0]];
    for (let i = 1; i < simplifiedCoordinates.length; i++) {
      const prevCoord = simplifiedCoordinates[i - 1];
      const currCoord = simplifiedCoordinates[i];
      const distance = getDistance(
        prevCoord.lat,
        prevCoord.lng,
        currCoord.lat,
        currCoord.lng
      );
      if (distance <= maxDistanceThreshold) {
        filteredCoordinates.push(currCoord);
      }
    }

    setPath(filteredCoordinates);
  }, [tripData]);

  // Summary tab
  const SummaryContent = () => (
    <div className="">
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8">
        <TripInfoItem
          title="Distance"
          value={!distance ? "--" : distance + " KM "}
        />
        <TripInfoItem title="Duration" value={!duration ? "--" : duration} />
        <TripInfoItem
          title="Average Speed"
          value={!avgSpd ? "--" : avgSpd + " Kmph "}
        />
        <TripInfoItem
          title="Max Speed"
          value={!maxSpd ? "--" : maxSpd + " Kmph "}
        />
        <div className="border-t border-gray-200 pt-4 dark:border-cyan-800">
          <p className="font-medium text-gray-900 dark:text-white">Fuel</p>
          <div className="card justify-content-center flex">
            <Knob
              value={actualFuel}
              valueTemplate={"{value}%"}
              strokeWidth={10}
              size={70}
            />
          </div>
        </div>

        <TripInfoItem title="Load" value={actualLoad + " Kg"} />
        <TripInfoItem title="Source" value={startAddress + " " + startTime} />
        <TripInfoItem
          title="Destination"
          value={endAddress + " " + currentTime}
        />
      </dl>
    </div>
  );

  // DMS tab
  const DMSContent = () => (
    <>
      <div className="flex gap-4 text-center">
        <div className="flex-1">
          <div className="flex">
            <div className="flex-1 text-left">
              <div className="py-5">
                <Checkbox
                  value="TRIP_START"
                  onChange={handlecheckbox}
                  name="TRIP_START"
                  checked={checkboxes?.TRIP_START}
                  disabled={tripStartAlert === 0}
                />
                <label
                  htmlFor="TRIP_START"
                  className="ml-2 w-[7vw] dark:text-white"
                >
                  Trip Start
                </label>
              </div>
              <div className="py-5">
                <Checkbox
                  value="DROWSINESS"
                  onChange={handlecheckbox}
                  name="DROWSINESS"
                  checked={checkboxes.DROWSINESS}
                  disabled={drowsiness === 0}
                />
                <label
                  htmlFor="ACCIDENT_SAVED"
                  className="ml-2 w-[7vw] dark:text-white"
                >
                  Drowsiness
                </label>
              </div>
              <div className="py-5">
                <Checkbox
                  value="DISTRACTION"
                  onChange={handlecheckbox}
                  name="DISTRACTION"
                  checked={checkboxes.DISTRACTION}
                  disabled={distraction === 0}
                />
                <label
                  htmlFor="CAScheckboxId3"
                  className="ml-2 w-[7vw] dark:text-white"
                >
                  Distraction
                </label>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="py-5">
                {tripStartAlert === 0 ? (
                  <Badge
                    value={tripStartAlert}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={tripStartAlert} className="mx-3" />
                )}
              </div>
              <div className="py-5">
                {drowsiness === 0 ? (
                  <Badge
                    value={drowsiness}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={drowsiness} className="mx-3" />
                )}
              </div>
              <div className="py-5">
                {distraction === 0 ? (
                  <Badge
                    value={distraction}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={distraction} className="mx-3" />
                )}{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex">
            <div className="flex-1 text-left">
              <div className="py-5">
                <Checkbox
                  value="OVERSPEEDING"
                  onChange={handlecheckbox}
                  name="OVERSPEEDING"
                  checked={checkboxes.OVERSPEEDING}
                  disabled={dmsoverSpd === 0}
                />
                <label
                  htmlFor="CAScheckboxId4"
                  className="ml-2 w-[7vw] dark:text-white"
                >
                  Overspeed
                </label>
              </div>
              <div className="py-5">
                <Checkbox
                  value="NO_DRIVER"
                  onChange={handlecheckbox}
                  name="NO_DRIVER"
                  checked={checkboxes.Speed_Bump}
                  disabled={noDriver === 0}
                />
                <label
                  htmlFor="CAScheckboxId5"
                  className="ml-2 w-[7vw] dark:text-white"
                >
                  No Driver
                </label>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="py-5">
                {dmsoverSpd === 0 ? (
                  <Badge
                    value={dmsoverSpd}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={dmsoverSpd} className="mx-3" />
                )}
              </div>
              <div className="py-5">
                {noDriver === 0 ? (
                  <Badge
                    value={noDriver}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={noDriver} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Set videos for DMS
  const dmsIframes = [].concat(...filterMarker).map((data, index) => {
    // console.log("marker pahu", filterMarker);
    // const checkDriveUrl = "drive.google.com";
    // const isDriveUrl = data.dms.includes(checkDriveUrl);
    if (data.event === "DMS") {
      return (
        <div className="group relative" key={index}>
          <div>
            <div className="flex">
              <h3 className="text-gray-700">{data.alert_type}</h3>
              <img
                src={data?.icon}
                alt={data.alert_type + index}
                className="img-fluid mx-2"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{data?.content}</p>
          </div>
          <div className="aspect-h-1 aspect-w-1 lg:aspect-none lg:h-50 w-full overflow-hidden rounded-md bg-gray-200">
            {data.media && (
              <video
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                width="100%"
                controls
              >
                <source
                  src={`${process.env.REACT_APP_S3_URL}/${data.media}`}
                  type="video/mp4"
                ></source>
                Your browser does not support the video tag.
              </video>
            )}

            {data.dashcam && (
              <>
                <video
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  width="100%"
                  controls
                >
                  <source
                    src={`${process.env.REACT_APP_S3_URL}/${data.dashcam}`}
                    type="video/mp4"
                  ></source>
                  Your browser does not support the video tag.
                </video>
              </>
            )}
          </div>
        </div>
      );
    }
  });

  // Pop-up marker data DMS
  const [visible, setVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [dashCamVideo, setDashCamVideo] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoContent, setVideoContent] = useState("");
  const [videoSpeed, setVideoSpeed] = useState("");
  const [videoAlert, setVideoAlert] = useState("");
  const [videoSeverity, setVideoSeverity] = useState("");

  // Pop up marker DMS data
  function handleDMSVideoShow(
    url,
    dashcamVid,
    title,
    content,
    speed,
    alert_type,
    severity
  ) {
    const checkDriveUrl = "drive.google.com";
    if (url.includes(checkDriveUrl)) {
      setVideoUrl(url);
    } else {
      setVideoUrl(`${process.env.REACT_APP_S3_URL}/${url}`);
    }

    if (dashcamVid) {
      const dashCamVideo = dashcamVid.startsWith("/var/www/html/media/")
        ? dashcamVid.substring(20)
        : dashcamVid;
      if (dashCamVideo.includes(checkDriveUrl)) {
        setDashCamVideo(dashCamVideo);
      } else {
        setDashCamVideo(`${process.env.REACT_APP_S3_URL}/${dashCamVideo}`);
      }
    }

    setVideoTitle(title);
    setVideoContent(content);
    setVideoSpeed(speed);
    setVideoAlert(alert_type);
    setVideoSeverity(severity);
    setVisible(true);
  }

  // Handle all events checkbox [optimized]
  const handlecheckbox = (e) => {
    const { value, name, checked } = e.target;

    // Create a mapping object for custom attributes
    const customAttributes = {
      AUTOMATIC_BRAKING: {
        AUTOMATIC_BRAKING: "BRK",
        ACCIDENT_SAVED: "BRK",
        ACCIDENT_SAVED_6: "BRK", // If needed, you can specify different values for ACCIDENT_SAVED with value 6
      },
      ACC_Cut: { 16: "NTF" },
      Harsh_Acceleration: { 2: "NTF" },
      Sudden_Braking: { 3: "NTF" },
      Speed_Bump: { 4: "NTF" },
      Lane_Change: { 5: "NTF" },
      Tailgating: { 3: "NTF" },
      WRONG_CVN: { 17: "NTF" },
      Overspeeding: { 7: "NTF" },
      Alarm_2: { 5: "ALM2" },
      Alarm_3: { 5: "ALM3" },
      TRIP_START: { TRIP_START: "DMS" },
      DROWSINESS: { DROWSINESS: "DMS" },
      DISTRACTION: { DISTRACTION: "DMS" },
      OVERSPEEDING: { OVERSPEEDING: "DMS" },
      NO_DRIVER: { NO_DRIVER: "DMS" },
      Load: { 34: "LDS" },
      CVN: { 36: "CVN" },
      FLS: { 35: "FLS" },
      ALCFail: { 1: "ALC" },
      ALCPass: { 2: "ALC" },
      ALCTimeout: { 3: "ALC" },
      ALCNonZero: { 4: "ALC" },
    };

    // Get the custom attribute based on the name and value
    const customAttribute = customAttributes[name]
      ? customAttributes[name][value]
      : undefined;

    if (checked) {
      const x = markers.filter(
        (el) => el.title === value && el.event === customAttribute
      );
      setFilterMarker([...filterMarker, x]);
    } else {
      const y = []
        .concat(...filterMarker)
        .filter((el) => !(el.title === value && el.event === customAttribute));
      setFilterMarker([y]);
    }

    // Handle specific actions based on customAttribute if needed
    if (customAttribute === "CVN") {
      setCvnRoute(true);
    }

    // Update checkboxes state
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const CASContent = () => (
    <>
      {/* CAS */}
      <div className="cas">
        <h4 className="font-semibold">CAS</h4>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value="AUTOMATIC_BRAKING"
                  onChange={handlecheckbox}
                  name="AUTOMATIC_BRAKING"
                  checked={checkboxes?.AUTOMATIC_BRAKING}
                  disabled={autoBrk === 0}
                />
                <label className="ml-2 dark:text-white">
                  Automatic Braking
                </label>
              </div>
              <div className="flex-shrink-0">
                {autoBrk === 0 ? (
                  <Badge
                    value={autoBrk}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={autoBrk} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value="ACCIDENT_SAVED"
                  onChange={handlecheckbox}
                  name="ACCIDENT_SAVED"
                  checked={checkboxes.ACCIDENT_SAVED}
                  disabled={accident === 0}
                />
                <label className="ml-2 dark:text-white">Accident Saved</label>
              </div>
              <div className="flex-shrink-0">
                {accident === 0 ? (
                  <Badge
                    value={accident}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={accident} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>

      {/* Driver Evaluation */}
      <div className="drive-eval mt-4">
        <h4 className="font-semibold">Driver Evaluation</h4>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={2}
                  onChange={handlecheckbox}
                  name="Harsh_Acceleration"
                  checked={checkboxes.Harsh_Acceleration}
                  disabled={harshacc === 0}
                />
                <label className="ml-2 dark:text-white">
                  Harsh Acceleration
                </label>
              </div>
              <div className="flex-shrink-0">
                {harshacc === 0 ? (
                  <Badge
                    value={harshacc}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={harshacc} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={4}
                  onChange={handlecheckbox}
                  name="Speed_Bump"
                  checked={checkboxes.Speed_Bump}
                  disabled={spdBump === 0}
                />
                <label className="ml-2 dark:text-white">Speed Bump</label>
              </div>
              <div className="flex-shrink-0">
                {spdBump === 0 ? (
                  <Badge
                    value={spdBump}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={spdBump} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={5}
                  onChange={handlecheckbox}
                  name="Lane_Change"
                  checked={checkboxes.Lane_Change}
                  disabled={laneChng === 0}
                />
                <label className="ml-2 dark:text-white">Lane Change</label>
              </div>
              <div className="flex-shrink-0">
                {spdBump === 0 ? (
                  <Badge
                    value={spdBump}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={spdBump} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={3}
                  onChange={handlecheckbox}
                  name="Sudden_Braking"
                  checked={checkboxes.Sudden_Braking}
                  disabled={suddenBrk === 0}
                />
                <label className="ml-2 dark:text-white">Sudden Braking</label>
              </div>
              <div className="flex-shrink-0">
                {suddenBrk === 0 ? (
                  <Badge
                    value={suddenBrk}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={suddenBrk} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={6}
                  onChange={handlecheckbox}
                  name="Tailgating"
                  checked={checkboxes.Tailgating}
                  disabled={tailgating === 0}
                />
                <label
                  htmlFor="CAScheckboxId5"
                  className="ml-2 dark:text-white"
                >
                  Tailgating
                </label>
              </div>
              <div className="flex-shrink-0">
                {tailgating === 0 ? (
                  <Badge
                    value={tailgating}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={tailgating} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]"></div>
        </div>
        <hr />
      </div>

      {/* Notifications */}
      <div className="noti mt-4">
        <h4 className="font-semibold">Notifications</h4>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={16}
                  onChange={handlecheckbox}
                  name="ACC_Cut"
                  checked={checkboxes.ACC_Cut}
                  disabled={accCutTipper === 0}
                />
                <label className="ml-2 dark:text-white">ACC Cut</label>
              </div>
              <div className="flex-shrink-0">
                {accCutTipper === 0 ? (
                  <Badge
                    value={accCutTipper}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={accCutTipper} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={17}
                  onChange={handlecheckbox}
                  name="WRONG_CVN"
                  checked={checkboxes.WRONG_CVN}
                  disabled={wrongCvn === 0}
                />
                <label className="ml-2 dark:text-white">Wrong CVN</label>
              </div>
              <div className="flex-shrink-0">
                {wrongCvn === 0 ? (
                  <Badge
                    value={wrongCvn}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={wrongCvn} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={34}
                  onChange={handlecheckbox}
                  name="Load"
                  checked={checkboxes.Load}
                  disabled={load === 0}
                />
                <label className="ml-2 dark:text-white">Load</label>
              </div>
              <div className="flex-shrink-0">
                {load === 0 ? (
                  <Badge
                    value={load}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={load} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={35}
                  onChange={handlecheckbox}
                  name="FLS"
                  checked={checkboxes.FLS}
                  disabled={fuel === 0}
                />
                <label className="ml-2 dark:text-white">Fuel</label>
              </div>
              <div className="flex-shrink-0">
                {fuel === 0 ? (
                  <Badge
                    value={fuel}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={fuel} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={36}
                  onChange={handlecheckbox}
                  name="CVN"
                  checked={checkboxes.CVN}
                  disabled={cvn === 0}
                />
                <label className="ml-2 dark:text-white">CVN</label>
              </div>
              <div className="flex-shrink-0">
                {cvn === 0 ? (
                  <Badge
                    value={cvn}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={cvn} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0"></div>
              <div className="flex-shrink-0"></div>
            </div>
          </div>
        </div>
        <hr />
      </div>

      {/* Speed Governer */}
      <div className="spdGov mt-4">
        <h4 className="font-semibold">Speed Governer</h4>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={7}
                  onChange={handlecheckbox}
                  name="Overspeeding"
                  checked={checkboxes.Overspeeding}
                  disabled={overspeed === 0}
                />
                <label className="ml-2 dark:text-white">Overspeed</label>
              </div>
              <div className="flex-shrink-0">
                {overspeed === 0 ? (
                  <Badge
                    value={overspeed}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={overspeed} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0"></div>
              <div className="flex-shrink-0"></div>
            </div>
          </div>
        </div>
        <hr />
      </div>

      {/* Alarm Data */}
      <div className="noti mt-4">
        <h4 className="font-semibold">Alarm Data</h4>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={5}
                  onChange={handlecheckbox}
                  name="Alarm_2"
                  checked={checkboxes.Alarm_2}
                  disabled={alarm1 === 0}
                />
                <label className="ml-2 dark:text-white">Alarm 2</label>
              </div>
              <div className="flex-shrink-0">
                {alarm1 === 0 ? (
                  <Badge
                    value={alarm1}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={alarm1} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value={5}
                  onChange={handlecheckbox}
                  name="Alarm_3"
                  checked={checkboxes.Alarm_3}
                  disabled={alarm2 === 0}
                />
                <label className="ml-2 dark:text-white">Alarm 3</label>
              </div>
              <div className="flex-shrink-0">
                {alarm2 === 0 ? (
                  <Badge
                    value={alarm2}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={alarm2} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>

      {/* Alcohol data */}
      <div className="noti mt-4">
        <h4 className="font-semibold">Alcohol data</h4>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox name="alchohol" />
                <label
                  htmlFor="CAScheckboxId3"
                  className="ml-2 dark:text-white"
                >
                  Alcohol
                </label>
              </div>
              <div className="flex-shrink-0">
                <Badge
                  value="0"
                  style={{ backgroundColor: "gray", color: "white" }}
                  className="mx-3"
                />
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0"></div>
              <div className="flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const [vehicleData, setVehicleData] = useState([]);
  // Get vehicle data
  const getVehicleData = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/vehicles/get-vehicle-by-id/${vehicleId}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setVehicleData(res.data.vehicleData[0]);
        console.log(res.data.vehicleData[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getVehicleData();
  }, [vehicleId]);

  // Set the data table when event is selected [optimized]
  const eventTableData = [].concat(...filterMarker)?.map((event, index) => {
    // let tableContent = null;

    switch (event.event) {
      case "DMS":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.alert_type}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
      case "BRK":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event === "BRK" ? "Automatic Braking" : "BRK"}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.reason === 0
                ? `${event.title} Due to Collision Avoidance System Brake Duration: ${event.brake_duration} Sec`
                : `${event.title} Due to Sleep Alert Missed`}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
      case "LDS":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event === "LDS" ? "Load" : "LDS"}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              <span>Max Capacity: {event.max_cap}</span>
              <br />
              <span>Percentage: {event.percent}</span>
              <br />
              <span>Actual: {event.actual_load}</span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
      case "FLS":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event === "FLS" ? "Fuel" : "FLS"}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              <span>Current Fuel: {event.current_fuel}</span>
              <br />
              <span>Percentage: {event.percent}</span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
      case "CVN":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              --
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
      case "ALC":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.result === 1
                ? "Fail"
                : event.result === 2
                ? "Pass"
                : event.result === 3
                ? "Timeout"
                : event.result === 4
                ? "Non zero speed"
                : ""}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
      case "NTF":
        return (
          <tr key={index}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.event}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.reason === 2 ? "Harsh Acceleration" : ""}
              {event.reason === 3 ? "Sudden Braking" : ""}
              {event.reason === 4 ? "Speed Bump" : ""}
              {event.reason === 5 && event.event === "" ? "Lane change" : ""}
              {event.reason === 6 ? "Tailgating" : ""}
              {event.reason === 7 ? "Overspeed" : ""}
              {event.reason === 6 ? "Tailgating" : ""}
              {event.reason === 16 ? "ACC Cut due to Tipper ON" : ""}
              {event.reason === 17 ? "Wrong CVN" : ""}
              {event.reason === 5 &&
              (event.event === "ALM2" || event.event === "ALM3") &&
              event.alarm_no !== 0
                ? " ALM " + event.alarm_no
                : ""}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
              {event.content}
            </td>
          </tr>
        );
    }
  });

  // Alchohol tab
  const ALCContent = () => (
    <>
      {/* alc */}
      <div className="alc">
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value="2"
                  onChange={handlecheckbox}
                  name="ALCPass"
                  checked={checkboxes?.ALCPass}
                  disabled={passAlc === 0}
                />
                <label className="ml-2 dark:text-white">Pass</label>
              </div>
              <div className="flex-shrink-0">
                {passAlc === 0 ? (
                  <Badge
                    value={passAlc}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={passAlc} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value="1"
                  onChange={handlecheckbox}
                  name="ALCFail"
                  checked={checkboxes.ALCFail}
                  disabled={failAlc === 0}
                />
                <label className="ml-2 dark:text-white">Fail</label>
              </div>
              <div className="flex-shrink-0">
                {failAlc === 0 ? (
                  <Badge
                    value={failAlc}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={failAlc} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value="3"
                  onChange={handlecheckbox}
                  name="ALCTimeout"
                  checked={checkboxes?.ALCTimeout}
                  disabled={timeoutAlc === 0}
                />
                <label className="ml-2 dark:text-white">Timeout</label>
              </div>
              <div className="flex-shrink-0">
                {timeoutAlc === 0 ? (
                  <Badge
                    value={timeoutAlc}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={timeoutAlc} className="mx-3" />
                )}
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="my-3 flex justify-between">
              <div className="flex-shrink-0">
                <Checkbox
                  value="4"
                  onChange={handlecheckbox}
                  name="ALCNonZero"
                  checked={checkboxes.ALCNonZero}
                  disabled={nonZeroAlc === 0}
                />
                <label className="ml-2 dark:text-white">Non Zero Speed</label>
              </div>
              <div className="flex-shrink-0">
                {nonZeroAlc === 0 ? (
                  <Badge
                    value={nonZeroAlc}
                    style={{ backgroundColor: "gray", color: "white" }}
                    className="mx-3"
                  />
                ) : (
                  <Badge value={nonZeroAlc} className="mx-3" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div>
        <div className="page-title pb-4">
          <h2 className="text-gray-900 dark:text-white sm:text-2xl">
            Ongoing-Trip
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
                icon={marker.icon}
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
                            className="btn-play mt-3"
                            onClick={() =>
                              handleDMSVideoShow(
                                marker.media,
                                marker.dashcam,
                                marker.title,
                                marker.content,
                                marker.speed,
                                marker.alert_type,
                                marker.severity
                              )
                            }
                          >
                            Play &nbsp; <BsFillPlayCircleFill />
                          </button>
                        </div>
                      </>
                    ) : marker.event === "LDS" ? (
                      <>
                        <div>
                          <h6>
                            <strong>{marker.title === 34 ? "Load" : ""}</strong>
                          </h6>
                          <p className="mb-0">TimeStamp: {marker.content}</p>
                          <p className="mb-0">Speed: {marker.speed}Kmph</p>
                          <p className="mb-0">Max Capacity: {marker.max_cap}</p>
                          <p className="mb-0">Percentage: {marker.percent}</p>
                          <p className="mb-0">Actual: {marker.actual_load}</p>
                        </div>
                      </>
                    ) : marker.event === "FLS" ? (
                      <>
                        <div>
                          <h6>
                            <strong>{marker.title === 34 ? "Load" : ""}</strong>
                          </h6>
                          <p className="mb-0">TimeStamp: {marker.content}</p>
                          <p className="mb-0">Speed: {marker.speed}Kmph</p>
                          <p className="mb-0">
                            Current Fuel: {marker.current_fuel}
                          </p>
                          <p className="mb-0">Percentage: {marker.percent}</p>
                        </div>
                      </>
                    ) : marker.event === "CVN" ? (
                      <>
                        <div>
                          <h6>
                            <strong>{marker.title === 36 ? "CVN" : ""}</strong>
                          </h6>
                          <p className="mb-0">TimeStamp: {marker.content}</p>
                          <p className="mb-0">Speed: {marker.speed}Kmph</p>
                        </div>
                      </>
                    ) : marker.event === "ALC" ? (
                      <>
                        <div>
                          <h6>
                            <strong>
                              {marker.title === 1 ? "Test Fail" : ""}
                            </strong>
                          </h6>
                          <p className="mb-0">TimeStamp: {marker.content}</p>
                          <p className="mb-0">Speed: {marker.speed}Kmph</p>
                          <p className="mb-0">BAC: {marker.bac}</p>
                          <div className="flex justify-center">
                            {marker.img && (
                              <div className="w-1/2">
                                <img
                                  src={marker.img}
                                  alt={marker.event}
                                  className="img-fluid w-full"
                                />
                                <h5 className="text-center text-red-500">
                                  Image
                                </h5>
                              </div>
                            )}

                            {marker.vid && (
                              <div className="w-1/2">
                                <video controls className="h-48 w-full">
                                  <source src={marker.vid} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                                <h5 className="text-center text-red-500">
                                  Video
                                </h5>
                              </div>
                            )}
                          </div>
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
                          {marker.reason === 5 && marker.event === "NTF" ? (
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
                          {marker.reason === 17 ? (
                            <div>
                              <b>Wrong CVN</b>
                              <p className="mb-0">
                                TimeStamp: {marker.content}
                              </p>
                              <p className="mb-0">Speed: {marker.speed}Kmph</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {marker.reason === 5 &&
                          (marker.event === "ALM2" ||
                            marker.event === "ALM3") &&
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
                strokeColor: "#4252E0", // Default color
                strokeWeight: 4,
              }}
            />
            <Polyline path={cvnPath} options={polylineOptions} />
            <Marker
              position={carPosition}
              icon={{
                url: liveCar,
                scaledSize: { width: 50, height: 50 }, // Adjust the width and height
                origin: { x: 0, y: 0 },
                anchor: { x: 25, y: 50 }, // Adjust the anchor point
              }}
              className="car-marker"
            />
          </GoogleMap>
        </LoadScript>

        {/* DMS videos pop-ups */}
        <Dialog
          header={videoTitle}
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          <p className="mb-0">
            <b>Timestamp:</b> {videoContent}
          </p>
          <p className="mb-0">
            <b>Speed:</b> {videoSpeed} KMPH
          </p>
          <p className="mb-0">
            <b>Alert Type:</b> {videoAlert}
          </p>
          <p className="mb-0">
            <b>Severity:</b> {videoSeverity}
          </p>
          <div className="flex justify-center">
            {videoUrl && (
              <div className="w-1/2">
                <video controls className="h-48 w-full">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <h5 className="text-center text-red-500">DMS Video</h5>
              </div>
            )}

            {dashCamVideo && (
              <div className="w-1/2">
                <video controls className="h-48 w-full">
                  <source src={dashCamVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <h5 className="text-center text-red-500">Dashcam Video</h5>
              </div>
            )}
          </div>
        </Dialog>
      </div>

      <div className="lg:max-w-screen mx-auto mt-4 grid w-full grid-cols-1 gap-x-8 gap-y-8 rounded-[20px] sm:py-8 lg:grid-cols-2">
        <div className="rounded-[20px] bg-white p-5 dark:bg-navy-700">
          <div className="">
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            >
              <TabPanel header="Summary" className="font-medium">
                <SummaryContent />
              </TabPanel>
              <TabPanel header="CAS">
                <CASContent />
              </TabPanel>
              <TabPanel header="DMS" onClick={showVideo}>
                <DMSContent />
              </TabPanel>
              <TabPanel header="Alchohol">
                <ALCContent />
              </TabPanel>
            </TabView>
          </div>
        </div>

        <div
          className={`${
            activeIndex === 1 || activeIndex === 2 || activeIndex === 3
              ? "hidden"
              : ""
          } rounded-[20px] bg-white dark:bg-navy-700`}
        >
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Analytics
            </h2>

            <dl className="mb-4 mt-10 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8">
              <TripInfoItem title="Braking Frequency" value="--" />
              <TripInfoItem title="Halt" value={haltTime} />
              {/* <div className="border-t border-gray-200 pt-4 dark:border-cyan-800">
                <dt className="font-medium text-gray-900 dark:text-white">
                  Feature Set
                </dt>
                <dd className="mt-2 text-sm text-gray-700">
                  <button className="rounded-[4px] bg-gray-950 px-3 py-2 text-white">
                    View
                  </button>
                </dd>
              </div> */}
            </dl>

            <hr />

            <div className="mt-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Vehicle Details
              </h2>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8">
                <div className="flex justify-center">
                  <img src={truckGIF} alt="GIF" className="w-1/2" />
                </div>
                <div>
                  <dd className="mt-2 text-sm text-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">
                      <strong>Vehicle Name :</strong>{" "}
                      {vehicleData?.vehicle_name}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <strong>Registration No. :</strong>{" "}
                      {vehicleData?.vehicle_registration}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <strong>ECU :</strong>{" "}
                      {!vehicleData?.ecu ? "--" : vehicleData.ecu}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <strong>IoT :</strong>{" "}
                      {!vehicleData?.iot ? "--" : vehicleData.iot}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <strong>DMS :</strong>{" "}
                      {!vehicleData?.dms ? "--" : vehicleData.dms}
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div
          className={`${
            activeIndex === 2 ? "" : "hidden"
          } rounded-[20px] bg-white dark:bg-navy-700`}
        >
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              DMS Media
            </h2>

            <ScrollPanel style={{ width: "100%", height: "600px" }}>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
                {dmsIframes}
              </div>
            </ScrollPanel>
          </div>
        </div>

        <div
          className={`${
            activeIndex === 0 ? "hidden" : ""
          } rounded-[20px] bg-white dark:bg-navy-700`}
        >
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Events
            </h2>

            <ScrollPanel style={{ width: "100%", height: "600px" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="flex items-center px-3 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-750 dark:text-white"
                    >
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eventTableData.length > 0 ? (
                    eventTableData
                  ) : (
                    <>
                      <tr>
                        <td colSpan={4}>No data found!</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </ScrollPanel>
          </div>
        </div>
      </div>
    </>
  );
};

export default OngoingTrip;
