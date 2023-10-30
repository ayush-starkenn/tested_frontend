import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import truckImage from "../../../../assets/img/truck.png";

const CONTAINER_STYLE = {
  width: "100%",
  height: "350px",
  borderRadius: "1rem",
};

const MapOverview = () => {
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");

  const center = {
    lat: 21.1466,
    lng: 79.0882,
  };

  const [markers, setMarkers] = useState([]);
  const [markerInfo, setMarkerInfo] = useState([]);
  const [currentKey, setCurrentKey] = useState();

  const OngoingTripsOfUser = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/dashboardCustomers/getOngoingLoc/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setMarkerInfo(res.data.Trip_data);
        let x = res.data.Trip_data;
        let y = [];
        x.forEach((e) => {
          const lat_ = parseFloat(parseFloat(e.lat).toFixed(4));
          const lng_ = parseFloat(parseFloat(e.lng).toFixed(4));
          y.push({
            lat: lat_,
            lng: lng_,
          });
        });

        setMarkers(y);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    OngoingTripsOfUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("markers consoling for checking : ", markers);
  }, [markers]);

  const filters = [
    { name: "Ongoing", code: "NY" },
    { name: "Limp Mode", code: "RM" },
    { name: "Accident", code: "LDN" },
  ];
  const [filter, setFilter] = useState(filters[0]);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const getTimeStamp = (time) => {
    let formattedDate = new Date(time * 1000);
    let formatDta = formattedDate.toLocaleString();
    return formatDta;
  };

  return (
    <div>
      <Card className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <div className="mb-3 flex justify-between">
          <h1 className="align-self-center font-bold sm:text-2xl">
            Fleet Aware
          </h1>
          <Dropdown
            value={filter}
            onChange={(e) => setFilter(e.value)}
            options={filters}
            optionLabel="name"
            placeholder="Select Filter"
            className="md:w-14rem border dark:bg-navy-800"
          />
        </div>
        <LoadScript googleMapsApiKey="AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU">
          <GoogleMap
            mapContainerStyle={CONTAINER_STYLE}
            center={center}
            zoom={4}
          >
            {markers?.map((ele, key) => (
              <Marker
                key={key}
                position={ele}
                icon={truckImage}
                onClick={() => {
                  handleMarkerClick(ele);
                  setCurrentKey(key);
                }}
              />
            ))}

            {/* Render InfoWindow */}
            {selectedMarker && (
              <InfoWindow
                position={{
                  lng: selectedMarker.lng,
                  lat: selectedMarker.lat,
                }}
                onCloseClick={handleCloseInfoWindow}
                options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                anchor={new window.google.maps.Point(0, -40)}
              >
                <div>
                  <p>
                    <strong>
                      Vehicle Name: {markerInfo[currentKey].vehicle_name}
                    </strong>
                  </p>
                  <p>Latitude: {selectedMarker.lat}</p>
                  <p>Longitude: {selectedMarker.lng}</p>
                  <p>
                    Timestamp: {getTimeStamp(markerInfo[currentKey].timestamp)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </Card>
    </div>
  );
};

export default MapOverview;
