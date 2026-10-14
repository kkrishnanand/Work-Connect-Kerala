
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Main Axios instance for WorkConnect API requests.
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Separate instance for refreshing tokens.
// It does not use the main response interceptor.
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the latest access token to each request.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(
      "workconnectAccessToken"
    );

    config.headers = config.headers || {};

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingRequests = [];

function processPendingRequests(error, newAccessToken = null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newAccessToken);
    }
  });

  pendingRequests = [];
}

function clearLoginData() {
  localStorage.removeItem("workconnectAccessToken");
  localStorage.removeItem("workconnectRefreshToken");
  localStorage.removeItem("workconnectLoggedInUser");
}

// Handle unauthorized responses and refresh expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("token/refresh/")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(
      "workconnectRefreshToken"
    );

    if (!refreshToken) {
      clearLoginData();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // If another request is refreshing the token,
    // wait for that request to finish.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshApi.post("token/refresh/", {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;

      if (!newAccessToken) {
        throw new Error("The refresh response did not contain an access token.");
      }

      // Save the new token for future API requests.
      localStorage.setItem(
        "workconnectAccessToken",
        newAccessToken
      );

      // Resolve requests waiting for the refresh.
      processPendingRequests(null, newAccessToken);

      // Retry the original failed request.
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return await api(originalRequest);
    } catch (refreshError) {
      processPendingRequests(refreshError);
      clearLoginData();

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
