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

  it('When some headers are defined for a specific URL, it should save them', () => {
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
    const headers = service['headerSettings'].get(BASE_URL);

    // Assert
    expect(headers != undefined).withContext('Header is not undefined').toBeTrue();
    expect(headers!.hasOwnProperty('key1')).withContext('Header has key1').toBeTrue();
    expect(headers!.hasOwnProperty('key2')).withContext('Header has key2').toBeTrue();
    expect(!headers!.hasOwnProperty('key3')).withContext('Header does not have key3').toBeTrue();
    expect(!headers!.hasOwnProperty('key4')).withContext('Header does not have key4').toBeTrue();
    expect(!headers!.hasOwnProperty('key5')).withContext('Header does not have key5').toBeTrue();
  });

  it('When some headers are defined for a specific URL and then some of them are removed, it should not have the deleted ones', () => {
    // Arrange
    service.addHeadersToUrl(BASE_URL, {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    });

    // Act
    service.removeHeadersFromUrl(BASE_URL, ['key1', 'key2']);
    const headers = service['headerSettings'].get(BASE_URL);

    // Assert
    expect(headers != undefined).withContext('Header is not undefined').toBeTrue();
    expect(!headers!.hasOwnProperty('key1')).withContext('Header does not have key 1').toBeTrue();
    expect(!headers!.hasOwnProperty('key2')).withContext('Header does not have key 2').toBeTrue();
    expect(headers!.hasOwnProperty('key3')).withContext('Header has key 3').toBeTrue();
  });

  it('When some headers are defined for a specific URL and then all headers for the URL is cleared, it should not have them', () => {
    // Arrange
    service.addHeadersToUrl(BASE_URL, {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    });

    // Act
    service.clearHeadersFromUrl(BASE_URL);

    // Assert
    expect(!service['headerSettings'].has(BASE_URL)).withContext('Global header setting is undefined').toBeTrue();
  });

  it('When some headers are provided globally, it should save them', () => {
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
    const headers = service['headerSettings'].get('*');

    // Assert
    expect(headers != undefined).withContext('Header is not undefined').toBeTrue();
    expect(!headers!.hasOwnProperty('key1')).withContext('Header does not have key1').toBeTrue();
    expect(!headers!.hasOwnProperty('key2')).withContext('Header does not have key2').toBeTrue();
    expect(!headers!.hasOwnProperty('key3')).withContext('Header does not have key3').toBeTrue();
    expect(headers!.hasOwnProperty('key4')).withContext('Header has key4').toBeTrue();
    expect(headers!.hasOwnProperty('key5')).withContext('Header has key5').toBeTrue();
  });

  it('When some headers are defined globally and then some of them are removed, it should not have the deleted ones', () => {
    // Arrange
    service.addGlobalHeaders({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    });

    // Act
    service.removeGlobalHeaders(['key1', 'key2']);
    const headers = service['headerSettings'].get('*');

    // Assert
    expect(headers != undefined).withContext('Header is not undefined').toBeTrue();
    expect(!headers!.hasOwnProperty('key1')).withContext('Header does not have key 1').toBeTrue();
    expect(!headers!.hasOwnProperty('key2')).withContext('Header does not have key 2').toBeTrue();
    expect(headers!.hasOwnProperty('key3')).withContext('Header has key 3').toBeTrue();
  });

  it('When some headers are defined globally and then all global headers are removed, it should not have them', () => {
    // Arrange
    service.addGlobalHeaders({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    });

    // Act
    service.clearGlobalHeaders();

    // Assert
    expect(!service['headerSettings'].has('*')).withContext('Global header setting is undefined').toBeTrue();
  });

  it('When there are some headers and all headers are cleared, it should not have any', () => {
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
    service.clearAllHeaders();

    // Assert
    expect(service['headerSettings'].size).toBe(0);
  });
});
