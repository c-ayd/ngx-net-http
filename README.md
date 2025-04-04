## Why Would You Need This?
NetHttp is a library wrapping Angular's HttpClient for greater ease of use while providing additional functionalities such as:

- Defining HTTP headers for specific URLs or globally that are added automatically when making an HTTP request.
- Listening to only the HTTP events you need via callback functions. The library then invokes the callback functions you define when the events occur.
- Automatically start downloading the response body and/or opening it in a new tab. So that, you do not need to deal with DOM manupilation.
- Grouping *Subscription*s. This allows you to automatically handle the unsubscribing of *Subscription*s (e.g. on page change).
  
## Content
- [How To Install](#how-to-install)
- [Quick Start](#quick-start)
  - [Define Base URL](#define-base-url)
  - [Add HttpFeatures](#add-httpfeatures)
  - [Add Headers](#add-headers)
  - [Make HTTP Request](#make-http-request)
- [Test Coverage](#test-coverage)
- [Future Work](#future-work)

## How To Install
Run the command below to install the library.
```
npm install ngx-net-http
```

## Quick Start
After installing the library, you have to add the library's dependencies to `providers` by using `provideNetHttp` coming with the library.
```ts
import { provideNetHttp } from 'ngx-net-http';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideNetHttp(),
    ...
  ]
};
```
`NOTE`: You do not have to add `provideHttpClient` with the library. The library itself adds all required providers.

---

> ### Define Base URL
Instead of defining a base URL every time you make an HTTP request, you can declare a base URL for the entire library (which is overrideable per HTTP request if needed).
```ts
import { provideNetHttp } from 'ngx-net-http';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideNetHttp('https://www.example.com'),
    ...
  ]
};
```
`NOTE`: Do not use / at the end of the base URL. The library itself handles routes.

---

> ### Add HttpFeatures
You can also add any type of `HttpFeature` to `HttpClient` like you normally do. For instance, the code below shows an example how to add interceptors.
```ts
import { provideNetHttp } from 'ngx-net-http';
import { withInterceptors } from '@angular/common/http';
... (import my interceptors)

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideNetHttp('https://www.example.com',
      withInterceptors([myInterceptor1, myInterceptor2])),
    ...
  ]
};
```
`NOTE`: In case you do not want to define a base URL but http features, you can pass `undefined` as the first parameter.

---

> ### Add Headers
You can define headers for specific URLs using `addHeadersToUrl` or globally using `addGlobalHeaders`. By doing this, when you make an HTTP request, the library checks if there is any globally defined headers and specific headers for the URL and adds all of them to the request.

The example code below configures an `Authentication` header for `https://www.example.com` whenever a new bearer token is set.
```ts
import { NetHttpService } from 'ngx-net-http';

export class MyAuthTokenService {
  private bearerToken: string | null = null;

  constructor(private netHttp: NetHttpService) { }

  setToken(newToken: string): void {
    this.bearerToken = newToken;
    this.netHttp.addHeadersToUrl('https://www.example.com', {
      Authentication: `Bearer ${this.bearerToken}`
    });
  }

  getToken(): string | null {
    return this.bearerToken;
  }
}
```

---

> ### Make HTTP Request
The public HTTP request functions in the library (`get<T>`, `post<T>`, `put<T>`, `patch<T>` and `delete<T>`) always require 3 parameters.
- First parameter is `NetHttpRequest` or `NetHttpRequestWithBody` and is used to specify the details of the request.
- Second parameter is `NetHttpCallbacks<T>` and provides callback functions that are invoked when specific HTTP events occur.
- Third parameter is `string` or `Object` and used for grouping *Subscription*s.

`Example 1`: In this code, it is assumed that, we need to send a request to an URL that is already defined for the library to register a user, and in return, we also expect the ID of the user that is created.
```ts
import { NetHttpService } from 'ngx-net-http';

interface MyResponse {
  success: boolean,
  payload: {
    id: string
  },
  metadata: any | null
}

export class ExampleComponent implements OnDestroy {
  username: string = '';
  password: string = '';

  constructor(private netHttp: NetHttpService) {}

  ngOnDestroy(): void {
    // All subscriptions grouped by this component (ExampleComponent) will be cleared
    this.netHttp.clearSubscriptions(this);
  }

  register() {
    this.netHttp.post<MyResponse>({
      routes: ['user', 'register']    // controller is not used in this example. Instead routes is used
    }, {
      onReceivedBody: (body: MyResponse) => {
        if (body.success) {
          console.log(`User created with an ID of ${body.payload.id}`);
        }
      },
      onError: (error: any) => {
        console.log(`Something happened!`);
      }
    }, this); // Group the subscription by this object
  }
}
```
The code above makes an HTTP request to `https://www.example.com/user/register` and when the response is received, the library converts the response body to the user defined type (`MyResponse` in this example) and invokes the callback functions to which user is listening (only `onReceivedBody` in this example).

`Example 2`: In this code, it is assumed that, we need to send a request to an URL rather than the defined one for the library to generate a sales report by region, then download and open the PDF file.
```ts
import { NetHttpResponseType, NetHttpService } from 'ngx-net-http';

export class ExampleComponent implements OnDestroy {
  year: number = 2025;
  region: string = 'us';
  limit: number = 500;

  progress: number = 0;

  constructor(private netHttp: NetHttpService) {}

  ngOnDestroy(): void {
    // All subscriptions grouped by this component (ExampleComponent) will be cleared
    this.netHttp.clearSubscriptions(this);
  }

  onGenerateReport() {
    this.netHttp.get<Blob>({
      baseUrl: 'https://www.anotherexample.com/api',
      controller: 'report',    // controller is used in this example. only routes could be used as well.
      routes: ['sales', this.year],
      queryParams: {
        region: this.region,
        limit: this.limit
      },
      withCredentials: true,  // Send the cookies too
      responseType: NetHttpResponseType.Blob,  // We expect the body to be a PDF file
      options: {
        download: {  // This will automatically start downloading the report as PDF
          mimeType: 'application/pdf',
          fileName: `sales-report-${this.year}-${this.region}.pdf`
        },
        openFile: {  // This will also open the PDF file in a new tab
          mimeType: 'application/pdf'
        }
      }
    }, {
      downloadProgress: (downloadedBytes: number, totalBytes?: number) => {
        if (totalBytes) {
          this.progress = downloadedBytes / totalBytes;
        }
      },
      onError: (error: any) => {
        console.log('Something went wrong!');
      }
    }, this); // Group the Subscription by this object
  }
}
```
The code above makes an HTTP request to `https://www.anotherexample.com/api/report/sales/2025?region=us&limit=500` and starts downloading the response body and opens it in a new tab.

(Please see [GitHub Wiki](https://github.com/c-ayd/ngx-net-http/wiki) for more details about the usage of NetHttp.)

## Test Coverage
`Total Number of Tests`: 53

|   |   |
|---|---|
| Statements | 95.3% ( 142/149 ) |
| Branches | 89.09% ( 49/55 ) |
| Functions | 100% ( 33/33 ) |
| Lines | 95.3% ( 142/149 ) |

## Future Work

The next planned feature of the library is to add an `HttpFeature` that automatically handles authentication tokens for specific URLs.