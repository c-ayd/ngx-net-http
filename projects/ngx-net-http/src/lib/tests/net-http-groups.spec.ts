import { TestBed } from '@angular/core/testing';
import { NetHttpService } from '../net-http.service';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpHeaderResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { NetHttpResponseType } from '../enums/net-http-response-type';
import { NetHttpHeaderResponse, NetHttpResponse } from '../interfaces/net-http-response';

class TestGroupClass { }

describe('NetHttpService Groups', () => {
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

  it('When a http request is grouped by a string value for the first time and the subscription is cleared before the request gets a response, it should first create the group and add the subscription to the group and then delete the group, and when the request is mocked, it should call no callbacks, except the request sent callback', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseCalled = false;
    let onReceivedBodyCalled = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let onErrorCalled = false;

    // Act
    service.get<string>({
      responseType: NetHttpResponseType.Text,
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-cancel.txt'
        }
      }
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
      },
      onReceivedResponse: (response: NetHttpResponse<string>) => {
        onReceivedResponseCalled = true;
      },
      onReceivedBody: (body: string) => {
        onReceivedBodyCalled = true;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    }, 'TestGroup');

    expect(service['groupedSubscriptions'].get('TestGroup')?.length).toBe(1);
    service.clearSubscriptions('TestGroup');

    try {
      const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
      const responseHeaderEvent: HttpEvent<string> = new HttpHeaderResponse();
      const downloadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.DownloadProgress,
        loaded: 50,
        total: 100
      };
      expect(request.request.method).toBe('GET');
      request.event(responseHeaderEvent);
      request.event(downloadProgressEvent);
      request.flush('');
    }
    catch { }

    // Assert
    expect(service['groupedSubscriptions'].get('TestGroup') == undefined).withContext('The subscription group is undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is not called').toBeFalse();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is not called').toBeFalse();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is not called').toBeFalse();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is not called').toBeFalse();
    expect(downloadProgressCalled).withContext('downloadProgress is not called').toBeFalse();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When a http request is grouped by a string value while there is already another subscription in the group and the subscriptions are cleared before the request gets a response, it should add the subscription to the group and then delete the group, and when the request is mocked, it should call no callbacks, except the request sent callback', () => {
    // Arrange
    service.get(undefined, undefined, 'TestGroup');

    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseCalled = false;
    let onReceivedBodyCalled = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let onErrorCalled = false;

    // Act
    service.get<string>({
      responseType: NetHttpResponseType.Text,
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-cancel.txt'
        }
      }
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
      },
      onReceivedResponse: (response: NetHttpResponse<string>) => {
        onReceivedResponseCalled = true;
      },
      onReceivedBody: (body: string) => {
        onReceivedBodyCalled = true;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    }, 'TestGroup');

    expect(service['groupedSubscriptions'].get('TestGroup')?.length).toBe(2);
    service.clearSubscriptions('TestGroup');

    try {
      const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
      const responseHeaderEvent: HttpEvent<string> = new HttpHeaderResponse();
      const downloadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.DownloadProgress,
        loaded: 50,
        total: 100
      };
      expect(request.request.method).toBe('GET');
      request.event(responseHeaderEvent);
      request.event(downloadProgressEvent);
      request.flush('');
    }
    catch { }

    // Assert
    expect(service['groupedSubscriptions'].get('TestGroup') == undefined).withContext('The subscription group is undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is not called').toBeFalse();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is not called').toBeFalse();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is not called').toBeFalse();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is not called').toBeFalse();
    expect(downloadProgressCalled).withContext('downloadProgress is not called').toBeFalse();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When a http request is grouped by an object value for the first time and the subscription is cleared before the request gets a response, it should first create the group and add the subscription to the group and then delete the group, and when the request is mocked, it should call no callbacks, except the request sent callback', () => {
    // Arrange
    const group = new TestGroupClass();

    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseCalled = false;
    let onReceivedBodyCalled = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let onErrorCalled = false;

    // Act
    service.get<string>({
      responseType: NetHttpResponseType.Text,
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-cancel.txt'
        }
      }
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
      },
      onReceivedResponse: (response: NetHttpResponse<string>) => {
        onReceivedResponseCalled = true;
      },
      onReceivedBody: (body: string) => {
        onReceivedBodyCalled = true;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    }, group);

    expect(service['groupedSubscriptions'].get(group)?.length).toBe(1);
    service.clearSubscriptions(group);

    try {
      const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
      const responseHeaderEvent: HttpEvent<string> = new HttpHeaderResponse();
      const downloadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.DownloadProgress,
        loaded: 50,
        total: 100
      };
      expect(request.request.method).toBe('GET');
      request.event(responseHeaderEvent);
      request.event(downloadProgressEvent);
      request.flush('');
    }
    catch { }

    // Assert
    expect(service['groupedSubscriptions'].get(group) == undefined).withContext('The subscription group is undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is not called').toBeFalse();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is not called').toBeFalse();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is not called').toBeFalse();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is not called').toBeFalse();
    expect(downloadProgressCalled).withContext('downloadProgress is not called').toBeFalse();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When a http request is grouped by an object value while there is already another subscription in the group and the subscriptions are cleared before the request gets a response, it should add the subscription to the group and then delete the group, and when the request is mocked, it should call no callbacks, except the request sent callback', () => {
    // Arrange
    const group = new TestGroupClass();

    service.get(undefined, undefined, group);

    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseCalled = false;
    let onReceivedBodyCalled = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let onErrorCalled = false;

    // Act
    service.get<string>({
      responseType: NetHttpResponseType.Text,
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-cancel.txt'
        }
      }
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
      },
      onReceivedResponse: (response: NetHttpResponse<string>) => {
        onReceivedResponseCalled = true;
      },
      onReceivedBody: (body: string) => {
        onReceivedBodyCalled = true;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    }, group);

    expect(service['groupedSubscriptions'].get(group)?.length).toBe(2);
    service.clearSubscriptions(group);

    try {
      const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
      const responseHeaderEvent: HttpEvent<string> = new HttpHeaderResponse();
      const downloadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.DownloadProgress,
        loaded: 50,
        total: 100
      };
      expect(request.request.method).toBe('GET');
      request.event(responseHeaderEvent);
      request.event(downloadProgressEvent);
      request.flush('');
    }
    catch { }

    // Assert
    expect(service['groupedSubscriptions'].get(group) == undefined).withContext('The subscription group is undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is not called').toBeFalse();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is not called').toBeFalse();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is not called').toBeFalse();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is not called').toBeFalse();
    expect(downloadProgressCalled).withContext('downloadProgress is not called').toBeFalse();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });

  it('When a http request is grouped while there are already other groups and the groups are cleared before the request gets a response, it should add the subscription to the group and then delete all the groups, and when the request is mocked, it should call no callbacks, except the request sent callback', () => {
    // Arrange
    const group = new TestGroupClass();

    service.get(undefined, undefined, group);
    service.get(undefined, undefined, 'TestGroup');

    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseCalled = false;
    let onReceivedBodyCalled = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let onErrorCalled = false;

    // Act
    service.get<string>({
      responseType: NetHttpResponseType.Text,
      options: {
        download: {
          mimeType: 'application/octet-stream',
          fileName: 'test-cancel.txt'
        }
      }
    }, {
      onRequestSent: () => {
        onRequestSentCalled = true;
      },
      onReceivedResponseHeader: (headerResponse: NetHttpHeaderResponse) => {
        onReceivedResponseHeaderCalled = true;
      },
      onReceivedResponse: (response: NetHttpResponse<string>) => {
        onReceivedResponseCalled = true;
      },
      onReceivedBody: (body: string) => {
        onReceivedBodyCalled = true;
      },
      onRequestCompleted: () => {
        onRequestCompletedCalled = true;
      },
      downloadProgress: (loaded: number, total?: number) => {
        downloadProgressCalled = true;
      },
      onError: (error: any) => {
        onErrorCalled = true;
      }
    }, group);

    expect(service['groupedSubscriptions'].get('TestGroup')?.length).toBe(1);
    expect(service['groupedSubscriptions'].get(group)?.length).toBe(2);
    service.clearAllSubscriptions();

    try {
      const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
      const responseHeaderEvent: HttpEvent<string> = new HttpHeaderResponse();
      const downloadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.DownloadProgress,
        loaded: 50,
        total: 100
      };
      expect(request.request.method).toBe('GET');
      request.event(responseHeaderEvent);
      request.event(downloadProgressEvent);
      request.flush('');
    }
    catch { }

    // Assert
    expect(service['groupedSubscriptions'].get(group) == undefined).withContext('The subscription group by class is undefined').toBeTrue();
    expect(service['groupedSubscriptions'].get('TestGroup') == undefined).withContext('The subscription group by string is undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is not called').toBeFalse();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is not called').toBeFalse();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is not called').toBeFalse();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is not called').toBeFalse();
    expect(downloadProgressCalled).withContext('downloadProgress is not called').toBeFalse();
    expect(onErrorCalled).withContext('onError is not called').toBeFalse();
  });
});
