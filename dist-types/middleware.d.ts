import { HttpRequest } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions, HeaderBag } from '@aws-sdk/types';
export declare namespace browser {
    function requestHandlerMiddleware(token?: string | (() => string) | (() => Promise<string>), init?: RequestInit): {
        handle: (req: HttpRequest, opts?: HttpHandlerOptions) => Promise<{
            response: {
                statusCode: number;
                body: Blob;
                headers: HeaderBag;
            };
        }>;
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
}
