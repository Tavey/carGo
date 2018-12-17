import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.baseURL
});

export function initInstance(session, redirect) {
    axiosInstance.defaults.headers = {
        "x-session-id": session
        // "x-session-id": "3rw2AAoF1vJr96en6XhmIbRQBbxiL5at"
    };

    axiosInstance.interceptors.response.use(null, err => {
        if (err.response && err.response.status === 401) {
            if (process.browser) {
                return redirect("/login");
            }
        } else {
            return Promise.reject(err);
        }
    });
}
