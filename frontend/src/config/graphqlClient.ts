import {store} from "../store";
import {setAccessToken, logout} from "../store/slices/authSlice.ts";
import {API_CONFIG} from "./api.ts";
import type {GraphQLError} from "graphql";

let isRefreshing = false;
type PendingRequest = {
    callback: (token: string) => Promise<void>;
    reject: (reason?: unknown) => void;
};

const pendingRequests: PendingRequest[] = [];

export async function graphqlRequest<T>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const makeRequest = async (token?: string): Promise<Response> => {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
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

    if (isUnauthorized) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingRequests.push({
                    reject,
                    callback: async (newToken) => {
                        try {
                            const retryResponse = await makeRequest(newToken);
                            const retryData = await retryResponse.json();

                            if (retryData.errors) {
                                reject(new Error(retryData.errors[0]?.message ?? "GraphQL error"));
                            } else {
                                resolve(retryData.data);
                            }
                        } catch (err) {
                            reject(err instanceof Error ? err : new Error("Unknown error during token refresh"));
                        }
                    },
                });
            });
        }

        isRefreshing = true;
        try {
            const refreshResponse = await fetch(API_CONFIG.GRAPHQL_URL, {
                method: `POST`,
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({query: `mutation {refreshToken}`}),
            });

            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.data?.refreshToken;
            if (!newAccessToken) {
                throw new Error(refreshData.errors?.[0]?.message ?? "Failed to refresh token");
            }

            store.dispatch(setAccessToken(newAccessToken));

            const queued = pendingRequests.splice(0);
            queued.forEach((pending) => void pending.callback(newAccessToken));

            response = await makeRequest(newAccessToken);
            data = await response.json();
        } catch (error) {
            const normalizedError = error instanceof Error ? error : new Error("Unknown error during token refresh");
            const queued = pendingRequests.splice(0);
            queued.forEach((pending) => pending.reject(normalizedError));
            store.dispatch(logout());
            throw normalizedError;
        } finally {
            isRefreshing = false;
        }
    }

    if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    return data.data;
}