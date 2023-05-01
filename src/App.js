import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { privateRoutes, publicRoutes } from "./routes";
import { PrivateRoutes } from "./components";
import "./scss/main.scss";
import { logoutUser, setAuthToken } from "./utils";
import { useAuthContext } from "./hooks/use-auth";
import { useEffect } from "react";

const App = () => {
  const { setUserData } = useAuthContext();

  useEffect(() => {
    document.body.style.backgroundColor = "#242f36";
    if (localStorage.jwtToken) {
      //This is done to make sure that every request contains the token, and isAuthenticated is not falsified
      setAuthToken(localStorage.jwtToken);

      //Decode token to get user data
      const decodedData = jwt_decode(localStorage.jwtToken);

      //Set user and isAuthenticated
      setUserData(decodedData);

      //Check for expired token
      const currentTime = Date.now / 1000;
      if (decodedData.exp < currentTime) {
        //Logout User
        logoutUser();
        setUserData(null);

        //Redirect to login
        window.location.href = "/login";
      }
    }
  }, [setUserData]);

  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            exact
            path={route.path}
            element={route.component}
          />
        ))}
        <Route element={<PrivateRoutes />}>
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              exact
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
