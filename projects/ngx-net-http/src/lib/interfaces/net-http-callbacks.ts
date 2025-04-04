import { NetHttpHeaderResponse, NetHttpResponse } from "./net-http-response";

/**
 * Represents the callbacks when HTTP events occur.
 */
export interface NetHttpCallbacks<T> {
    /**
     * Called when the HTTP request is sent (leaves Frontend). This does not guarantee that the request arrives at the target URL.
     */
    onRequestSent?: () => void,
    /**
     * Called when the HTTP header is received. This is called before the HTTP body arrives.
     * @param headerResponse 
     */
    onReceivedResponseHeader?: (headerResponse: NetHttpHeaderResponse) => void,
    /**
     * Called when the HTTP response is received (the request is completed). This callback is invoked at the same time as ```onReceivedBody```. The only difference is that this callback receives the entire response.
     * @param response 
     */
    onReceivedResponse?: (response: NetHttpResponse<T>) => void,
    /**
     * Called when the HTTP body is received (the request is completed). This callback is invoked at the same time as ```onReceivedResponse```. The only difference is that this callback receives only the body of the response.
     * @param body 
     */
    onReceivedBody?: (body: T) => void,
    /**
     * Called when the `Subscription` is completed.
     */
    onRequestCompleted?: () => void,
    /**
     * Called every time a chunk is uploaded.
     * @param uploadedBytes Total number of uploaded bytes
     * @param totalBytes Total number of bytes to be uploaded
     */
    uploadProgress?: (uploadedBytes: number, totalBytes?: number) => void,
    /**
     * Called every time a chunk is downloaded.
     * @param downloadedBytes Total number of downloaded bytes
     * @param totalBytes Total number of bytes to be downloaded
     */
    downloadProgress?: (downloadedBytes: number, totalBytes?: number) => void,
    /**
     * Called when error occurs during the HTTP request.
     * @param error Error object containing information about the failure.
     */
    onError?: (error: any) => void
}
