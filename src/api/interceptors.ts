import type { AxiosError } from "axios";

import { apiClient } from "./client";

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);