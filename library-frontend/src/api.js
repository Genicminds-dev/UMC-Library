import axios from 'axios';

// export const baseURL = "https://mp.genicminds.com/backend/api/";
// export const baseURLImage =  "https://mp.genicminds.com/backend";
export const baseURL =  "http://localhost:5505/api/";
export const baseURLImage =  "http://localhost:5505";
const api = axios.create({
  baseURL,
});

export default api;
