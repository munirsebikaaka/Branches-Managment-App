import axios from "axios";
import { getFriendlyErrorMessage } from "./errorMessages";

const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

export const postData = (data, endPoint) => {
  return axios.post(`${DATABASE_URL}/${endPoint}.json`, data);
};

export const fetchData = async (setErrorMessage, endPoint) => {
  if (setErrorMessage) setErrorMessage("");
  try {
    const response = await axios.get(`${DATABASE_URL}/${endPoint}.json`);
    const data = response.data || {};
    const appData = [];
    for (const key in data) {
      const product = {
        id: key,
        ...data[key],
      };
      appData.push(product);
    }
    return appData;
  } catch (error) {
    if (setErrorMessage) {
      setErrorMessage(getFriendlyErrorMessage(error, "fetch"));
    }
    return [];
  }
};
export const updateData = (endPoint, id, updatedData) => {
  return axios.patch(`${DATABASE_URL}/${endPoint}/${id}.json`, updatedData);
};

export const deleteData = (endPoint, id) => {
  return axios.delete(`${DATABASE_URL}/${endPoint}/${id}.json`);
};
