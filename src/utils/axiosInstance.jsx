// src/utils/axiosInstance.js
import axios from "axios";
import { API_URL } from "../config";
import {
  applyAuthRequestInterceptor,
  applyAuthResponseInterceptorWithRedirect,
} from "./authInterceptors";

const axiosInstance = axios.create({ baseURL: API_URL });
applyAuthRequestInterceptor(axiosInstance);
applyAuthResponseInterceptorWithRedirect(axiosInstance);

export default axiosInstance;
