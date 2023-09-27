import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

const CONTAINER_STYLE = {
  width: "100%",
  height: "350px",
  borderRadius: "1rem",
};

const MapOverview = () => {
  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const [filter, setFilter] = useState(null);
  const filters = [
    { name: "Ongoing", code: "NY" },
    { name: "Limp Mode", code: "RM" },
    { name: "Accident", code: "LDN" },
  ];

  return (
    <div>
      <Card className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <div className="mb-3 flex justify-between">
          <h1 className="align-self-center font-bold sm:text-2xl">Overview</h1>
          <Dropdown
            value={filter}
            onChange={(e) => setFilter(e.value)}
            options={filters}
            optionLabel="name"
            placeholder="Select Filter"
            className="md:w-14rem dark:bg-navy-800"
          />
        </div>
        <LoadScript googleMapsApiKey="AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU">
          <GoogleMap
            mapContainerStyle={CONTAINER_STYLE}
            center={center}
            zoom={14}
          ></GoogleMap>
        </LoadScript>
      </Card>
    </div>
  );
};

export default MapOverview;
