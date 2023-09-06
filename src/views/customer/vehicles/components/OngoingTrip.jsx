import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Knob } from "primereact/knob";
import { TabPanel, TabView } from "primereact/tabview";

const Map = () => {
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCk6RovwH7aF8gjy1svTPJvITZsWGA_roU">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {/* Add any map components or markers here */}
      </GoogleMap>
    </LoadScript>
  );
};

const TripInfoItem = ({ title, value }) => (
  <div className="border-t border-gray-200 pt-4 dark:border-cyan-800">
    <dt className="font-medium text-gray-900 dark:text-white">{title}</dt>
    <dd className="mt-2 text-sm text-gray-700">{value}</dd>
  </div>
);

const OngoingTrip = () => {
  const { vehicle_uuid } = useParams();

  const [activeTab, setActiveTab] = useState("Summary");

  const changeTab = (tabName) => {
    setActiveTab(tabName);
  };

  const SummaryContent = () => (
    <div className="">
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-8">
        <TripInfoItem title="Source" value="Baner, Pune" />
        <TripInfoItem title="Destination" value="Baner, Pune" />
        <TripInfoItem title="Distance" value="109 KM" />
        <TripInfoItem title="Duration" value="4 Hour 10 Mins" />
        <TripInfoItem title="Average Speed" value="45 Kmph" />
        <TripInfoItem title="Max Speed" value="67 Kmph" />
        <div className="border-t border-gray-200 pt-4 dark:border-cyan-800">
          <p className="font-medium text-gray-900 dark:text-white">Fuel</p>
          <div className="card justify-content-center flex">
            <Knob
              value="10"
              valueTemplate={"{value}%"}
              strokeWidth={5}
              size={70}
            />
          </div>
        </div>

        <TripInfoItem title="Load Capacity" value="--" />
      </dl>
    </div>
  );

  const DMSContent = () => <div>DMS Content</div>;

  const CASContent = () => <div>CAS Content</div>;

  return (
    <>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 sm:py-8 lg:max-w-7xl lg:grid-cols-2">
        <div>
          <div className="page-title pb-4">
            <h2 className="text-gray-900 dark:text-white sm:text-2xl">
              Ongoing-Trip
            </h2>
            <p className="text-gray-700">
              TRIP-ID: ae0762ee-32ff-46a4-b709-4feac3360568
            </p>
          </div>
          <Map />
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
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-gray-700">Distraction</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    05/09/2023, 19:05:46
                  </p>
                </div>
                <p className="text-5xl font-medium text-cyan-300">&#9900;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OngoingTrip;
