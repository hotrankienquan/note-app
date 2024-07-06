import { useEffect, useState } from "react";
import { http } from "../http/make-request";
import { INoteUser } from "../interface/common";
import { IApiResponse } from "../interface/request.type";
import { QueryListPost } from "../utils/class";
import { cookiesBrowser } from "../cookie/cookie-browser";
import { COOKIE_USER } from "../constants/common";
import axios, { AxiosError } from "axios";
export const LIMIT = 2;
const FETCH_FAILED = 'FETCH_FAILED'

export const useGetListPost = () => {

    const [dataSource, setDataSource] = useState<INoteUser | null>()
    const [query, setQuery] = useState<QueryListPost>(new QueryListPost())


    useEffect(() => {
        async function getData() {
            try {
                setQuery(prev => ({ ...prev, memento: new QueryListPost() }))
                const response = await http.get<
                    Record<string, never>,
                    IApiResponse<INoteUser>
                >("/get-note-of-user", {
                    headers: {
                        "x-client-id": cookiesBrowser.get(COOKIE_USER)?.user?.id,
                        "x-atoken-id": cookiesBrowser.get(COOKIE_USER)?.tokens?.accesstoken,
                    },
                    params: {
                        limit: LIMIT,
                        offset: query.offset,
                    },
                });
                if (response.status !== 200) {
                    throw new Error(FETCH_FAILED)
                }
                setQuery(prev => ({ ...prev, memento: undefined, errorMessage: response.message }))
                setDataSource(response.metadata)
            } catch (error) {
                const errors = error as AxiosError<{
                    code: number;
                    message: string;
                    stack: string;
                    status: string;
                }>;
                if (!axios.isAxiosError(error)) {
                    // do whatever you want with native error
                    console.log('native error', errors);

                }
                if (errors.message === 'fetch failed') {
                    setDataSource(null)
                    setQuery(prev => ({ ...prev, memento: prev.memento, errorMessage: "co loi xay ra" }))
                }
            }
        }
        getData();
    }, [query.offset]);
    return {
        dataSource,
        query,
        setQuery
    }
}