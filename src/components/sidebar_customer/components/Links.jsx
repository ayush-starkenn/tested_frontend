/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { Tooltip } from "primereact/tooltip";

// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes_customer) => {
    return routes_customer.map((route, index) => {
      if (route.layout === "/admin" || route.layout === "/customer") {
        return (
          <Link key={index} to={route.layout + "/" + route.path}>
            <div className="relative mb-5 flex">
              <li
                className={`tooltip-button-${index} mx-auto my-auto flex items-center py-[5px]`}
                key={index}
              >
                <span
                  className={`hover:text-gray-700 ${
                    activeRoute(route.path) === true
                      ? "font-bold text-activeLink dark:text-white"
                      : "font-2xl text-gray-600"
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                <Tooltip
                  target={`.tooltip-button-${index}`}
                  className="custom-tooltip"
                  mouseTrackLeft={12}
                >
                  {route.title}
                </Tooltip>
              </li>
              {activeRoute(route.path) ? (
                <div className="absolute right-0 top-[5px] h-7 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
        );
      }
    });
  };
  return createLinks(routes);
}

export default SidebarLinks;
