import { TestBed } from "@angular/core/testing";
import { NetHttpService } from "../net-http.service";
import { InjectionToken } from "@angular/core";
import { HttpClient, HttpEvent, HttpEventType, HttpHeaderResponse, HttpHeaders, HttpProgressEvent, provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { NetHttpResponseType } from "../enums/net-http-response-type";
import { NetHttpHeaderResponse, NetHttpResponse } from "../interfaces/net-http-response";

interface JsonTestResult {
  key1: string,
  key2: number,
  key3: boolean,
  key4: any
}

describe('NetHttpService DELETE', () => {
  const BASE_URL_TOKEN = new InjectionToken<string>('NET_HTTP_BASE_URL');
  const BASE_URL = 'https://www.example.com';
  let service: NetHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL_TOKEN, useValue: BASE_URL }
      ]
    });

    service = new NetHttpService(TestBed.inject(HttpClient), TestBed.inject(BASE_URL_TOKEN));
  });

  it('When the delete method is called with a response type of ArrayBuffer while providing all callbacks, it should invoke all the callbacks, except the error callback', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseHeaderResult = false;
    let onReceivedResponseCalled = false;
    let onReceivedResponseResult = false;
    let onReceivedBodyCalled = false;
    let onReceivedBodyResult = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let downloadProgressResult = false;
    let onErrorCalled = false;

    const subscription = service.delete<ArrayBuffer>({
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-array-buffer.txt'
        }
      },
      responseType: NetHttpResponseType.ArrayBuffer,
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
        onReceivedResponseHeaderResult = headerResponse.headers!.get('TestHeader') === 'test';
      },
      onReceivedResponse: (response: NetHttpResponse<ArrayBuffer>) => {
        onReceivedResponseCalled = true;
        onReceivedResponseResult = response.headers!.get('TestHeader') === 'test' && response.body!.byteLength == 2;
      },
      onReceivedBody: (body: ArrayBuffer) => {
        onReceivedBodyCalled = true;
        onReceivedBodyResult = body.byteLength == 2;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
        downloadProgressResult = loaded == 50 && total == 100;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    });

    // Act
    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    const responseHeaderEvent: HttpEvent<ArrayBuffer> = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });
    const downloadProgressEvent: HttpProgressEvent = {
      type: HttpEventType.DownloadProgress,
      loaded: 50,
      total: 100
    };
    expect(request.request.method).toBe('DELETE');
    request.event(responseHeaderEvent);
    request.event(downloadProgressEvent);
    request.flush(new ArrayBuffer(2), {
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });

    // Assert
    expect(subscription != null).withContext('Subscription is not null nor undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is called').toBeTrue();
    expect(onReceivedResponseHeaderResult).withContext('onReceivedResponseHeader has correct parameter').toBeTrue();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is called').toBeTrue();
    expect(onReceivedResponseResult).withContext('onReceivedResponse has correct parameter').toBeTrue();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is called').toBeTrue();
    expect(onReceivedBodyResult).withContext('onReceivedBody has correct parameter').toBeTrue();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is called').toBeTrue();
    expect(downloadProgressCalled).withContext('downloadProgress is called').toBeTrue();
    expect(downloadProgressResult).withContext('downloadProgress has correct parameter').toBeTrue();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When the delete method is called with a response type of Blob while providing all callbacks, it should invoke all the callbacks, except the error callback', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseHeaderResult = false;
    let onReceivedResponseCalled = false;
    let onReceivedResponseResult = false;
    let onReceivedBodyCalled = false;
    let onReceivedBodyResult = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let downloadProgressResult = false;
    let onErrorCalled = false;

    // Act
    const subscription = service.delete<Blob>({
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-blob.txt'
        }
      },
      responseType: NetHttpResponseType.Blob,
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
        onReceivedResponseHeaderResult = headerResponse.headers!.get('TestHeader') === 'test';
      },
      onReceivedResponse: (response: NetHttpResponse<Blob>) => {
        onReceivedResponseCalled = true;
        onReceivedResponseResult = response.headers!.get('TestHeader') === 'test' && response.body!.size == 3;
      },
      onReceivedBody: (body: Blob) => {
        onReceivedBodyCalled = true;
        onReceivedBodyResult = body.size == 3;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
        downloadProgressResult = loaded == 50 && total == 100;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    });

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    const responseHeaderEvent: HttpEvent<Blob> = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });
    const downloadProgressEvent: HttpProgressEvent = {
      type: HttpEventType.DownloadProgress,
      loaded: 50,
      total: 100
    };
    expect(request.request.method).toBe('DELETE');
    request.event(responseHeaderEvent);
    request.event(downloadProgressEvent);
    request.flush(new Blob(['1', '2', '3']), {
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });

    // Assert
    expect(subscription != null).withContext('Subscription is not null nor undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is called').toBeTrue();
    expect(onReceivedResponseHeaderResult).withContext('onReceivedResponseHeader has correct parameter').toBeTrue();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is called').toBeTrue();
    expect(onReceivedResponseResult).withContext('onReceivedResponse has correct parameter').toBeTrue();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is called').toBeTrue();
    expect(onReceivedBodyResult).withContext('onReceivedBody has correct parameter').toBeTrue();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is called').toBeTrue();
    expect(downloadProgressCalled).withContext('downloadProgress is called').toBeTrue();
    expect(downloadProgressResult).withContext('downloadProgress has correct parameter').toBeTrue();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When the delete method is called with a response type of Text while providing all callbacks, it should invoke all the callbacks, except the error callback', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseHeaderResult = false;
    let onReceivedResponseCalled = false;
    let onReceivedResponseResult = false;
    let onReceivedBodyCalled = false;
    let onReceivedBodyResult = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let downloadProgressResult = false;
    let onErrorCalled = false;

    // Act
    const subscription = service.delete<string>({
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-text.txt'
        }
      },
      responseType: NetHttpResponseType.Text,
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
        onReceivedResponseHeaderResult = headerResponse.headers!.get('TestHeader') === 'test';
      },
      onReceivedResponse: (response: NetHttpResponse<string>) => {
        onReceivedResponseCalled = true;
        onReceivedResponseResult = response.headers!.get('TestHeader') === 'test' && response.body === 'result';
      },
      onReceivedBody: (body: string) => {
        onReceivedBodyCalled = true;
        onReceivedBodyResult = body === 'result';
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
        downloadProgressResult = loaded == 50 && total == 100;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    });

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    const responseHeaderEvent: HttpEvent<string> = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });
    const downloadProgressEvent: HttpProgressEvent = {
      type: HttpEventType.DownloadProgress,
      loaded: 50,
      total: 100
    };
    expect(request.request.method).toBe('DELETE');
    request.event(responseHeaderEvent);
    request.event(downloadProgressEvent);
    request.flush('result', {
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });

    // Assert
    expect(subscription != null).withContext('Subscription is not null nor undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is called').toBeTrue();
    expect(onReceivedResponseHeaderResult).withContext('onReceivedResponseHeader has correct parameter').toBeTrue();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is called').toBeTrue();
    expect(onReceivedResponseResult).withContext('onReceivedResponse has correct parameter').toBeTrue();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is called').toBeTrue();
    expect(onReceivedBodyResult).withContext('onReceivedBody has correct parameter').toBeTrue();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is called').toBeTrue();
    expect(downloadProgressCalled).withContext('downloadProgress is called').toBeTrue();
    expect(downloadProgressResult).withContext('downloadProgress has correct parameter').toBeTrue();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When the delete method is called with a response type of Json while providing all callbacks, it should invoke all the callbacks, except the error callback', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseHeaderResult = false;
    let onReceivedResponseCalled = false;
    let onReceivedResponseResult = false;
    let onReceivedBodyCalled = false;
    let onReceivedBodyResult = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let downloadProgressResult = false;
    let onErrorCalled = false;

    // Act
    const subscription = service.delete<JsonTestResult>({
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-json.txt'
        }
      },
      responseType: NetHttpResponseType.Json,
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
        onReceivedResponseHeaderResult = headerResponse.headers!.get('TestHeader') === 'test';
      },
      onReceivedResponse: (response: NetHttpResponse<JsonTestResult>) => {
        onReceivedResponseCalled = true;
        onReceivedResponseResult = response.headers!.get('TestHeader') === 'test' &&
          response.body!.key1 === 'result' &&
          response.body!.key2 === 123 &&
          response.body!.key3 === true &&
          response.body!.key4['key4.1'] === 456;
      },
      onReceivedBody: (body: JsonTestResult) => {
        onReceivedBodyCalled = true;
        onReceivedBodyResult = body.key1 === 'result' &&
          body.key2 === 123 &&
          body.key3 === true &&
          body.key4['key4.1'] === 456;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
        downloadProgressResult = loaded == 50 && total == 100;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    });

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    const responseHeaderEvent: HttpEvent<JsonTestResult> = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });
    const downloadProgressEvent: HttpProgressEvent = {
      type: HttpEventType.DownloadProgress,
      loaded: 50,
      total: 100
    };
    expect(request.request.method).toBe('DELETE');
    request.event(responseHeaderEvent);
    request.event(downloadProgressEvent);
    request.flush({
      key1: 'result',
      key2: 123,
      key3: true,
      key4: {
        'key4.1': 456
      }
    }, {
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });

    // Assert
    expect(subscription != null).withContext('Subscription is not null nor undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is called').toBeTrue();
    expect(onReceivedResponseHeaderResult).withContext('onReceivedResponseHeader has correct parameter').toBeTrue();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is called').toBeTrue();
    expect(onReceivedResponseResult).withContext('onReceivedResponse has correct parameter').toBeTrue();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is called').toBeTrue();
    expect(onReceivedBodyResult).withContext('onReceivedBody has correct parameter').toBeTrue();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is called').toBeTrue();
    expect(downloadProgressCalled).withContext('downloadProgress is called').toBeTrue();
    expect(downloadProgressResult).withContext('downloadProgress has correct parameter').toBeTrue();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When the delete method is called without a response type while providing all callbacks, it should select the Json response type and invoke all the callbacks, except the error callback', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseHeaderResult = false;
    let onReceivedResponseCalled = false;
    let onReceivedResponseResult = false;
    let onReceivedBodyCalled = false;
    let onReceivedBodyResult = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let downloadProgressResult = false;
    let onErrorCalled = false;

    // Act
    const subscription = service.delete<JsonTestResult>({
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-no-type.txt'
        }
      }
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
        onReceivedResponseHeaderResult = headerResponse.headers!.get('TestHeader') === 'test';
      },
      onReceivedResponse: (response: NetHttpResponse<JsonTestResult>) => {
        onReceivedResponseCalled = true;
        onReceivedResponseResult = response.headers!.get('TestHeader') === 'test' &&
          response.body!.key1 === 'result' &&
          response.body!.key2 === 123 &&
          response.body!.key3 === true &&
          response.body!.key4['key4.1'] === 456;
      },
      onReceivedBody: (body: JsonTestResult) => {
        onReceivedBodyCalled = true;
        onReceivedBodyResult = body.key1 === 'result' &&
          body.key2 === 123 &&
          body.key3 === true &&
          body.key4['key4.1'] === 456;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
        downloadProgressResult = loaded == 50 && total == 100;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    });

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    const responseHeaderEvent: HttpEvent<JsonTestResult> = new HttpHeaderResponse({
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });
    const downloadProgressEvent: HttpProgressEvent = {
      type: HttpEventType.DownloadProgress,
      loaded: 50,
      total: 100
    };
    expect(request.request.method).toBe('DELETE');
    request.event(responseHeaderEvent);
    request.event(downloadProgressEvent);
    request.flush({
      key1: 'result',
      key2: 123,
      key3: true,
      key4: {
        'key4.1': 456
      }
    }, {
      headers: new HttpHeaders({
        'TestHeader': 'test'
      })
    });

    // Assert
    expect(subscription != null).withContext('Subscription is not null nor undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is called').toBeTrue();
    expect(onReceivedResponseHeaderResult).withContext('onReceivedResponseHeader has correct parameter').toBeTrue();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is called').toBeTrue();
    expect(onReceivedResponseResult).withContext('onReceivedResponse has correct parameter').toBeTrue();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is called').toBeTrue();
    expect(onReceivedBodyResult).withContext('onReceivedBody has correct parameter').toBeTrue();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is called').toBeTrue();
    expect(downloadProgressCalled).withContext('downloadProgress is called').toBeTrue();
    expect(downloadProgressResult).withContext('downloadProgress has correct parameter').toBeTrue();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });
});
