/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useEffect, useState } from "react";
import { ApiContext, APIUser } from "../context";
import axios from "axios";

export default function APIUserData(props) {
  const [user, setUser] = useState(null);
  const { loggedUserData, isGuest, userLogout } = useContext(ApiContext);
  const API_URL = import.meta.env.VITE_API_URL;

  async function getUserData() {
    if (isGuest || !loggedUserData?._id) return;
    try {
      let { data } = await axios.get(
        `${API_URL}/user/${loggedUserData._id}/sheared-profile`,
      );

      if (data.message === "success") {
        setUser(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function addToFavorites(id, mediaType) {
    if (isGuest || !loggedUserData) return;

    const oldFavorites = user?.data?.profile?.favorites;
    const newFavoriteItem = { mediaId: String(id) };
    const updatedFavorites = [...oldFavorites, newFavoriteItem];

    setUser({
      ...user,
      data: {
        ...user.data,
        profile: {
          ...user.data.profile,
          favorites: updatedFavorites,
        },
      },
    });

    const myMedia = {
      mediaId: String(id),
      mediaType,
    };
    try {
      await axios.post(`${API_URL}/favorite/add`, myMedia, {
        headers: { Authorization: `User ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
      if (err.response?.data.error_message == "jwt expired") {
        userLogout();
      }

      setUser({
        ...user,
        data: {
          ...user.data,
          profile: {
            ...user.data.profile,
            favorites: oldFavorites,
          },
        },
      });
    }
  }

  async function deletedFromFavorite(mediaId) {
    try {
      const { data } = await axios.delete(`${API_URL}/favorite/delete`, {
        data: { mediaId },
        headers: {
          Authorization: `User ${localStorage.getItem("token")}`,
        },
      });
      if (data.message === "success" || data.status === 200) {
        // ✅ السر هنا: أخبر الـ Context أن يحدث بياناته فوراً
        await getUserData();
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (loggedUserData?._id) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUserData]);
  return (
    <APIUser.Provider
      value={{ getUserData, user, addToFavorites, deletedFromFavorite }}
    >
      {props.children}
    </APIUser.Provider>
  );
}
