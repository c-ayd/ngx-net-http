import { HttpContext } from "@angular/common/http"
import { NetHttpResponseType } from "../enums/net-http-response-type"

/**
 * Represents the required parameters to make an HTTP request without body.
 */
export interface NetHttpRequest {
    /**
     * Base URL for the request. This must be provided if a base URL is not set for the library or
     * if the request will be sent to a different URL than the one defined for the library.
     * Otherwise, it can be skipped.
     * 
     * **Correct Usage:** https://www.example.com/api
     * 
     * **Wrong Usage:** https://www.example.com/api/ (do not put / character at the end)
     */
    baseUrl?: string,
    /**
     * First route appened to the base URL. It is a convenience for the ones who are familiar with the MVC pattern.
     * This is not a required parameter.
     * 
     * ```routes``` parameter can be used instead.
     */
    controller?: string,
    /**
     * Routes appended to the base URL.
     */
    routes?: (string | number | boolean)[],
    /**
     * Query parameters appended to the end of the URL.
     */
    queryParams?: Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>,
    /**
     * HTTP headers to be included in the request.
     */
    headers?: Record<string, string | string[]>,
    /**
     * Whether the cookies will be sent with the request.
     */
    withCredentials?: boolean,
    /**
     * Expected response from the request. The type must match with the ```callbacks``` parameter of the function (```NetHttpCallbacks<T>```).
     * ### Usage Notes
     * if ```NetHttpResponseType.ArrayBuffer``` is chosen, the callbacks' return types must be ```ArrayBuffer```.
     * 
     * if ```NetHttpResponseType.Blob``` is chosen, the callbacks' return types must be ```Blob```.
     * 
     * if ```NetHttpResponseType.Text``` is chosen, the callbacks' return types must be ```string```.
     * 
     * if ```NetHttpResponseType.Json``` is chosen or the response type is not defined, the callbacks' return types can be a user defined type.
     */
    responseType?: NetHttpResponseType,
    /**
     * Additonal options for the request, such as automatic download, caching and http context.
     */
    options?: {
        /**
         * If defined, it will automatically start downloading the response body.
         */
        download?: {
            /**
             * Type of the data. Default is ```application/octet-stream```.
             */
            mimeType?: string,
            /**
             * Name of the file with its extension. Default is ```file``` without an extension.
             * @example 'pic.png'
             */
            fileName?: string
        },
        /**
         * This property accepts either a boolean to enable/disable transferring cache for eligible
         * requests performed using `HttpClient`, or an object, which allows to configure cache
         * parameters, such as which headers should be included (no headers are included by default).
         *
         * Setting this property will override the options passed to `provideClientHydration()` for this
         * particular request
         */
        transferCache?: {
            includeHeaders?: string[]
        } | boolean,
        /**
         * Http context stores arbitrary user defined values and ensures type safety without
         * actually knowing the types. It is backed by a `Map` and guarantees that keys do not clash.
         *
         * This context is mutable and is shared between cloned requests unless explicitly specified.
         *
         * @usageNotes
         *
         * ### Usage Example
         *
         * ```ts
         * // inside cache.interceptors.ts
         * export const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);
         *
         * export class CacheInterceptor implements HttpInterceptor {
         *
         *   intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
         *     if (req.context.get(IS_CACHE_ENABLED) === true) {
         *       return ...;
         *     }
         *     return delegate.handle(req);
         *   }
         * }
         *
         * // inside a service
         *
         * this.httpClient.get('/api/weather', {
         *   context: new HttpContext().set(IS_CACHE_ENABLED, true)
         * }).subscribe(...);
         * ```
         */
        context?: HttpContext
    }
}

/**
 * Represents the required parameters to make an HTTP request with body.
 */
export interface NetHttpRequestWithBody extends NetHttpRequest {
    /**
     * HTTP body of the request.
     */
    body?: any | null
}
