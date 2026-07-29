// Fetch wrapper for backend API calls
(function () {
  "use strict";

  // Local dev talks to the local API; deployed frontend talks to the Render backend.
  const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
  const BASE_URL = isLocal
    ? "http://localhost:5000/api/v1"
    : "https://hrms-uspv.onrender.com/api/v1";

  async function _fetchAPI(endpoint, method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("hrms_token_v1") || localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await response.json();
      return { res: response, data };
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  }

  window.HRMS = window.HRMS || {};
  window.HRMS.api = {
    get: (endpoint) => _fetchAPI(endpoint, "GET"),
    post: (endpoint, body) => _fetchAPI(endpoint, "POST", body),
    put: (endpoint, body) => _fetchAPI(endpoint, "PUT", body),
    delete: (endpoint) => _fetchAPI(endpoint, "DELETE"),
  };
})();
