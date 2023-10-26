import React, { useState } from "react";
import ReportsList from "./components/ReportsList";
import { Dialog } from "primereact/dialog";
import Schedule from "./components/Schedule";
import Generate from "./components/Generate";
import { FaCalendarPlus, FaChartLine } from "react-icons/fa";

const Reports = () => {
  const [isGenerateDialogVisible, setIsGenerateDialogVisible] = useState(false);
  const [isScheduleDialogVisible, setIsScheduleDialogVisible] = useState(false);

  const openDialog1 = () => {
    setIsGenerateDialogVisible(true);
  };
  const closeDialog1 = () => {
    setIsGenerateDialogVisible(false);
  };
  const openDialog2 = () => {
    setIsScheduleDialogVisible(true);
  };
  const closeDialog2 = () => {
    setIsScheduleDialogVisible(false);
  };

  return (
    <div>
      <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
        Reports
      </h4>
      <div className="flex gap-2">
        <button
          className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
          onClick={openDialog1}
        >
          <FaChartLine className="mr-2 inline-block text-xl" />
          Generate
        </button>

        <button
          className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
          onClick={openDialog2}
        >
          <FaCalendarPlus className="mr-2 inline-block text-xl" />
          Schedule
        </button>
      </div>

      <ReportsList />
      <Dialog
        visible={isGenerateDialogVisible}
        onHide={closeDialog1}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <Generate close={closeDialog1} />
      </Dialog>
      <Dialog
        visible={isScheduleDialogVisible}
        onHide={closeDialog2}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <Schedule close={closeDialog2} />
      </Dialog>
    </div>
  );
};

export default Reports;
