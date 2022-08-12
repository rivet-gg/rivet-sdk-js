import { HttpRequest, HttpHandler } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions, HeaderBag } from '@aws-sdk/types';
export declare namespace browser {
    function requestHandlerMiddleware(token?: string | (() => string) | (() => Promise<string>), init?: RequestInit): HttpHandler;
    function authenticationRefreshMiddleware(requestHandlerMiddleware: HttpHandler | HttpHandler['handle'], fetchToken: (forceRefresh: boolean) => Promise<string>): {
        handle: (req: HttpRequest, handlerOpts?: HttpHandlerOptions) => Promise<import("@aws-sdk/types").RequestHandlerOutput<import("@aws-sdk/protocol-http").HttpResponse>>;
    };
}
export declare namespace nodejs {
    function requestHandlerMiddleware(token?: string | (() => string) | (() => Promise<string>), init?: RequestInit): {
        handle: (req: HttpRequest, opts?: HttpHandlerOptions) => Promise<{
            response: {
                statusCode: number;
                body: Blob;
                headers: HeaderBag;
            };
        }>;
    };
    const authenticationRefreshMiddleware: typeof browser.authenticationRefreshMiddleware;
}
