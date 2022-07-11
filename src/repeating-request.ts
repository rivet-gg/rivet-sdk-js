import { AbortSignal as __AbortSignal } from '@aws-sdk/types';
import { AbortController as __AbortController } from '@aws-sdk/abort-controller';

export type ErrorHandler = (e: Error | Response) => void;

interface WatchResponse {
	index: string | undefined;
}

export interface RepeatingRequestOptions {
	cancelOnError?: boolean;
	noWatchIndex?: boolean; // Blocks without watch handling
	watchIndex?: WatchResponse; // Initial watch index, usually set by cache
}

export class RepeatingRequest<T> {
	private cb: (abortSignal: __AbortSignal, watchIndex: string) => Promise<T>;
	private active: boolean = true;
	private watchIndex: string = null;
	private opts: RepeatingRequestOptions;
	private abortController: AbortController = new AbortController();

	private messageHandlers: ((message: T) => void)[] = [];
	private errorHandlers: ErrorHandler[] = [];

	constructor(
		cb: (abortSignal: __AbortSignal, watchIndex: string) => Promise<T>,
		opts?: RepeatingRequestOptions
	) {
		this.cb = cb;

		this.opts = Object.assign(
			{
				cancelOnError: true,
				noWatchIndex: false,
				watchIndex: undefined
			},
			opts
		);

		// Set anchor before starting request loop
		if (this.opts.watchIndex !== undefined && this.opts.watchIndex !== null)
			this.parseWatchResponse(this.opts.watchIndex);

		this.repeat();
	}

	// Repeat request forever until cancelled
	private async repeat() {
		while (this.active) {
			// Handle any request errors
			try {
				// MARK: The abort controller signal is cast to `any` because
				// the AWS abort signal is never used by AWS source code internally,
				// it is simply passed along until it reaches `requestHandlerMiddleware` (see utils.ts)
				let res = await this.cb(this.abortController.signal as any, this.watchIndex ?? undefined);

				this.handleMessage(res);
				this.parseWatchResponse((res as any).watch);
			} catch (e) {
				// In this system, an abort isn't erroneous behavior
				if (e instanceof DOMException && e.name == 'AbortError') return;

				// Cancels on error by default
				if (this.opts.cancelOnError) this.cancel();

				this.handleErrors(e);
			}
		}
	}

	onMessage(cb: (message: T) => void) {
		this.messageHandlers.push(cb);
	}

	onError(cb: ErrorHandler) {
		this.errorHandlers.push(cb);
	}

	cancel() {
		this.abortController.abort();
		this.active = false;
	}

	start() {
		if (!this.active) {
			this.abortController = new AbortController();
			this.active = true;
			this.repeat();
		}
	}

	removeMessageHandler(cb: (message: T) => void) {
		let index = this.messageHandlers.indexOf(cb);
		if (index != -1) this.messageHandlers.splice(index, 1);
	}

	private handleMessage(message: T) {
		this.messageHandlers.forEach(cb => cb(message));
	}

	private handleErrors(e: Error) {
		this.errorHandlers.forEach(cb => cb(e));

		if (this.errorHandlers.length == 0) console.error('Unhandled repeating request error', e);
	}

	private parseWatchResponse(watchResponse: WatchResponse) {
		if (!this.opts.noWatchIndex) {
			if (!watchResponse.index) console.error('Blocking request has no watch response');
			else this.watchIndex = watchResponse.index;
		}
	}
}
