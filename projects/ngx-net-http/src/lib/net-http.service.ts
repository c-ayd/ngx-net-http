import { Inject, Injectable, Optional } from '@angular/core';
import { NetHttpRequest, NetHttpRequestWithBody } from './interfaces/net-http-request';
import { NetHttpInvalidUrl } from './errors/net-http-invalid-url';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { NetHttpResponseType } from './enums/net-http-response-type';
import { NetHttpCallbacks } from './interfaces/net-http-callbacks';
import { Observer, Subscription } from 'rxjs';
import { toNetHttpHeaderResponse, toNetHttpResponse } from './interfaces/net-http-response';

@Injectable({
  providedIn: 'root'
})
export class NetHttpService {
  private headerSettings = new Map<string, Record<string, string | string[]>>();

  constructor(private http: HttpClient,
    @Optional() @Inject('NET_HTTP_BASE_URL') private baseUrl: string | null
  ) { }

  private buildUrl(request?: Partial<NetHttpRequest>): {
    baseUrl: string,
    url: string,
  } {
    let baseUrl = request?.baseUrl ?? this.baseUrl;
    if (baseUrl == undefined)
      throw new NetHttpInvalidUrl('Please define a base URL for the Net HTTP service in DI or a base URL in the request');

    let url = baseUrl;

    if (request?.controller) {
      url = url.concat(`/${request.controller}`);
    }

    if (request?.routes) {
      for (const route of request.routes) {
        if (typeof route === 'string') {
          url = url.concat(`/${route}`);
        }
        else {
          url = url.concat(`/${route.toString()}`);
        }
      }
    }

    return {
      baseUrl,
      url
    };
  }

  private buildHeaders(baseUrl: string, request?: Partial<NetHttpRequest>): HttpHeaders | undefined {
    let headers: Record<string, string | string[]> = {};
    if (this.headerSettings.has('*')) {
      this.mergeHeaders(headers, this.headerSettings.get('*'));
    }
    if (this.headerSettings.has(baseUrl)) {
      this.mergeHeaders(headers, this.headerSettings.get(baseUrl));
    }
    if (request?.headers) {
      this.mergeHeaders(headers, request.headers);
    }

    if (Object.entries(headers).length == 0)
      return undefined;

    return new HttpHeaders(headers);
  }

  private mergeHeaders(currentHeaders: Record<string, string | string[]>, headers?: Record<string, string | string[]>): void {
    if (headers == undefined)
      return;
    
    for (const [key, value] of Object.entries(headers)) {
      currentHeaders[key] = value;
    }
  }

  private buildQueryParams(request?: Partial<NetHttpRequest>): HttpParams | undefined {
    if (request?.queryParams == undefined)
      return undefined;

    let queryParams: HttpParams = new HttpParams();
    for (const [key, params] of Object.entries(request.queryParams)) {
      if (params instanceof Array) {
        for (const param of params) {
          queryParams = queryParams.append(`${key}`, param);
        }
      }
      else {
        queryParams = queryParams.set(key, params);
      }
    }

    return queryParams;
  }

  private buildOptions<T>(baseUrl: string, request?: Partial<NetHttpRequest>, callbacks?: Partial<NetHttpCallbacks<T>>): {} {
    return {
      responseType: request?.responseType ?? NetHttpResponseType.Json,
      reportProgress: callbacks && (callbacks.uploadProgress || callbacks.downloadProgress) ? true : false,
      params: this.buildQueryParams(request),
      headers: this.buildHeaders(baseUrl, request),
      withCredentials: request?.withCredentials,
      context: request?.options?.context,
    };
  }

  private handleHttpEvent<T>(request?: Partial<NetHttpRequest>, callbacks?: Partial<NetHttpCallbacks<T>>): Partial<Observer<HttpEvent<T>>> {
    if (callbacks == undefined)
      return this.handleNoCallback(request);

    return {
      next: (httpEvent: HttpEvent<any>) => {
        switch (httpEvent.type) {
          case (HttpEventType.Sent): {
            callbacks.onRequestSent?.();
            break;
          }
          case (HttpEventType.ResponseHeader): {
            callbacks.onReceivedResponseHeader?.(toNetHttpHeaderResponse(httpEvent));
            break;
          }
          case (HttpEventType.UploadProgress): {
            callbacks.uploadProgress?.(httpEvent.loaded, httpEvent.total);
            break;
          }
          case (HttpEventType.DownloadProgress): {
            callbacks.downloadProgress?.(httpEvent.loaded, httpEvent.total);
            break;
          }
          case (HttpEventType.Response): {
            callbacks.onReceivedResponse?.(toNetHttpResponse(httpEvent));
            callbacks.onReceivedBody?.(httpEvent.body);
            callbacks.onRequestCompleted?.();

            if (request?.options?.download) {
              this.startDownload(httpEvent.body, request.options.download.mimeType, request.options.download.fileName);
            }
            break;
          }
        }
      },
      error: (error: any) => {
        callbacks.onError?.(error);
      }
    };
  }

