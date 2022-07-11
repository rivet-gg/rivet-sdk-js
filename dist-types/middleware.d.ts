import { HttpRequest } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions, HeaderBag } from '@aws-sdk/types';
export declare namespace NodeJs {
    function requestHandlerMiddleware(token?: string | (() => string) | (() => Promise<string>), init?: RequestInit): {
        handle: (req: HttpRequest, opts?: HttpHandlerOptions) => Promise<{
            response: {
                statusCode: number;
                body: import("node-fetch").Blob;
                headers: HeaderBag;
            };
        }>;
    };
}
export declare namespace Browser {
    function requestHandlerMiddleware(token?: String, init?: RequestInit): {
        handle: (req: HttpRequest, opts?: HttpHandlerOptions) => Promise<{
            response: {
                statusCode: number;
                body: Blob;
                headers: HeaderBag;
            };
        }>;
    };
}
