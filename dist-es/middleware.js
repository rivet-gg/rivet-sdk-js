import { __awaiter, __generator, __read } from "tslib";
import { default as nodeFetch } from 'node-fetch';
export var nodejs;
(function (nodejs) {
    function requestHandlerMiddleware(token, init) {
        var _this = this;
        if (token === void 0) { token = undefined; }
        if (init === void 0) { init = { credentials: 'omit' }; }
        if (typeof window !== 'undefined') {
            console.warn('Using NodeJs handler middleware in a browser environment');
        }
        return {
            handle: function (req, opts) { return __awaiter(_this, void 0, void 0, function () {
                var auth, res_1, queryParameters, query, uri, res;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            auth = process.env.RIVET_LOBBY_TOKEN;
                            if (!(typeof token == 'string')) return [3, 1];
                            auth = token;
                            return [3, 4];
                        case 1:
                            if (!(typeof token == 'function')) return [3, 4];
                            res_1 = token();
                            if (!(res_1 instanceof Promise)) return [3, 3];
                            return [4, res_1];
                        case 2:
                            auth = _c.sent();
                            return [3, 4];
                        case 3:
                            auth = res_1;
                            _c.label = 4;
                        case 4:
                            if (auth)
                                req.headers.Authorization = "Bearer ".concat(auth);
                            if (!req.body) {
                                if (req.method == 'GET' || req.method == 'HEAD')
                                    req.body = undefined;
                                else if (req.method == 'POST')
                                    req.body = '{}';
                            }
                            queryParameters = req.query ? Object.entries(req.query) : [];
                            query = queryParameters
                                .map(function (_a) {
                                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                return "".concat(k, "=").concat(encodeURIComponent(v instanceof Array ? v.join(',') : v));
                            })
                                .join('&');
                            uri = "".concat(req.protocol, "//").concat(req.hostname).concat(req.port ? ":".concat(req.port) : '').concat(req.path).concat(query ? "?".concat(query) : '');
                            return [4, nodeFetch(uri, Object.assign(req, init, {
                                    signal: opts.abortSignal
                                }))];
                        case 5:
                            res = _c.sent();
                            _a = {};
                            _b = {
                                statusCode: res.status
                            };
                            return [4, res.clone().blob()];
                        case 6: return [2, (_a.response = (_b.body = _c.sent(),
                                _b.headers = Array.from(res.headers.entries()).reduce(function (s, _a) {
                                    var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                    s[k] = v;
                                    return s;
                                }, {}),
                                _b),
                                _a)];
                    }
                });
            }); }
        };
    }
    nodejs.requestHandlerMiddleware = requestHandlerMiddleware;
})(nodejs || (nodejs = {}));
export var browser;
(function (browser) {
    function requestHandlerMiddleware(token, init) {
        var _this = this;
        if (token === void 0) { token = undefined; }
        if (init === void 0) { init = { credentials: 'omit' }; }
        if (typeof window === 'undefined') {
            throw new Error('Using browser handler middleware in a non-browser environment');
        }
        return {
            handle: function (req, opts) { return __awaiter(_this, void 0, void 0, function () {
                var auth, res_2, queryParameters, query, uri, res;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(typeof token == 'string')) return [3, 1];
                            auth = token;
                            return [3, 4];
                        case 1:
                            if (!(typeof token == 'function')) return [3, 4];
                            res_2 = token();
                            if (!(res_2 instanceof Promise)) return [3, 3];
                            return [4, res_2];
                        case 2:
                            auth = _c.sent();
                            return [3, 4];
                        case 3:
                            auth = res_2;
                            _c.label = 4;
                        case 4:
                            console.log(req.headers);
                            if (token)
                                req.headers.Authorization = "Bearer ".concat(auth);
                            if (!req.body) {
                                if (req.method == 'GET' || req.method == 'HEAD')
                                    req.body = undefined;
                                else if (req.method == 'POST')
                                    req.body = '{}';
                            }
                            queryParameters = req.query ? Object.entries(req.query) : [];
                            query = queryParameters
                                .map(function (_a) {
                                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                return "".concat(k, "=").concat(encodeURIComponent(v instanceof Array ? v.join(',') : v));
                            })
                                .join('&');
                            uri = "".concat(req.protocol, "//").concat(req.hostname).concat(req.port ? ":".concat(req.port) : '').concat(req.path).concat(query ? "?".concat(query) : '');
                            return [4, window.fetch(uri, Object.assign(req, init, {
                                    signal: opts.abortSignal
                                }))];
                        case 5:
                            res = _c.sent();
                            _a = {};
                            _b = {
                                statusCode: res.status
                            };
                            return [4, res.clone().blob()];
                        case 6: return [2, (_a.response = (_b.body = _c.sent(),
                                _b.headers = Array.from(res.headers.entries()).reduce(function (s, _a) {
                                    var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                    s[k] = v;
                                    return s;
                                }, {}),
                                _b),
                                _a)];
                    }
                });
            }); }
        };
    }
    browser.requestHandlerMiddleware = requestHandlerMiddleware;
})(browser || (browser = {}));