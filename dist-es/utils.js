import { __awaiter, __generator, __read } from "tslib";
import { default as nodeFetch } from 'node-fetch';
export var NodeJs;
(function (NodeJs) {
    function requestHandlerMiddleware(token, init) {
        var _this = this;
        if (token === void 0) { token = undefined; }
        if (init === void 0) { init = { credentials: 'omit' }; }
        return {
            handle: function (req, opts) { return __awaiter(_this, void 0, void 0, function () {
                var queryParameters, query, uri, res;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            req.headers = {};
                            if (token)
                                req.headers.Authorization = "Bearer ".concat(token);
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
                        case 1:
                            res = _c.sent();
                            _a = {};
                            _b = {
                                statusCode: res.status
                            };
                            return [4, res.clone().blob()];
                        case 2: return [2, (_a.response = (_b.body = _c.sent(),
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
    NodeJs.requestHandlerMiddleware = requestHandlerMiddleware;
})(NodeJs || (NodeJs = {}));
export var Browser;
(function (Browser) {
    function requestHandlerMiddleware(token, init) {
        var _this = this;
        if (token === void 0) { token = undefined; }
        if (init === void 0) { init = { credentials: 'omit' }; }
        return {
            handle: function (req, opts) { return __awaiter(_this, void 0, void 0, function () {
                var queryParameters, query, uri, res;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            req.headers = {};
                            if (token)
                                req.headers.Authorization = "Bearer ".concat(token);
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
                        case 1:
                            res = _c.sent();
                            _a = {};
                            _b = {
                                statusCode: res.status
                            };
                            return [4, res.clone().blob()];
                        case 2: return [2, (_a.response = (_b.body = _c.sent(),
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
    Browser.requestHandlerMiddleware = requestHandlerMiddleware;
})(Browser || (Browser = {}));
