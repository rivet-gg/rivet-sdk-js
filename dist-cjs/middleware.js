"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodejs = exports.browser = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var browser;
(function (browser) {
    function requestHandlerMiddleware(token = undefined, init = { credentials: 'omit' }) {
        if (typeof window === 'undefined') {
            throw new Error('Using browser handler middleware in a non-browser environment');
        }
        return {
            handle: async (req, opts) => {
                let auth;
                if (typeof token == 'string') {
                    auth = token;
                }
                else if (typeof token == 'function') {
                    let res = token();
                    if (res instanceof Promise)
                        auth = await res;
                    else
                        auth = res;
                }
                req.headers = Object.fromEntries(Object.entries(req.headers).filter(([key]) => !key.startsWith('amz-') && !key.startsWith('x-amz-')));
                if (token)
                    req.headers.Authorization = `Bearer ${auth}`;
                if (!req.body) {
                    if (req.method == 'GET' || req.method == 'HEAD')
                        req.body = undefined;
                    else if (req.method == 'POST')
                        req.body = '{}';
                }
                let queryParameters = req.query ? Object.entries(req.query) : [];
                let query = queryParameters
                    .map(([k, v]) => `${k}=${encodeURIComponent(v instanceof Array ? v.join(',') : v)}`)
                    .join('&');
                let uri = `${req.protocol}//${req.hostname}${req.port ? `:${req.port}` : ''}${req.path}${query ? `?${query}` : ''}`;
                let res = await window.fetch(uri, Object.assign(req, init, {
                    signal: opts.abortSignal
                }));
                return {
                    response: {
                        statusCode: res.status,
                        body: await res.clone().blob(),
                        headers: Array.from(res.headers.entries()).reduce((s, [k, v]) => {
                            s[k] = v;
                            return s;
                        }, {})
                    }
                };
            }
        };
    }
    browser.requestHandlerMiddleware = requestHandlerMiddleware;
    function authenticationRefreshMiddleware(requestHandlerMiddleware, fetchToken) {
        let handle = isHttpHandlerHandle(requestHandlerMiddleware)
            ? requestHandlerMiddleware.handle
            : requestHandlerMiddleware;
        return {
            handle: async (req, handlerOpts) => {
                let res;
                try {
                    res = await handle(req, handlerOpts);
                    if (res.response.statusCode != 200) {
                        let body = JSON.parse(await res.response.body.text());
                        if (body.hasOwnProperty('code') && body.code == 'CLAIMS_ENTITLEMENT_EXPIRED') {
                            console.debug('Auth expired, refreshing token');
                            await fetchToken(true);
                            res = await handle(req, handlerOpts);
                        }
                    }
                }
                catch (err) {
                    console.debug('Error in authentication refresh middleware', err);
                }
                return res;
            }
        };
    }
    browser.authenticationRefreshMiddleware = authenticationRefreshMiddleware;
    function isHttpHandlerHandle(item) {
        return item.hasOwnProperty('handle');
    }
})(browser = exports.browser || (exports.browser = {}));
var nodejs;
(function (nodejs) {
    function requestHandlerMiddleware(token = undefined, init = { credentials: 'omit' }) {
        if (typeof window !== 'undefined') {
            console.warn('Using NodeJs handler middleware in a browser environment');
        }
        return {
            handle: async (req, opts) => {
                let auth = process.env.RIVET_LOBBY_TOKEN;
                if (typeof token == 'string') {
                    auth = token;
                }
                else if (typeof token == 'function') {
                    let res = token();
                    if (res instanceof Promise)
                        auth = await res;
                    else
                        auth = res;
                }
                req.headers = Object.fromEntries(Object.entries(req.headers).filter(([key]) => !key.startsWith('amz-') && !key.startsWith('x-amz-')));
                if (auth)
                    req.headers.Authorization = `Bearer ${auth}`;
                if (!req.body) {
                    if (req.method == 'GET' || req.method == 'HEAD')
                        req.body = undefined;
                    else if (req.method == 'POST')
                        req.body = '{}';
                }
                let queryParameters = req.query ? Object.entries(req.query) : [];
                let query = queryParameters
                    .map(([k, v]) => `${k}=${encodeURIComponent(v instanceof Array ? v.join(',') : v)}`)
                    .join('&');
                let uri = `${req.protocol}//${req.hostname}${req.port ? `:${req.port}` : ''}${req.path}${query ? `?${query}` : ''}`;
                let res = await (0, node_fetch_1.default)(uri, Object.assign(req, init, {
                    signal: opts.abortSignal
                }));
                return {
                    response: {
                        statusCode: res.status,
                        body: await res.clone().blob(),
                        headers: Array.from(res.headers.entries()).reduce((s, [k, v]) => {
                            s[k] = v;
                            return s;
                        }, {})
                    }
                };
            }
        };
    }
    nodejs.requestHandlerMiddleware = requestHandlerMiddleware;
    nodejs.authenticationRefreshMiddleware = browser.authenticationRefreshMiddleware;
})(nodejs = exports.nodejs || (exports.nodejs = {}));
