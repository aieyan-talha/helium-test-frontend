import { Outlet, Navigate } from "react-router-dom";
import { isEmpty } from "lodash";

export const PrivateRoutes = ({ authStatus }) => {
  return !isEmpty(localStorage?.jwtToken) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};
