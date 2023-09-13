import React from "react";

import { RiMoonFill, RiSunFill } from "react-icons/ri";
export default function FixedPlugin(props) {
  const { ...rest } = props;
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains("dark")
  );

  return (
    <button
      className="border-px fixed bottom-[30px] right-[35px] !z-[99] flex items-center justify-center p-0"
      onClick={() => {
        if (darkmode) {
          document.body.classList.remove("dark");
          setDarkmode(false);
        } else {
          document.body.classList.add("dark");
          setDarkmode(true);
        }
      }}
      {...rest}
    >
      <div className="cursor-pointer text-gray-600">
        {darkmode ? (
          <RiSunFill className="h-6 w-6 text-white" />
        ) : (
          <RiMoonFill className="h-6 w-6 text-[#070d22]" />
        )}
      </div>
    </button>
  );
}
