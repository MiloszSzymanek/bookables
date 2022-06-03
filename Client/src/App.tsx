import Register from "./components/Register/Register";
import Login from "./components/login/Login";
import EmailConfirmed from "./components/emailConfirmed/EmailConfirmed";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";
import AppStyles from "./AppStyles";
import YourSpaces from "./components/YourSpaces/YourSpaces";
import SingleSpace from "./components/SingleSpace/SingleSpace";
import SwipeableEdgeDrawer from "./components/SwipeableEdge/SwipeableEdge";

const App = () => {
  return (
    <Box sx={AppStyles}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="singlespace" element={<SingleSpace />} />
          <Route path="yourspaces" element={<YourSpaces />} />
          <Route
            path="/emailConfirmation/:token"
            element={<EmailConfirmed />}
          />
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          
          {/* DUMMY ROUTE FOR SWIPEABLE EDGE TO BE DELETED AFTER TESTING */}
          <Route path="/swipe" element={<SwipeableEdgeDrawer />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
