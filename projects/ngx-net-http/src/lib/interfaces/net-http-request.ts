import { HttpContext } from "@angular/common/http"
import { NetHttpResponseType } from "../enums/net-http-response-type"

export interface NetHttpRequest {
    baseUrl?: string,
    controller?: string,
    routes?: (string | number | boolean)[],
    queryParams?: Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>,
    headers?: Record<string, string | string[]>,
    withCredentials?: boolean,
    responseType?: NetHttpResponseType,
    options?: {
        download?: {
            mimeType?: string,
            fileName?: string
        },
        transferCache?: {
            includeHeaders?: string[]
        } | boolean,
        context?: HttpContext
    }
}

export interface NetHttpRequestWithBody extends NetHttpRequest {
    body?: any | null
}
