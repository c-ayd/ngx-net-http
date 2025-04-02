import { TestBed } from "@angular/core/testing";
import { NetHttpService } from "../net-http.service";
import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideNetHttp } from "../net-http-service-di";
import { Observable } from "rxjs";

describe('NetHttpService DI', () => {
  const BASE_URL = 'https://www.example.com';
  let service: NetHttpService;

  beforeEach(() => {
    function interceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
      console.log('Interceptor is called');
      return next(req);
    };

    TestBed.configureTestingModule({
      providers: [
        provideNetHttp(BASE_URL,
          withInterceptors([interceptorFn])),
        provideHttpClientTesting()
      ]
    });

    service = new NetHttpService(TestBed.inject(HttpClient), BASE_URL);
  });

  it('When a base URL and an interceptor is added in DI, it should invoke the interceptor', () => {
    // Arrange
    spyOn(console, 'log');
    
    // Act
    service.get(undefined, undefined);

    const request = TestBed.inject(HttpTestingController).expectOne(BASE_URL);
    expect(request.request.method).toBe('GET');
    request.flush(null);

    // Assert
    expect(console.log).toHaveBeenCalledWith('Interceptor is called');
  });

  it('When only an interceptor is added in DI, it should invoke the interceptor', () => {
    // Arrange
    spyOn(console, 'log');

    // Act
    service.get({
      baseUrl: 'test'
    }, undefined);

    const request = TestBed.inject(HttpTestingController).expectOne('test');
    expect(request.request.method).toBe('GET');
    request.flush(null);

    // Assert
    expect(console.log).toHaveBeenCalledWith('Interceptor is called');
  });
});
