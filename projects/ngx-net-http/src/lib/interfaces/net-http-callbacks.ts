import { NetHttpHeaderResponse, NetHttpResponse } from "./net-http-response";

export interface NetHttpCallbacks<T> {
    onRequestSent?: () => void,
    onReceivedResponseHeader?: (headerResponse: NetHttpHeaderResponse) => void,
    onReceivedResponse?: (response: NetHttpResponse<T>) => void,
    onReceivedBody?: (body: T) => void,
    onRequestCompleted?: () => void,
    uploadProgress?: (loaded: number, total?: number) => void,
    downloadProgress?: (loaded: number, total?: number) => void,
    onError?: (error: any) => void
}
