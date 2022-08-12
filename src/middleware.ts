// TODO: Docs

import { HttpRequest, HttpHandler } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions, HeaderBag } from '@aws-sdk/types';
import { AbortSignal as __AbortSignal } from '@aws-sdk/types';
import { default as nodeFetch } from 'node-fetch';

export namespace browser {
	export function requestHandlerMiddleware(
		token: string | (() => string) | (() => Promise<string>) = undefined,
		init: RequestInit = { credentials: 'omit' }
	): HttpHandler {
		if (typeof window === 'undefined') {
			throw new Error('Using browser handler middleware in a non-browser environment');
		}

		return {
			handle: async (req: HttpRequest, opts?: HttpHandlerOptions) => {
				let auth: string;

				// Parse bearer token
				if (typeof token == 'string') {
					auth = token;
				} else if (typeof token == 'function') {
					let res = token();

					if (res instanceof Promise) auth = await res;
					else auth = res;
				}

				// Clear AWS headers
				req.headers = Object.fromEntries(
					Object.entries(req.headers).filter(
						([key]) => !key.startsWith('amz-') && !key.startsWith('x-amz-')
					)
				);

				if (token) req.headers.Authorization = `Bearer ${auth}`;

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

	export function authenticationRefreshMiddleware(
		requestHandlerMiddleware: HttpHandler | HttpHandler['handle'],
		fetchToken: (forceRefresh: boolean) => Promise<string>
	) {
		let handle: HttpHandler['handle'] = isHttpHandlerHandle(requestHandlerMiddleware)
			? requestHandlerMiddleware.handle
			: requestHandlerMiddleware;

		return {
			handle: async (req: HttpRequest, handlerOpts?: HttpHandlerOptions) => {
				let res: Awaited<ReturnType<HttpHandler['handle']>>;

				try {
					res = await handle(req, handlerOpts);

					if (res.response.statusCode != 200) {
						let body = JSON.parse(await res.response.body.text());

						if (body.hasOwnProperty('code') && body.code == 'CLAIMS_ENTITLEMENT_EXPIRED') {
							console.debug('Auth expired, refreshing token');

							// Force refreshes authentication
							await fetchToken(true);

							// Retry request after refreshing auth
							res = await handle(req, handlerOpts);
						}
					}
				} catch (err) {
					console.debug('Error in authentication refresh middleware', err);
				}

				return res;
			}
		};
	}

	function isHttpHandlerHandle(item: HttpHandler | HttpHandler['handle']): item is HttpHandler {
		return item.hasOwnProperty('handle');
	}
}

export namespace nodejs {
	export function requestHandlerMiddleware(
		token: string | (() => string) | (() => Promise<string>) = undefined,
		init: RequestInit = { credentials: 'omit' }
	) {
		if (typeof window !== 'undefined') {
			console.warn('Using NodeJs handler middleware in a browser environment');
		}

		return {
			handle: async (req: HttpRequest, opts?: HttpHandlerOptions) => {
				// Default token taken from env
				let auth: string = process.env.RIVET_LOBBY_TOKEN;

				// Parse bearer token
				if (typeof token == 'string') {
					auth = token;
				} else if (typeof token == 'function') {
					let res = token();

					if (res instanceof Promise) auth = await res;
					else auth = res;
				}

				// Clear AWS headers
				req.headers = Object.fromEntries(
					Object.entries(req.headers).filter(
						([key]) => !key.startsWith('amz-') && !key.startsWith('x-amz-')
					)
				);

				if (auth) req.headers.Authorization = `Bearer ${auth}`;

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

	// Reexport
	export const authenticationRefreshMiddleware = browser.authenticationRefreshMiddleware;
}
