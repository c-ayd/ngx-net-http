import { provideHttpClient } from "@angular/common/http";

export function provideNetHttp(baseUrl?: string) {
    if (baseUrl)
        return [
            provideHttpClient(),
            { provide: 'NET_HTTP_BASE_URL', useValue: baseUrl }
        ];
    
    return [
        provideHttpClient()
    ];
}
