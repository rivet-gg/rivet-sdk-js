/// <reference types="node" />
import { HttpRequest } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions, HeaderBag } from '@aws-sdk/types';
export declare function requestHandlerMiddleware(token?: string | (() => string) | (() => Promise<string>), init?: RequestInit): {
    handle: (req: HttpRequest, opts?: HttpHandlerOptions) => Promise<{
        response: {
            statusCode: number;
            body: NodeJS.ReadableStream;
            headers: HeaderBag;
        };
    }>;
};
