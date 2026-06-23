import axios from "axios";
import { getFriendlyErrorMessage } from "./errorMessages";

const API_KEY = "AIzaSyDQildlauuVim4jg7j4FG2h-BnOYeG5yxQ";
export async function authenticateUser(email, password, setErrorMessage) {
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
}

export async function registerUser(email, password, setErrorMessage) {
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
}
