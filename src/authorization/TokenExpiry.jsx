import jwtDecode from "jwt-decode"; // You may need to install this library

const isTokenExpired = (token) => {
  if (!token) {
    // Token is not present, consider it expired
    return true;
  }

  // Decode the token to extract the expiration timestamp
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    // Check if the token's expiration timestamp is in the past
    return decodedToken.exp < currentTime;
  } catch (error) {
    // Handle token decoding error (invalid token)
    console.error("Error decoding token:", error);
    return true; // Consider it expired if decoding fails
  }
};

export default isTokenExpired;
