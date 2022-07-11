"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Browser = exports.NodeJs = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var NodeJs;
(function (NodeJs) {
    function requestHandlerMiddleware(token = undefined, init = { credentials: 'omit' }) {
        if (typeof window !== 'undefined') {
            console.warn('Using NodeJs handler middleware in a browser environment');
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
    NodeJs.requestHandlerMiddleware = requestHandlerMiddleware;
})(NodeJs = exports.NodeJs || (exports.NodeJs = {}));
var Browser;
(function (Browser) {
    function requestHandlerMiddleware(token = undefined, init = { credentials: 'omit' }) {
        if (typeof window === 'undefined') {
            throw new Error('Using Browser handler middleware in a non-browser environment');
        }
        return {
            handle: async (req, opts) => {
                req.headers = {};
                if (token)
                    req.headers.Authorization = `Bearer ${token}`;
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
    Browser.requestHandlerMiddleware = requestHandlerMiddleware;
})(Browser = exports.Browser || (exports.Browser = {}));
