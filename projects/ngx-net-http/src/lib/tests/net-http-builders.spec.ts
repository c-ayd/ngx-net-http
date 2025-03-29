import { TestBed } from "@angular/core/testing";
import { NetHttpService } from "../net-http.service";
import { InjectionToken } from "@angular/core";
import { HttpClient, HttpContext, provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NetHttpInvalidUrl } from "../errors/net-http-invalid-url";
import { NetHttpResponseType } from "../enums/net-http-response-type";

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

  it('When request parameters are given to the build headers method and there are also defined header settings, it should return the correct headers', () => {
    // Arrange
    service.addHeadersToUrl(BASE_URL, {
      key1: 'value1'
    });
    service.addHeadersToUrl(BASE_URL, {
      key2: 'value2'
    });
    service.addHeadersToUrl('test', {
      key3: 'value3',
    });
    service.addGlobalHeaders({
      key4: 'value4'
    });
    service.addGlobalHeaders({
      key5: 'value5'
    });

    // Act
    const headers = service['buildHeaders'](BASE_URL, {
      headers: {
        key6: 'value6'
      }
    });

    // Assert
    expect(headers != undefined).withContext('Headers are not undefined').toBeTrue();
    expect(headers!.get('key1')).toBe('value1');
    expect(headers!.get('key2')).toBe('value2');
    expect(headers!.get('key4')).toBe('value4');
    expect(headers!.get('key5')).toBe('value5');
    expect(headers!.get('key6')).toBe('value6');
    expect(headers!.get('key3') == null).withContext('Headers do not have key3').toBeTrue();
  });

  it('When request parameters are given to build headers method and there is no headers, it should return undefined', () => {
    // Act
    const headers = service['buildHeaders'](BASE_URL, {});

    // Assert
    expect(headers == undefined).withContext('Headers are undefined').toBeTrue();
  });

  it('When request parameters are given to the build query parameters method, it should return the correct query parameters', () => {
    // Act
    const queryParams = service['buildQueryParams']({
      queryParams: {
        key1: 'value1',
        key2: 123,
        key3: true,
        key4: ['value2', 456, true, false]
      }
    });

    // Assert
    expect(queryParams != undefined).withContext('Query params are not undefined').toBeTrue();
    expect(queryParams!.get('key1')).toBe('value1');
    expect(queryParams!.get('key2')).toBe('123');
    expect(queryParams!.get('key3')).toBe('true');
    expect(queryParams!.getAll('key4')).toEqual(['value2', '456', 'true', 'false']);
  });

  it('When request parameters are given to the build query parameters method and there is no query parameters, it should return undefined', () => {
    // Act
    const queryParams = service['buildQueryParams']({});

    // Assert
    expect(queryParams == undefined).withContext('Query parameters are undefined').toBeTrue();
  });

  it('When request parameters and callbacks are given to the build options method, it should return the correct options', () => {
    // Arrange
    service.addHeadersToUrl(BASE_URL, {
      key1: 'value1'
    });
    service.addHeadersToUrl('test', {
      key2: 'value2',
    });
    service.addGlobalHeaders({
      key3: 'value3'
    });

    // Act
    const options = service['buildOptions'](BASE_URL, {
      responseType: NetHttpResponseType.Blob,
      queryParams: {
        page: 1,
        size: 20
      },
      headers: {
        Authentication: 'Bearer ABCD'
      },
      withCredentials: true,
      options: {
        context: new HttpContext()
      }
    }, {
      downloadProgress: (loaded: number, total?: number) => { }
    });

    // Assert
    expect((<any>options)['responseType']).toBe('blob');
    expect((<any>options)['reportProgress']).withContext('Report progress is activated').toBeTrue();
    expect((<any>options)['params'].get('page')).toBe('1');
    expect((<any>options)['params'].get('size')).toBe('20');
    expect((<any>options)['headers'].get('key1')).toBe('value1');
    expect((<any>options)['headers'].get('key3')).toBe('value3');
    expect((<any>options)['headers'].get('Authentication')).toBe('Bearer ABCD');
    expect((<any>options)['withCredentials']).withContext('Credentials will be sent').toBeTrue();
    expect((<any>options)['context'] != undefined).withContext('Context is not undefined').toBeTrue();
  });
});

/**
 * 
 * 
 * 
 */

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
      baseUrl: 'test',
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
