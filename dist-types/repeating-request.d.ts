import { AbortSignal as __AbortSignal } from '@aws-sdk/types';
export declare type ErrorHandler = (e: Error | Response) => void;
interface WatchResponse {
    index: string | undefined;
}
export interface RepeatingRequestOptions {
    cancelOnError?: boolean;
    noWatchIndex?: boolean;
    watchIndex?: WatchResponse;
}
export declare class RepeatingRequest<T> {
    private cb;
    private active;
    private watchIndex;
    private opts;
    private abortController;
    private messageHandlers;
    private errorHandlers;
    constructor(cb: (abortSignal: __AbortSignal, watchIndex: string) => Promise<T>, opts?: RepeatingRequestOptions);
    private repeat;
    onMessage(cb: (message: T) => void): void;
    onError(cb: ErrorHandler): void;
    cancel(): void;
    start(): void;
    removeMessageHandler(cb: (message: T) => void): void;
    private handleMessage;
    private handleErrors;
    private parseWatchResponse;
}
export {};
