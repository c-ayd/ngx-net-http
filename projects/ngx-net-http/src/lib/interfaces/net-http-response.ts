import { HttpHeaders } from "@angular/common/http";

export interface NetHttpHeaderResponse {
    success: boolean,
    url?: string | null,
    status?: number,
    headers?: HttpHeaders,
}

export interface NetHttpResponse<T> extends NetHttpHeaderResponse {
    body?: T | null
}
