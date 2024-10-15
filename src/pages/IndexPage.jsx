import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import axios from "axios";
import { server } from "../main";
import Loader from "./Loader.jsx";
import _ from "lodash";
import { getToken } from "../api.js";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getPlaces = async (query = "") => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${server}/places/allplaces`, {
        params: { query },
      });

      setPlaces(data.places);

      //console.log(places);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getPlaces();
  // }, []);

  //rounded-2xl
  //flex object-cover

  const debouncedGetPlaces = useCallback(
    _.debounce((query) => getPlaces(query), 1000),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedGetPlaces(searchQuery);
    } else {
      getPlaces();
    }
  }, [searchQuery]);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     let isToken = await getToken();
  //     if (!isToken) {
  //       //history("/");
  //       setUser(null);
  //     }
  //   };

  //   checkToken();
  //   console.log("token");
  // }, [history]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title..."
        className="border p-2 rounded mb-4"
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-x-6 gap-y-8 mt-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto mb-10">
          {places.length > 0 &&
            places.map((place) => (
              <Link to={`place/${place._id}`} key={place._id}>
                <div className="bg-gray-300 mb-2 rounded-2xl flex h-[16rem] md:h-[20rem] w-full">
                  {place?.photos[0] && (
                    <img
                      className="rounded-2xl object-cover aspect-square w-full h-full"
                      src={place?.photos[0]}
                      alt=""
                    />
                  )}
                </div>
                <h2 className="font-bold">{place.address}</h2>
                <h3 className="text-sm text-gray-500"> {place.title}</h3>
                <div className="mt-1">
                  <span className="font-bold">Rs.{place.price}</span> per night
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
