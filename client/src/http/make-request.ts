import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  headers: {
    "Content-type": "application/json"
  }
});
http.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
export {
    http
}