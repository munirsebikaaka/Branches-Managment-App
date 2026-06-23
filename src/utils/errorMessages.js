export const getFriendlyErrorMessage = (error, context = "auth") => {
  const backendMessage = error?.message || "";
  const message = String(backendMessage).toLowerCase();

  if (message.includes("email_exists") || message.includes("invalid_email")) {
    return context === "signup"
      ? "This email is already in use or the details are not valid. Please try another email or sign in if you already have an account."
      : "The information provided could not be accepted. Please check your details and try again.";
  }

  if (
    message.includes("invalid_login_credentials") ||
    message.includes("undefined")
  ) {
    return context === "login" && "Wrong email or password!";
  }
  if (
    message.includes("invalid_id_token") ||
    message.includes("unauthorized")
  ) {
    return "Your session is no longer valid, or the request is not authorized. Please refresh the page and try again.";
  }

  if (status === 403 || message.includes("operation_not_allowed")) {
    return "This sign-up option is currently unavailable. Please contact support or try again later.";
  }

  if (status === 429 || message.includes("too_many_attempts")) {
    return "Too many attempts were made. Please wait a moment and try again.";
  }

  if (
    message.includes("network") ||
    message.includes("failed to fetch") ||
    error?.code === "ERR_NETWORK"
  ) {
    return "Failed to complete the action. Please check your internet connection and try again.";
  }

  if (context === "signup") {
    return "We could not create your account right now. Please check your details and try again.";
  }

  return "Something went wrong. Please try again in a moment.";
};
