import { HttpFeature, HttpFeatureKind, provideHttpClient } from "@angular/common/http";

export function provideNetHttp(baseUrl?: string, ...features: HttpFeature<HttpFeatureKind>[]) {
    if (baseUrl)
        return [
            provideHttpClient(...features),
            { provide: 'NET_HTTP_BASE_URL', useValue: baseUrl }
        ];
    
    return [
        provideHttpClient(...features)
    ];
}
