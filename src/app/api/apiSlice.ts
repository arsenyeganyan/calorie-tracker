import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let csrfToken: string | null = null;

async function getCsrfToken() {
    if (csrfToken) {
        return csrfToken;
    }

    try {
        const res = await fetch('http://localhost:4000/api/csrf-token', {
            credentials: 'include',
        });
        const data = await res.json();

        if(!res.ok) {
            throw new Error('failed to get csrf token');
        }

        csrfToken = data.csrfToken;
        return csrfToken;
    } catch(err: any) {
        console.log(err);
    }
}

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    credentials: 'include',
    prepareHeaders: async (headers: any, { getState: any }) => {
        const token = await getCsrfToken();
        
        if (token) {
            headers.set('CSRF-Token', token);
        }

        return headers;
    }
})

export const apiSlice = createApi({
    baseQuery,
    endpoints: builder => ({}),
});