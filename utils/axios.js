import axios from "axios";

const BASE_URL_API = "http://172.1.0.88:3001";

const instance = axios.create({
  baseURL: BASE_URL_API,
});

export default instance;
