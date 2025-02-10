import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SearchPage from "./pages/SearchPage";
import OrdersHistory from "./pages/OrdersHistory";
import ItemDetails from "./pages/ItemDetails";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import DeliverItems from "./pages/DeliverItems";
import Cart from "./pages/Cart";
import Sell from "./pages/Sell";
import Profile from "./pages/Profile";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { SearchProvider } from "./context/SearchContext";
import Support from "./pages/Support";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <SearchProvider>
      <ResponsiveAppBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <UserProtectWrapper>
              <Profile />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/sell"
          element={
            <UserProtectWrapper>
              <Sell />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/search"
          element={
            <UserProtectWrapper>
              <SearchPage />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <UserProtectWrapper>
              <Cart />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/orders"
          element={
            <UserProtectWrapper>
              <OrdersHistory />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/deliver-items"
          element={
            <UserProtectWrapper>
              <DeliverItems />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/item-details/:id"
          element={
            <UserProtectWrapper>
              <ItemDetails />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/support"
          element={
            <UserProtectWrapper>
              <Support />
            </UserProtectWrapper>
          }
        />
      </Routes>
      {/* </Router> */}
    </SearchProvider>
  );
}

export default App;
