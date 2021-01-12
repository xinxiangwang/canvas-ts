var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { vec2 } from './vec2.js';
var Timer = /** @class */ (function () {
    function Timer(callback) {
        this.id = -1; // 计时器ID
        this.enabled = false; // 计时器是否有效
        this.callbackData = undefined; // 回调函数参数
        this.countdown = 0; // 倒计时器
        this.timeout = 0; // 任务执行时间间距 秒
        this.onlyOnce = false; // 是否只执行一次回调
        this.callback = callback;
    }
    return Timer;
}());
// interface TextMetrics {
//   readonly width: number
// }
// interface ImageData {
//   readonly data: Uint8ClampedArray
//   readonly height: number
//   readonly width: number
// }
// interface CanvasRenderingContext2D extends CanvasPath {
//   font: string
//   textAlign: string
//   textBaseline: string
//   strokeStyle: string | CanvasGradient | CanvasPattern
//   strokeText(text: string, x: number, y: number, maxWidth?: number): void
//   fillText(text: string, x: number, y: number, maxWidth?: number): void
//   measureText(text: string): TextMetrics
//   fillStyle: string | CanvasGradient | CanvasPattern
//   createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient
//   createRadiaGradient(x0: number, y0: number, x1: number, y1: number, r0: number, r1: number): CanvasGradient
//   createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string): CanvasPattern
//   drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void
//   drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void
//   drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void
//   createImageData(imageDataOrSw: number | ImageData, sh?: number): ImageData
//   getImageData(sx: number, sy: number, sw: number, sh: number): ImageData
//   putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void
// }
var Application = /** @class */ (function () {
    function Application(canvas) {
        this._start = false; // 动画是否已经开始
        this._requestId = -1; // requestAnimationFrame的ID
        this._fps = 0;
        this.timers = [];
        this._timeId = -1;
        if (canvas !== null) {
            this.canvas = canvas;
            this.canvas.addEventListener('mousedown', this, false);
            this.canvas.addEventListener('mouseup', this, false);
            this.canvas.addEventListener('mousemove', this, false);
            window.addEventListener('keydown', this, false);
            window.addEventListener('keyup', this, false);
            window.addEventListener('keypress', this, false);
            this._isMouseDown = false;
            this.isSupportMouseMove = false;
        }
        else {
            alert('获取canvas实例失败');
            throw new Error('获取canvas实例失败');
        }
    }
    Object.defineProperty(Application.prototype, "fps", {
        get: function () {
            return this._fps;
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.removeTimer = function (id) {
        var timer = this.timers.find(function (item) { return item.id === id; });
        if (timer) {
            timer.enabled = false;
        }
        return !!timer;
    };
    Application.prototype.addTimer = function (callback, timeout, onlyOnce, data) {
        if (timeout === void 0) { timeout = 1.0; }
        if (onlyOnce === void 0) { onlyOnce = false; }
        if (data === void 0) { data = undefined; }
        var timer;
        // let found: boolean = false
        for (var i = 0; i < this.timers.length; i++) { // 如果存在enabled为false的任务，则更新这个任务
            var timer_1 = this.timers[i];
            if (timer_1.enabled === false) {
                timer_1.callback = callback;
                timer_1.callbackData = data;
                timer_1.timeout = timeout;
                timer_1.countdown = timeout;
                timer_1.enabled = true;
                timer_1.onlyOnce = onlyOnce;
                return timer_1.id;
            }
        }
        // 新建任务
        timer = new Timer(callback);
        timer.callbackData = data;
        timer.timeout = timeout;
        timer.countdown = timeout;
        timer.enabled = true;
        timer.id = ++this._timeId;
        timer.onlyOnce = onlyOnce; // 一次回调还是重复回调
        this.timers.push(timer);
        return timer.id;
    };
    Application.prototype._handleTimers = function (intervalSec) {
        for (var i = 0; i < this.timers.length; i++) {
            var timer = this.timers[i];
            if (timer.enabled === false) {
                continue;
            }
            // 任务运行时间5s一次的话 减去每次 requestAnimationFrame运行时间intervalSec， 到0.00就证明该运行了
            timer.countdown -= intervalSec;
            if (timer.countdown < 0.0) {
                // console.log(timer.countdown)
                timer.callback(timer.id, timer.callbackData);
                if (timer.onlyOnce === false) { // 如果不是只运行一次 那么就初始化运行任务还差的时间
                    timer.countdown = timer.timeout;
                }
                else {
                    this.removeTimer(timer.id); // 如果只运行一次 就直接 “删除”
                }
            }
        }
    };
    Application.prototype.handleEvent = function (evt) {
        switch (evt.type) {
            case 'mousedown':
                this._isMouseDown = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt));
                break;
            case 'mouseup':
                this._isMouseDown = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt));
                break;
            case 'mousemove':
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt));
                }
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt));
                }
                break;
            case 'keypress':
                this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt));
                break;
            case 'keydown':
                this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt));
                break;
            case 'keyup':
                this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt));
                break;
        }
    };
    Application.prototype.dispatchMouseDown = function (evt) { };
    Application.prototype.dispatchMouseUp = function (evt) { };
    Application.prototype.dispatchMouseMove = function (evt) { };
    Application.prototype.dispatchMouseDrag = function (evt) { };
    Application.prototype.dispatchKeyPress = function (evt) { };
    Application.prototype.dispatchKeyDown = function (evt) { };
    Application.prototype.dispatchKeyUp = function (evt) { };
    Application.prototype.start = function () {
        var _this = this;
        if (!this._start) {
            this._start = true;
            this._requestId = -1;
            this._lastTime = -1;
            this._startTime = -1;
            // this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
            //   this.step(elapsedMsec)
            // })
            requestAnimationFrame(function (elapsedMsec) {
                _this.step(elapsedMsec);
            });
        }
    };
    Application.prototype.stop = function () {
        if (this._start) {
            cancelAnimationFrame(this._requestId);
            this._start = false;
            this._requestId = -1;
            this._lastTime = -1;
            this._startTime = -1;
        }
    };
    Application.prototype.isRunning = function () {
        return this._start;
    };
    Application.prototype.step = function (timeStamp) {
        var _this = this;
        if (this._startTime === -1)
            this._startTime = timeStamp;
        if (this._lastTime === -1)
            this._lastTime = timeStamp;
        // 当前时间节点与第一次调用时间节点的差
        var elapsedMsec = timeStamp - this._startTime;
        // 当前时间节点与上一次时间节点的差
        var intervalSec = timeStamp - this._lastTime;
        if (intervalSec !== 0) {
            this._fps = 1000.0 / intervalSec;
        }
        intervalSec /= 1000.0; // 一秒60帧
        this._lastTime = timeStamp;
        this._handleTimers(intervalSec);
        this.update(elapsedMsec, intervalSec);
        this.render();
        this._requestId = requestAnimationFrame(function (elapsedMsec) {
            _this.step(elapsedMsec);
        });
    };
    Application.prototype.update = function (elapsedMsec, intervalSec) { };
    Application.prototype.render = function () { };
    Application.prototype._viewportToCanvanCoordinate = function (evt) {
        if (this.canvas) {
            var rect = this.canvas.getBoundingClientRect();
            if (evt.type === 'mousedown') {
                console.log('boundClientRect：' + JSON.stringify(rect));
                console.log('clientX：' + evt.clientX + '；clientY：' + evt.clientY);
            }
            var x = evt.clientX - rect.left;
            var y = evt.clientY - rect.top;
            return vec2.create(x, y);
        }
        alert('canvas为null');
        throw new Error('canvas为null');
    };
    Application.prototype._toCanvasMouseEvent = function (evt) {
        var event = evt;
        var mousePosition = this._viewportToCanvanCoordinate(event);
        var canvasMouseEvent = new CanvasMouseEvent(mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey);
        return canvasMouseEvent;
    };
    Application.prototype._toCanvasKeyBoardEvent = function (evt) {
        var event = evt;
        var canvasKeyBoardEvent = new CanvasKeyBoardEvent(event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey);
        return canvasKeyBoardEvent;
    };
    Application.prototype.test = function (color, num) {
        if (color === void 0) { color = 'black'; }
        if (num === void 0) { num = 100; }
    };
    return Application;
}());
export { Application };
export var EInputEventType;
(function (EInputEventType) {
    EInputEventType[EInputEventType["MOUSEEVENT"] = 0] = "MOUSEEVENT";
    EInputEventType[EInputEventType["MOUSEDOWN"] = 1] = "MOUSEDOWN";
    EInputEventType[EInputEventType["MOUSEUP"] = 2] = "MOUSEUP";
    EInputEventType[EInputEventType["MOUSEMOVE"] = 3] = "MOUSEMOVE";
    EInputEventType[EInputEventType["MOUSEDRAG"] = 4] = "MOUSEDRAG";
    EInputEventType[EInputEventType["KEYBOARDEVENT"] = 5] = "KEYBOARDEVENT";
    EInputEventType[EInputEventType["KEYUP"] = 6] = "KEYUP";
    EInputEventType[EInputEventType["KEYDOWN"] = 7] = "KEYDOWN";
    EInputEventType[EInputEventType["KEYPRESS"] = 8] = "KEYPRESS";
})(EInputEventType || (EInputEventType = {}));
var CanvasInputEvent = /** @class */ (function () {
    function CanvasInputEvent(altKey, ctrlKey, shiftKey, type) {
        if (altKey === void 0) { altKey = false; }
        if (ctrlKey === void 0) { ctrlKey = false; }
        if (shiftKey === void 0) { shiftKey = false; }
        if (type === void 0) { type = EInputEventType.MOUSEEVENT; }
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.type = type;
    }
    return CanvasInputEvent;
}());
export { CanvasInputEvent };
var CanvasMouseEvent = /** @class */ (function (_super) {
    __extends(CanvasMouseEvent, _super);
    function CanvasMouseEvent(canvasPos, button, altKey, ctrlKey, shiftKey) {
        if (altKey === void 0) { altKey = false; }
        if (ctrlKey === void 0) { ctrlKey = false; }
        if (shiftKey === void 0) { shiftKey = false; }
        var _this = _super.call(this, altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT) || this;
        _this.canvasPosition = canvasPos;
        _this.button = button;
        _this.localPosition = vec2.create();
        return _this;
    }
    return CanvasMouseEvent;
}(CanvasInputEvent));
export { CanvasMouseEvent };
var CanvasKeyBoardEvent = /** @class */ (function (_super) {
    __extends(CanvasKeyBoardEvent, _super);
    function CanvasKeyBoardEvent(key, keyCode, repeat, altKey, ctrlKey, shiftKey) {
        if (altKey === void 0) { altKey = false; }
        if (ctrlKey === void 0) { ctrlKey = false; }
        if (shiftKey === void 0) { shiftKey = false; }
        var _this = _super.call(this, altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT) || this;
        _this.key = key;
        _this.keyCode = keyCode;
        _this.repeat = repeat;
        return _this;
    }
    return CanvasKeyBoardEvent;
}(CanvasInputEvent));
export { CanvasKeyBoardEvent };
// export type Canvas2DContextAttributes = any
var Canvas2DApplication = /** @class */ (function (_super) {
    __extends(Canvas2DApplication, _super);
    function Canvas2DApplication(canvas, contextAttributes) {
        var _this = _super.call(this, canvas) || this;
        _this.context2D = _this.canvas.getContext('2d', contextAttributes);
        return _this;
    }
    return Canvas2DApplication;
}(Application));
export { Canvas2DApplication };
var WebGLApplication = /** @class */ (function (_super) {
    __extends(WebGLApplication, _super);
    function WebGLApplication(canvas, contextAttributes) {
        var _this = _super.call(this, canvas) || this;
        _this.context3D = _this.canvas.getContext('webgl', contextAttributes);
        if (_this.context3D === null) {
            _this.context3D = _this.canvas.getContext('experimental-webgl', contextAttributes);
            if (_this.context3D === null) {
                alert('无法创建WebGLRenderingContext上下文对象');
                throw new Error('无法创建WebGLRenderingContext上下文对象');
            }
        }
        return _this;
    }
    return WebGLApplication;
}(Application));
export { WebGLApplication };
