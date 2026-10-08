import axios from "axios";
import { getFriendlyErrorMessage } from "./errorMessages";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
export const authenticateUser = async (email, password, setErrorMessage) => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email: email.trim(),
        password: password.trim(),
        returnSecureToken: true,
      },
    );
    return response.data;
  } catch (err) {
    setErrorMessage(getFriendlyErrorMessage(err, "login"));
  }
};

export const registerUser = async (email, password, setErrorMessage) => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        email: email.trim(),
        password: password.trim(),
        returnSecureToken: true,
      },
    );
    return response.data;
  } catch (err) {
    setErrorMessage(getFriendlyErrorMessage(err, "signup"));
  }
};
