import useLoader from "../../hooks/useLoader";
import axios, { AxiosError } from "axios";
import { BASE_URL, HEADERS } from "../endpoints";

const HttpService = () => {
    const { setIsLoading } = useLoader();

    const httpRequest = <T>(
        method: "GET" | "POST" | "PUT" | "DELETE" | "OPTION",
        url: string,
        data = {},
        params = {},
    ) => new Promise<T>((resolve, reject) => {
        setIsLoading(() => true);
        axios({
            method,
            url: `${BASE_URL}/${url}`,
            data,
            params,
            headers: HEADERS
        })
            .then((response) => {
                setIsLoading(() => false);
                resolve(response.data);
            })
            .catch((err) => {
                const error = err as AxiosError;
                setIsLoading(() => false);
                if (error.response?.status === 401) {
                    localStorage.removeItem("currentUserToken");
                }
                reject(err.response);
            });
    });

    const httpFormRequest = <T>(
        data: FormData,
    ) =>
        new Promise<T>((resolve, reject) => {
            axios(
                {
                    method: "POST",
                    url: `${BASE_URL}/object/upload`,
                    data,
                    headers: {
                        ...HEADERS,
                        "Content-Type": "multipart/form-data",
                    },

                    // onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    //     if (progressEvent.total) {
                    //         const progress = (progressEvent.loaded / progressEvent.total) * 50;
                    //         console.log("uploaded: ", { progress });

                    //     }
                    // },

                    // onDownloadProgress: (progressEvent) => {
                    //     if (progressEvent.total) {
                    //         const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
                    //         console.log("Download: ", { progress });
                    //     }
                    // },
                }
            )

                .then((response) => {
                    setIsLoading(() => false);
                    resolve(response.data);
                })
                .catch((err) => {
                    const error = err as AxiosError;
                    setIsLoading(() => false);
                    if (error.response?.status === 401) {
                        localStorage.removeItem("token");
                    }
                    reject(err.response);
                });
        });

    const httpDownloadRequest = <T>(
        method: "GET" | "POST" | "PUT" | "DELETE" | "OPTION",
        url: string,
        data = {},
        params = {},
    ) => new Promise<T>((resolve, reject) => {
        setIsLoading(() => true);
        axios({
            method,
            url: `${BASE_URL}/${url}`,
            data,
            params,
            headers: HEADERS,
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
                    console.log("Download: ", { progress });
                }
            },
        })
            .then((response) => {
                setIsLoading(() => false);
                resolve(response.data);
            })
            .catch((err) => {
                const error = err as AxiosError;
                setIsLoading(() => false);
                if (error.response?.status === 401) {
                    localStorage.removeItem("currentUserToken");
                }
                reject(err.response);
            });
    });

    return { httpRequest, httpFormRequest, httpDownloadRequest };
};

export default HttpService;
