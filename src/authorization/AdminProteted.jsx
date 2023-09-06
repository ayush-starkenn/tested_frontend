import Cookies from "js-cookie";
import React from "react";
import { Navigate } from "react-router-dom";
import isTokenExpired from "./TokenExpiry";

const AdminProtected = ({ children }) => {
  let token = Cookies.get("token");
  let user_type = Cookies.get("user_type");

  if (user_type === "1" && token && !isTokenExpired(token)) {
    return children;
  } else {
    window.alert("Your session is expired. Please sign in again.");
    return (
      <>
        <Navigate to="/signin" />
      </>
    );
  }
};

export default AdminProtected;
