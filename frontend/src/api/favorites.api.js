import axios from "axios";

const API = "http://localhost:5000/api/favorites";

// token from login
const getToken = () => localStorage.getItem("token");

export const getFavoritesApi = async () => {
  const { data } = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data;
};

export const toggleFavoriteApi = async (movieId) => {
  const { data } = await axios.post(
    `${API}/${movieId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};
