import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add the API key to every request
    "x-api-key": import.meta.env.VITE_API_KEY
  },
  withCredentials: true, // This is important for cookies to be sent with requests
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle rate limit errors
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
      // You could show a user-friendly notification here
    }
    
    // Handle unauthorized errors (invalid/expired cookies, etc.)
    if (error.response && error.response.status === 401) {
      // Redirect to login page if unauthorized
      // window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;