  private handleNoCallback<T>(request?: Partial<NetHttpRequest>): Partial<Observer<T>> {
    return {
      next: (value: T) => {
        if (request?.options?.download) {
          this.startDownload(value, request.options.download.mimeType, request.options.download.fileName);
        }
      }
    };
  }

  private startDownload(data: any, type?: string, fileName?: string) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName ?? 'file';
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  }

  /**
   * Sends an HTTP ```GET``` request.
   * @param request HTTP request parameters.
   * @param callbacks Functions to be invoked when the response is received.
   * @returns ```Subscription``` object of the request.
   */
  get<T>(request?: Partial<NetHttpRequest>, callbacks?: Partial<NetHttpCallbacks<T>>): Subscription {
    const { baseUrl, url } = this.buildUrl(request);
    const options = {
      ...this.buildOptions(baseUrl, request, callbacks),
      transferCache: request?.options?.transferCache,
    }

    const subscription = this.http.request<T>(new HttpRequest<T>('GET', url, options))
      .subscribe(this.handleHttpEvent(request, callbacks));

    return subscription;
  }

  /**
   * Sends an HTTP ```POST``` request.
   * @param request HTTP request parameters.
   * @param callbacks Functions to be invoked when the response is received.
   * @returns ```Subscription``` object of the request.
   */
  post<T>(request?: Partial<NetHttpRequestWithBody>, callbacks?: Partial<NetHttpCallbacks<T>>): Subscription {
    const { baseUrl, url } = this.buildUrl(request);
    const options = {
      ...this.buildOptions(baseUrl, request, callbacks),
      transferCache: request?.options?.transferCache,
    }

    const subscription = this.http.request<T>(new HttpRequest<T>('POST', url, request?.body, options))
      .subscribe(this.handleHttpEvent(request, callbacks));

    return subscription;
  }

  /**
   * Sends an HTTP ```PUT``` request.
   * @param request HTTP request parameters.
   * @param callbacks Functions to be invoked when the response is received.
   * @returns ```Subscription``` object of the request.
   */
  put<T>(request?: Partial<NetHttpRequestWithBody>, callbacks?: Partial<NetHttpCallbacks<T>>): Subscription {
    const { baseUrl, url } = this.buildUrl(request);
    const options = this.buildOptions(baseUrl, request, callbacks);

    const subscription = this.http.request<T>(new HttpRequest<T>('PUT', url, request?.body, options))
      .subscribe(this.handleHttpEvent(request, callbacks));

    return subscription;
  }

  /**
   * Configures headers for a specific URL, so that when an HTTP request is sent to that URL, the headers are added automatically.
   * @param baseUrl URL to which the headers will be added.
   * @param headers Headers to be added.
   */
  addHeadersToUrl(baseUrl: string, headers: Record<string, string | string[]>): void {
    if (this.headerSettings.has(baseUrl)) {
      let currentHeaders = this.headerSettings.get(baseUrl)!;
      for (const [key, value] of Object.entries(headers)) {
        currentHeaders[key] = value;
      }
    }
    else {
      this.headerSettings.set(baseUrl, headers);
    }
  }

  /**
   * Configures headers for all HTTP requests. When an HTTP request is sent, the headers are added automatically.
   * @param headers Headers to be added.
   */
  addGlobalHeaders(headers: Record<string, string | string[]>): void {
    this.addHeadersToUrl('*', headers);
  }

  /**
   * Removes defined headers for a specific URL.
   * @param baseUrl URL from which the headers will be removed from.
   * @param headerKeys Header keys to be removed.
   */
  removeHeadersFromUrl(baseUrl: string, headerKeys: string[]): void {
    if (!this.headerSettings.has(baseUrl))
      return;

    let currentHeaders = this.headerSettings.get(baseUrl)!;
    for (const key of headerKeys) {
      delete currentHeaders[key];
    }

    if (Object.keys(currentHeaders).length == 0) {
      this.headerSettings.delete(baseUrl);
    }
  }

  /**
   * Removes globally defined headers.
   * @param headerKeys Headers keys to be removed.
   */
  removeGlobalHeaders(headerKeys: string[]): void {
    this.removeHeadersFromUrl('*', headerKeys);
  }

  /**
   * Clears all headers for a specific URL.
   * @param baseUrl URL from which all headers will be cleared.
   */
  clearHeadersFromUrl(baseUrl: string): void {
    this.headerSettings.delete(baseUrl)!;
  }

  /**
   * Clears all globally defined headers.
   */
  clearGlobalHeaders(): void {
    this.clearHeadersFromUrl('*');
  }

  /**
   * Clears all header settings.
   */
  clearAllHeaders(): void {
    this.headerSettings.clear();
  }
}
