import { HttpRequest } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions, HeaderBag } from '@aws-sdk/types';
import { AbortSignal as __AbortSignal } from '@aws-sdk/types';
import { AbortController as __AbortController } from '@aws-sdk/abort-controller';
import { default as nodeFetch } from 'node-fetch';

export namespace NodeJs {
	export function requestHandlerMiddleware(
		token: String = undefined,
		init: RequestInit = { credentials: 'omit' }
	) {
		return {
			handle: async (req: HttpRequest, opts?: HttpHandlerOptions) => {
				req.headers = {};

				if (token) req.headers.Authorization = `Bearer ${token}`;

				// Default body
				if (!req.body) {
					if (req.method == 'GET' || req.method == 'HEAD') req.body = undefined;
					else if (req.method == 'POST') req.body = '{}';
				}

				let queryParameters = req.query ? Object.entries(req.query) : [];
				let query = queryParameters
					.map(([k, v]) => `${k}=${encodeURIComponent(v instanceof Array ? v.join(',') : v)}`)
					.join('&');
				let uri = `${req.protocol}//${req.hostname}${req.port ? `:${req.port}` : ''}${req.path}${
					query ? `?${query}` : ''
				}`;

				let res = await nodeFetch(
					uri,
					Object.assign(req, init, {
						// MARK: see abort controller mark in repeating-request.ts
						signal: opts.abortSignal as any
					})
				);

				return {
					response: {
						statusCode: res.status,
						body: await res.clone().blob(),
						headers: Array.from(res.headers.entries()).reduce((s, [k, v]) => {
							s[k] = v;
							return s;
						}, {} as HeaderBag)
					}
				};
			}
		};
	}
}

export namespace Browser {
	export function requestHandlerMiddleware(
		token: String = undefined,
		init: RequestInit = { credentials: 'omit' }
	) {
		return {
			handle: async (req: HttpRequest, opts?: HttpHandlerOptions) => {
				req.headers = {};

				if (token) req.headers.Authorization = `Bearer ${token}`;

				// Default body
				if (!req.body) {
					if (req.method == 'GET' || req.method == 'HEAD') req.body = undefined;
					else if (req.method == 'POST') req.body = '{}';
				}

				let queryParameters = req.query ? Object.entries(req.query) : [];
				let query = queryParameters
					.map(([k, v]) => `${k}=${encodeURIComponent(v instanceof Array ? v.join(',') : v)}`)
					.join('&');
				let uri = `${req.protocol}//${req.hostname}${req.port ? `:${req.port}` : ''}${req.path}${
					query ? `?${query}` : ''
				}`;

				let res = await window.fetch(
					uri,
					Object.assign(req, init, {
						// MARK: see abort controller mark in repeating-request.ts
						signal: opts.abortSignal as any
					})
				);

				return {
					response: {
						statusCode: res.status,
						body: await res.clone().blob(),
						headers: Array.from(res.headers.entries()).reduce((s, [k, v]) => {
							s[k] = v;
							return s;
						}, {} as HeaderBag)
					}
				};
			}
		};
	}
}
