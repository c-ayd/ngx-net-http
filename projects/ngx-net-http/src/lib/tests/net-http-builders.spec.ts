import { TestBed } from "@angular/core/testing";
import { NetHttpService } from "../net-http.service";
import { InjectionToken } from "@angular/core";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NetHttpInvalidUrl } from "../errors/net-http-invalid-url";

describe('NetHttpService Builders', () => {
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

  it('When request parameters are given to the build URL method, it should return the correct URL', () => {
    // Act
    const { baseUrl, url } = service['buildUrl']({
      controller: 'api',
      routes: ['string', 123, true]
    });

    // Assert
    expect(baseUrl).toBe(BASE_URL);
    expect(url).toBe(BASE_URL + '/api/string/123/true');
  });
});

describe('NetHttpService without a base URL in DI', () => {
  let service: NetHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = new NetHttpService(TestBed.inject(HttpClient), null);
  });

  it('When request parameters are given to the build URL method, it should return the correct URL', () => {
    const { baseUrl, url } = service['buildUrl']({
      baseUrl: 'test/',
      controller: 'api',
      routes: ['string', 123, true]
    });

    expect(baseUrl).toBe('test');
    expect(url).toBe('test/api/string/123/true');
  });

  it('When no URL is given to the build URL method, it should throw the NetHttpInvalidUrl error', (done: DoneFn) => {
    try {
      service['buildUrl']({
        controller: 'api',
        routes: ['string', 123, true]
      });
    }
    catch (error: any) {
      expect(error instanceof NetHttpInvalidUrl).withContext('Error type is NetHttpInvalidUrl').toBeTrue();
      done();
    }
  });
});
