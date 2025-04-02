import { HttpFeature, HttpFeatureKind, provideHttpClient } from "@angular/common/http";

/**
 * Provides all dependencies for NetHttp.
 * @param baseUrl Base URL for all request made by NetHttp.
 * @param features HTTP features to be added to HttpClient.
 */
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
