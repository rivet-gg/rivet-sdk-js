import { __awaiter, __generator } from "tslib";
var RepeatingRequest = (function () {
    function RepeatingRequest(cb, opts) {
        this.active = true;
        this.watchIndex = null;
        this.abortController = new AbortController();
        this.messageHandlers = [];
        this.errorHandlers = [];
        this.cb = cb;
        this.opts = Object.assign({
            cancelOnError: true,
            noWatchIndex: false,
            watchIndex: undefined
        }, opts);
        if (this.opts.watchIndex !== undefined && this.opts.watchIndex !== null)
            this.parseWatchResponse(this.opts.watchIndex);
        this.repeat();
    }
    RepeatingRequest.prototype.repeat = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.active) return [3, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, this.cb(this.abortController.signal, (_a = this.watchIndex) !== null && _a !== void 0 ? _a : undefined)];
                    case 2:
                        res = _b.sent();
                        this.handleMessage(res);
                        this.parseWatchResponse(res.watch);
                        return [3, 4];
                    case 3:
                        e_1 = _b.sent();
                        if (e_1 instanceof DOMException && e_1.name == 'AbortError')
                            return [2];
                        if (this.opts.cancelOnError)
                            this.cancel();
                        this.handleErrors(e_1);
                        return [3, 4];
                    case 4: return [3, 0];
                    case 5: return [2];
                }
            });
        });
    };
    RepeatingRequest.prototype.onMessage = function (cb) {
        this.messageHandlers.push(cb);
    };
    RepeatingRequest.prototype.onError = function (cb) {
        this.errorHandlers.push(cb);
    };
    RepeatingRequest.prototype.cancel = function () {
        this.abortController.abort();
        this.active = false;
    };
    RepeatingRequest.prototype.start = function () {
        if (!this.active) {
            this.abortController = new AbortController();
            this.active = true;
            this.repeat();
        }
    };
    RepeatingRequest.prototype.removeMessageHandler = function (cb) {
        var index = this.messageHandlers.indexOf(cb);
        if (index != -1)
            this.messageHandlers.splice(index, 1);
    };
    RepeatingRequest.prototype.handleMessage = function (message) {
        this.messageHandlers.forEach(function (cb) { return cb(message); });
    };
    RepeatingRequest.prototype.handleErrors = function (e) {
        this.errorHandlers.forEach(function (cb) { return cb(e); });
        if (this.errorHandlers.length == 0)
            console.error('Unhandled repeating request error', e);
    };
    RepeatingRequest.prototype.parseWatchResponse = function (watchResponse) {
        if (!this.opts.noWatchIndex) {
            if (!watchResponse.index)
                console.error('Blocking request has no watch response');
            else
                this.watchIndex = watchResponse.index;
        }
    };
    return RepeatingRequest;
}());
export { RepeatingRequest };
