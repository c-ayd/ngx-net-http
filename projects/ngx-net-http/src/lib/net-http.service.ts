import { Inject, Injectable, Optional } from '@angular/core';
import { NetHttpRequest } from './interfaces/net-http-request';
import { NetHttpInvalidUrl } from './errors/net-http-invalid-url';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NetHttpService {
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

    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, baseUrl.length - 1);
    }

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
}
