import { TestBed } from '@angular/core/testing';
import { NetHttpService } from '../net-http.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { NetHttpHeaderResponse, NetHttpResponse } from '../interfaces/net-http-response';

describe('NetHttpService Edge Cases', () => {
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

  it('When a http request is made using the fire-and-forget approach, it should not throw any error', () => {
    // Act
    service.post({
      body: {
        key1: 'test'
      }
    });

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    expect(request.request.method).toBe('POST');
    request.flush('');
  });

  it('When a request is sent and error happens, it should invoke only the sent and error callbacks', () => {
    // Arrange
    let onRequestSentCalled = false;
    let onReceivedResponseHeaderCalled = false;
    let onReceivedResponseCalled = false;
    let onReceivedBodyCalled = false;
    let onRequestCompletedCalled = false;
    let downloadProgressCalled = false;
    let onErrorCalled = false;

    // Act
    const subscription = service.get<string>(undefined, {
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
    });

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    expect(request.request.method).toBe('GET');
    request.error(new ProgressEvent(''));

    // Assert
    expect(subscription != null).withContext('Subscription is not null nor undefined').toBeTrue();
    expect(onRequestSentCalled).withContext('onRequestSent is called').toBeTrue();
    expect(onReceivedResponseHeaderCalled).withContext('onReceivedResponseHeader is not called').toBeFalse();
    expect(onReceivedResponseCalled).withContext('onReceivedResponse is not called').toBeFalse();
    expect(onReceivedBodyCalled).withContext('onReceivedBody is not called').toBeFalse();
    expect(onRequestCompletedCalled).withContext('onRequestCompleted is not called').toBeFalse();
    expect(downloadProgressCalled).withContext('downloadProgress is not called').toBeFalse();
    expect(onErrorCalled).withContext('onError is called').toBeTrue();
  });
});
