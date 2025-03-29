import { Inject, Injectable, Optional } from '@angular/core';
import { NetHttpRequest } from './interfaces/net-http-request';
import { NetHttpInvalidUrl } from './errors/net-http-invalid-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NetHttpService {
  private headerSettings = new Map<string, Record<string, string | string[]>>();

  constructor(private http: HttpClient,
    @Optional() @Inject('NET_HTTP_BASE_URL') private baseUrl: string | null
  ) { }

  private buildUrl(request: Partial<NetHttpRequest>): {
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
