// src/utils/axiosInstanceNoRedirect.js
import axios from "axios";
import { API_URL } from "../config";
import { applyAuthRequestInterceptor } from "./authInterceptors";

const axiosInstanceNoRedirect = axios.create({ baseURL: API_URL });
applyAuthRequestInterceptor(axiosInstanceNoRedirect);
// note: no response interceptor here

export default axiosInstanceNoRedirect;
