/*
 Any IP/URL required by the backend like a endpoint URL,
 or a socket-based IP or parent window URL, etc should be declared as a constant here
*/

// If your app has a flask backend
export const FLASK_PORT =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5001/" // production endpoint IP/URL
    : ""; // local development IP/URL

// If your app has a node backend
export const NODE_PORT =
  process.env.NODE_ENV !== "production"
    ? "" // production endpoint IP/URL
    : ""; // local development IP/URL
