import { HttpHeaderResponse, HttpHeaders, HttpResponse } from "@angular/common/http";

export interface NetHttpHeaderResponse {
    success: boolean,
    url?: string | null,
    status?: number,
    headers?: HttpHeaders,
}

export interface NetHttpResponse<T> extends NetHttpHeaderResponse {
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
