export const backend_url = process.env.REACT_APP_BACKEND_URL;

console.log("Backend URL:", backend_url);

// fetch wrapper that sends the JWT stored at login
export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};
