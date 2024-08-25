import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const HEADERS = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
}
export const protectedBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        
        if (token) {
            headers.set('Content-Type', `application/json`);
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const USER = 'user';
export const OBJECT = 'object';
