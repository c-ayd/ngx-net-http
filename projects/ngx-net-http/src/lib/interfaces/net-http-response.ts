import { HttpHeaderResponse, HttpHeaders, HttpResponse } from "@angular/common/http";

/**
 * Represents the HTTP header response.
 */
export interface NetHttpHeaderResponse {
    /**
     * Whether the status code is 2xx.
     */
    success: boolean,
    /**
     * Target URL to which the request is sent.
     */
    url?: string | null,
    /**
     * Status code of the response.
     */
    status?: number,
    /**
     * Response headers.
     */
    headers?: HttpHeaders,
}

/**
 * Represents the HTTP response.
 */
export interface NetHttpResponse<T> extends NetHttpHeaderResponse {
    /**
     * Body of the response.
     */
    body?: T | null
}

export function toNetHttpHeaderResponse(response: HttpHeaderResponse): NetHttpHeaderResponse {
    return {
        success: response.ok,
        url: response.url,
        status: response.status,
        headers: response.headers,  
    };
}

export function toNetHttpResponse<T>(response: HttpResponse<T>): NetHttpResponse<T> {
    return {
        success: response.ok,
        url: response.url,
        status: response.status,
        headers: response.headers,
        body: response.body
    };
}
