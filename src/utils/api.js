import axios from "axios";

const FETCHING_DATA_URL =
  "https://auntie-s-products-default-rtdb.firebaseio.com";

export const postData = (data, endPoint) => {
  return axios.post(`${FETCHING_DATA_URL}/${endPoint}.json`, data);
};

export async function fetchData(setErrorMessage, endPoint) {
  if (setErrorMessage) setErrorMessage("");
  try {
    const response = await axios.get(`${FETCHING_DATA_URL}/${endPoint}.json`);
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
    if (setErrorMessage) setErrorMessage(`${error.message}`);
    return [];
  }
}
export const updateData = (endPoint, id, updatedData) => {
  return axios.patch(
    `${FETCHING_DATA_URL}/${endPoint}/${id}.json`,
    updatedData,
  );
};

export const deleteData = (endPoint, id) => {
  return axios.delete(`${FETCHING_DATA_URL}/${endPoint}/${id}.json`);
};
