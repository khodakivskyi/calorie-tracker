import {store} from "../store";
import {setAccessToken, logout} from "../store/slices/authSlice.ts";
import {API_CONFIG} from "./api.ts";
import type { GraphQLError } from "graphql";

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

export async function graphqlRequest<T>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const makeRequest = async (token?: string): Promise<Response> => {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if(token){
            headers[`Authorization`] = `Bearer ${token}`;
        }

        return fetch(API_CONFIG.GRAPHQL_URL, {
            method: `POST`,
            headers,
            credentials: "include",
            body: JSON.stringify({query, variables}),
        });
    };

    const accessToken = store.getState().auth.accessToken;
    let response = await makeRequest(accessToken ?? undefined);
    let data = await response.json();

    const isUnauthorized = data.errors?.some((error: GraphQLError) => {
        const code =
            typeof error.extensions?.code === "string" ? error.extensions.code : undefined;

        return error.message.includes("Unauthorized") || code === "UNAUTHORIZED";
    });

    if (isUnauthorized && !isRefreshing) {
        if (isRefreshing) {
            return new Promise((resolve) => {
                pendingRequests.push(async (newToken) => {
                    const retryResponse = await  makeRequest(newToken);
                    const retryData = await retryResponse.json();
                    resolve(retryData.data);
                })
            });
        }

        isRefreshing = true;

        try{
            const refreshResponse = await fetch(API_CONFIG.GRAPHQL_URL, {
                method: `POST`,
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({query: `mutation {refreshToken}`}),
            });

            const refreshData = await refreshResponse.json();

            if(refreshData.data?.refreshToken){
                const newAccessToken = refreshData.data.refreshToken;

                store.dispatch(setAccessToken(newAccessToken));

                pendingRequests.forEach(cb => cb(newAccessToken));
                pendingRequests = [];
                isRefreshing = false;

                response = await makeRequest(newAccessToken);
                data = await response.json();
            }
        } catch (error){
            store.dispatch(logout());
            isRefreshing = false;
            pendingRequests = [];

            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error during token refresh');
            }
        }
    }

    if(data.errors){
        throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    return data.data;
}