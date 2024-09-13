import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import PlaceFront from "./pages/PlaceFront.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context, server } from "./main";
import Account from "./pages/Account";
import PlacesPage from "./pages/PlacesPage.jsx";
import PlaceForm from "./pages/PlaceForm";
import BookingsPage from "./pages/BookingsPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import { getToken } from "./api.js";

function App() {
  const { user, setUser, loading, setLoading } = useContext(Context);
  const [refresh, setRefresh] = useState(false);
  const history = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      let isToken = await getToken();
      if (
        !isToken &&
        location.pathname !== "/login" &&
        location.pathname !== "/register"
      ) {
        history("/");
        //console.log("run");
        //setUser(null);
      }

      //console.log("app run");
    };

    checkToken();
  }, [history, location.pathname]);

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/users/getuser`, {
        withCredentials: true,
      });

      setUser(data.user);
      //setIsAuthenticated(true);
      setRefresh(true);
      setLoading(false);
    } catch (error) {
      //setIsAuthenticated(false);
      // setUser({});
      setLoading(false);
      setUser(null);
      //history("/");
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }

    console.log("app");
  }, [history]);

  //console.log(user);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<Account />} />

          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlaceForm />} />
          <Route path="/account/places/:id" element={<PlaceForm />} />
          <Route path="/place/:id" element={<PlaceFront />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
