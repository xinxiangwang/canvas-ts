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
import { Canvas2DApplication } from './application.js';
import { Math2D, Rectangle, Size, vec2 } from './vec2.js';
import { Tank } from './tank.js';
export var ELayout;
(function (ELayout) {
    ELayout[ELayout["LEFT_TOP"] = 0] = "LEFT_TOP";
    ELayout[ELayout["RIGHT_TOP"] = 1] = "RIGHT_TOP";
    ELayout[ELayout["RIGHT_BOTTOM"] = 2] = "RIGHT_BOTTOM";
    ELayout[ELayout["LEFT_BOTTOM"] = 3] = "LEFT_BOTTOM";
    ELayout[ELayout["CENTER_MIDDLE"] = 4] = "CENTER_MIDDLE";
    ELayout[ELayout["CENTER_TOP"] = 5] = "CENTER_TOP";
    ELayout[ELayout["RIGHT_MIDDLE"] = 6] = "RIGHT_MIDDLE";
    ELayout[ELayout["CENTER_BOTTOM"] = 7] = "CENTER_BOTTOM";
    ELayout[ELayout["LEFT_MIDDLE"] = 8] = "LEFT_MIDDLE";
})(ELayout || (ELayout = {}));
export var EImageFillType;
(function (EImageFillType) {
    EImageFillType[EImageFillType["STRETCH"] = 0] = "STRETCH";
    EImageFillType[EImageFillType["REPEAT"] = 1] = "REPEAT";
    EImageFillType[EImageFillType["REPEAT_X"] = 2] = "REPEAT_X";
    EImageFillType[EImageFillType["REPEAT_Y"] = 3] = "REPEAT_Y";
})(EImageFillType || (EImageFillType = {}));
var RenderState = /** @class */ (function () {
    function RenderState() {
        this.lineWidth = 1;
        this.strokeStyle = 'red';
        this.fillStyle = 'green';
    }
    RenderState.prototype.clone = function () {
        var state = new RenderState();
        state.lineWidth = this.lineWidth;
        state.strokeStyle = this.strokeStyle;
        state.fillStyle = this.fillStyle;
        return state;
    };
    RenderState.prototype.toString = function () {
        return JSON.stringify(this, null, '');
    };
    return RenderState;
}());
var RenderStateStack = /** @class */ (function () {
    function RenderStateStack() {
        this._stack = [new RenderState()];
    }
    Object.defineProperty(RenderStateStack.prototype, "_currentState", {
        get: function () {
            return this._stack[this._stack.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    RenderStateStack.prototype.save = function () {
        this._stack.push(this._currentState.clone());
    };
    RenderStateStack.prototype.restore = function () {
        this._stack.pop();
    };
    Object.defineProperty(RenderStateStack.prototype, "lineWidth", {
        get: function () {
            return this._currentState.lineWidth;
        },
        set: function (value) {
            this._currentState.lineWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderStateStack.prototype, "strokeStyle", {
        get: function () {
            return this._currentState.strokeStyle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderStateStack.prototype, "stokeStyle", {
        set: function (value) {
            this._currentState.strokeStyle = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderStateStack.prototype, "fillStyle", {
        get: function () {
            return this._currentState.strokeStyle;
        },
        set: function (value) {
            this._currentState.strokeStyle = value;
        },
        enumerable: false,
        configurable: true
    });
    RenderStateStack.prototype.printCurrentStateInfo = function () {
        console.log(this._currentState.toString());
    };
    return RenderStateStack;
}());
var TestApplication = /** @class */ (function (_super) {
    __extends(TestApplication, _super);
    function TestApplication(canvas) {
        var _this = _super.call(this, canvas) || this;
        _this._lineDashOffset = 0; // 虚线边框间隔
        // 鼠标移动
        _this._mouseX = 0;
        _this._mouseY = 0;
        // 公转与自转
        _this._rotationSunSpeed = 50; // 太阳自传角速度 以角为单位
        _this._rotationMoonSpeed = 100; // 月球自转的角速度 以角为单位
        _this._revolutionSpeed = 60; // 月球公转的角速度
        _this._rotationSun = 0; // 太阳自转的角位移
        _this._rotationMoon = 0; // 月亮自转的角位移
        _this._revolution = 0; // 月亮围绕太阳公转的角位移
        _this.addTimer(_this.timeCallback.bind(_this), 0.033);
        _this.isSupportMouseMove = true;
        _this._tank = new Tank();
        _this._tank.x = canvas.width * 0.5;
        _this._tank.y = canvas.height * 0.5;
        return _this;
        // this._tank.tankRotation = Math2D.toRadian(30)
        // this._tank.turretRotation = Math2D.toRadian(-60)
    }
    TestApplication.prototype.drawTank = function () {
        this._tank.draw(this);
    };
    TestApplication.makeFontString = function (// 设置字体
    size, weight, style, variant, family) {
        if (size === void 0) { size = '10px'; }
        if (weight === void 0) { weight = 'normal'; }
        if (style === void 0) { style = 'normal'; }
        if (variant === void 0) { variant = 'normal'; }
        if (family === void 0) { family = 'sans-serif'; }
        var strs = [];
        strs.push(style);
        strs.push(variant);
        strs.push(weight);
        strs.push(size);
        strs.push(family);
        return strs.join(' ');
    };
    TestApplication.prototype._updareLineDashOffset = function () {
        this._lineDashOffset++;
        if (this._lineDashOffset > 10000) {
            this._lineDashOffset = 0;
        }
    };
    TestApplication.prototype.timeCallback = function (id, data) {
        this._updareLineDashOffset();
        this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
    };
    TestApplication.prototype._drawRect = function (x, y, w, h) {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = 'rgba(0, 255, 0, 0.5)';
            this.context2D.strokeStyle = 'rgb(0, 0, 255)';
            this.context2D.lineWidth = 2;
            this.context2D.lineCap = 'butt';
            this.context2D.setLineDash([10, 5]);
            this.context2D.lineDashOffset = this._lineDashOffset;
            this.context2D.beginPath();
            this.context2D.moveTo(x, y);
            this.context2D.lineTo(x + w, y);
            this.context2D.lineTo(x + w, y + h);
            this.context2D.lineTo(x, y + h);
            this.context2D.closePath();
            this.context2D.fill();
            this.context2D.stroke();
            this.context2D.restore();
        }
    };
    TestApplication.prototype.fillLinearRect = function (x, y, w, h) {
        if (this.context2D !== null) {
            // this.context2D.save()
            if (this._linearGradient === undefined) {
                // 从右到左渐变
                this._linearGradient = this.context2D.createLinearGradient(x, y, x + w, y);
                this._linearGradient.addColorStop(0.0, 'green');
                this._linearGradient.addColorStop(0.25, 'rgba(255, 0, 0, 1)');
                this._linearGradient.addColorStop(0.5, 'green');
                this._linearGradient.addColorStop(0.75, '#0000FF');
                this._linearGradient.addColorStop(1, 'black');
                console.log(x, y, x + w, y);
                console.log(this._linearGradient, this.context2D);
                this.context2D.fillStyle = this._linearGradient;
                this.context2D.beginPath();
                // this.context2D.rect() // 绘制矩形
                this.context2D.fillRect(x, y, w, h); // 填充
                // this.context2D.restore()
            }
        }
    };
    TestApplication.prototype.fillRadialRect = function (x, y, w, h) {
        if (this.context2D !== null) {
            this.context2D.save();
            if (this._radialGradient === undefined) {
                var centX = x + w * 0.5;
                var centY = y + h * 0.5;
                var radius = Math.min(w, h); // 选择矩形宽度小的作为圆形直径
                radius *= 0.5;
                this._radialGradient = this.context2D.createRadialGradient(centX, centY, radius * 0.1, centX, centY, radius);
                this._radialGradient.addColorStop(0.0, 'black');
                this._radialGradient.addColorStop(0.25, 'rgba(255, 0, 0, 1)');
                this._radialGradient.addColorStop(0.5, 'green');
                this._radialGradient.addColorStop(0.75, '#0000FF');
                this._radialGradient.addColorStop(1.0, 'white');
                this.context2D.fillStyle = this._radialGradient;
                this.context2D.fillRect(x, y, w, h);
                this.context2D.restore();
            }
        }
    };
    TestApplication.prototype.fillPatternRect = function (x, y, w, h) {
        var _this = this;
        if (this.context2D !== null) {
            if (this._pattern === undefined) {
                var img_1 = document.createElement('img');
                var repeat_1 = 'repeat';
                img_1.src = './img/gaiminka.png';
                img_1.onload = function (e) {
                    if (_this.context2D !== null) {
                        _this._pattern = _this.context2D.createPattern(img_1, repeat_1);
                        if (_this._pattern === null)
                            return;
                        _this.context2D.save();
                        _this.context2D.fillStyle = _this._pattern;
                        _this.context2D.beginPath();
                        _this.context2D.fillRect(x, y, w, h);
                        _this.context2D.restore();
                    }
                };
            }
            else {
                this.context2D.save();
                if (this._pattern === null)
                    return;
                this.context2D.fillStyle = this._pattern;
                this.context2D.beginPath();
                this.context2D.fillRect(x, y, w, h);
                this.context2D.restore();
            }
        }
    };
    TestApplication.prototype.fillCircle = function (// 绘制圆形 实心
    x, y, radius, fillStyle) {
        if (fillStyle === void 0) { fillStyle = 'red'; }
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = fillStyle;
            this.context2D.beginPath();
            this.context2D.arc(x, y, radius, 0, Math.PI * 2);
            this.context2D.fill();
            this.context2D.restore();
        }
    };
    TestApplication.prototype.strokeCircle = function (// 绘制圆形 空心
    x, y, radius, strokeStyle) {
        if (strokeStyle === void 0) { strokeStyle = 'red'; }
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = strokeStyle;
            this.context2D.beginPath();
            this.context2D.arc(x, y, radius, 0, Math.PI * 2);
            this.context2D.stroke();
            this.context2D.restore();
        }
    };
    TestApplication.prototype.strokeRect = function (// 绘制矩形 空心
    x, y, width, height, strokeStyle) {
        if (strokeStyle === void 0) { strokeStyle = 'red'; }
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = strokeStyle;
            this.context2D.lineWidth = 2;
            this.context2D.rect(x, y, width, height);
            this.context2D.stroke();
            this.context2D.restore();
        }
    };
    TestApplication.prototype.fillText = function (// 绘制文字
    text, x, y, color, align, baseline, font) {
        if (color === void 0) { color = 'white'; }
        if (align === void 0) { align = 'left'; }
        if (baseline === void 0) { baseline = 'top'; }
        if (font === void 0) { font = '10px sans-serif'; }
        if (this.context2D === null)
            return;
        this.context2D.save();
        this.context2D.textAlign = align;
        this.context2D.textBaseline = baseline;
        this.context2D.font = font;
        this.context2D.fillStyle = color;
        this.context2D.fillText(text, x, y);
        this.context2D.restore();
    };
    TestApplication.prototype.fillRectangleWithColor = function (rect, color) {
        var _a = rect.origin, x = _a.x, y = _a.y;
        var _b = rect.size, w = _b.width, h = _b.height;
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.moveTo(x, y);
            this.context2D.lineTo(x + w, y);
            this.context2D.lineTo(x + w, y + h);
            this.context2D.lineTo(x, y + h);
            this.context2D.closePath();
            this.context2D.fill();
            this.context2D.stroke();
            this.context2D.restore();
        }
    };
    TestApplication.prototype.testCanvas2DTextLayout = function () {
        var x = 20; // 绘制的矩形外边距20
        var y = 20;
        var width = this.canvas.width - x * 2; // 绘制的矩形宽度减去两个x外边距
        var height = this.canvas.height - y * 2;
        var drawX = x;
        var drawY = y;
        var radius = 3; // 绘制原点
        this.fillRectWithTitle(x, y, width, height); // 绘制背景
        // 左上角
        this.fillText('左上角', drawX, drawY, 'red', 'left', 'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 右上角
        drawX = x + width;
        drawY = y;
        this.fillText('右上角', drawX, drawY, 'red', 'right', 'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 右下角
        drawX = x + width;
        drawY = y + height;
        this.fillText('右下角', drawX, drawY, 'red', 'right', 'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 左下角
        drawX = x;
        drawY = y + height;
        this.fillText('左下角', drawX, drawY, 'red', 'left', 'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 中心
        drawX = x + width * 0.5;
        drawY = y + width * 0.5;
        this.fillText('中心', drawX, drawY, 'red', 'center', 'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 中上
        drawX = x + width * 0.5;
        drawY = y;
        this.fillText('中上', drawX, drawY, 'red', 'center', 'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 中右
        drawX = x + width;
        drawY = y + height * 0.5;
        this.fillText('中右', drawX, drawY, 'red', 'right', 'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 中下
        drawX = x + width * 0.5;
        drawY = y + height;
        this.fillText('中下', drawX, drawY, 'red', 'center', 'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 中左
        drawX = x;
        drawY = y + height * 0.5;
        this.fillText('中下', drawX, drawY, 'red', 'left', 'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
    };
    TestApplication.prototype.calcTextSize = function (text, char, scale) {
        if (char === void 0) { char = 'W'; }
        if (scale === void 0) { scale = 0.5; }
        if (this.context2D !== null) {
            var size = new Size();
            size.width = this.context2D.measureText(text).width;
            var w = this.context2D.measureText(char).width;
            size.height = w + w * scale;
            return size;
        }
        else {
            throw new Error('缺少context2D对象');
        }
    };
    TestApplication.prototype.strokeLine = function (x0, y0, x1, y1) {
        if (this.context2D !== null) {
            this.context2D.beginPath();
            this.context2D.moveTo(x0, y0);
            this.context2D.lineTo(x1, y1);
            this.context2D.stroke();
        }
    };
    TestApplication.prototype.strokeCoord = function (orginX, orginY, width, height) {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = 'red';
            this.strokeLine(orginX, orginY, orginX + width, orginY);
            this.context2D.strokeStyle = 'blue';
            this.strokeLine(orginX, orginY, orginX, orginY + height);
            this.context2D.restore();
        }
    };
    TestApplication.prototype.strokeGrid = function (color, interval) {
        if (color === void 0) { color = 'grey'; }
        if (interval === void 0) { interval = 10; }
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.lineWidth = 0.5;
            for (var i = interval + 0.5; i < this.canvas.width; i += interval) { // 绘制竖线
                this.strokeLine(i, 0, i, this.canvas.height);
            }
            for (var i = interval + 0.5; i < this.canvas.height; i += interval) { // 绘制横线
                this.strokeLine(0, i, this.canvas.width, i);
            }
            this.context2D.restore();
            this.fillCircle(0, 0, 5, 'green');
            this.strokeCoord(0, 0, this.canvas.width, this.canvas.height);
        }
    };
    TestApplication.prototype.calcLocalTextRectangle = function (// 根据文字获取文字在各个位置的坐标
    layout, text, parentWidth, parentHeight) {
        var s = this.calcTextSize(text);
        var o = vec2.create();
        var left = 0;
        var top = 0;
        var right = parentWidth - s.width;
        var bottom = parentHeight - s.height;
        var center = right * 0.5;
        var middle = bottom * 0.5;
        switch (layout) {
            case ELayout.LEFT_TOP:
                o.x = left;
                o.y = top;
                break;
            case ELayout.RIGHT_TOP:
                o.x = right;
                o.y = top;
                break;
            case ELayout.RIGHT_BOTTOM:
                o.x = right;
                o.y = bottom;
                break;
            case ELayout.LEFT_BOTTOM:
                o.x = left;
                o.x = bottom;
                break;
            case ELayout.CENTER_TOP:
                o.x = center;
                o.y = top;
                break;
            case ELayout.RIGHT_MIDDLE:
                o.x = right;
                o.y = middle;
                break;
            case ELayout.CENTER_BOTTOM:
                o.x = center;
                o.y = bottom;
                break;
            case ELayout.LEFT_MIDDLE:
                o.x = left;
                o.y = middle;
                break;
        }
        return new Rectangle(o, s);
    };
    TestApplication.prototype.fillRectWithTitle = function (// 绘制文字周围的坐标
    x, y, width, height, title, layout, color, showCoord) {
        if (title === void 0) { title = ''; }
        if (layout === void 0) { layout = ELayout.CENTER_MIDDLE; }
        if (color === void 0) { color = 'grey'; }
        if (showCoord === void 0) { showCoord = true; }
        if (this.context2D === null)
            return;
        // 绘制矩形
        this.context2D.save();
        this.context2D.fillStyle = color;
        this.context2D.beginPath();
        this.context2D.fillRect(x, y, width, height);
        if (title.length !== 0) {
            // 获取文字对应位置的坐标
            var rect = this.calcLocalTextRectangle(layout, title, width, height);
            this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif');
            this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
            if (showCoord) {
                this.strokeCoord(x, y, width + 20, height + 20);
                this.fillCircle(x, y, 3);
            }
        }
        this.context2D.restore();
    };
    TestApplication.prototype.fillLocalRectWithTitle = function (width, // 要绘制矩形的宽度
    height, // 高度
    title, // 矩形中字符串
    referencePt, // 坐标系原点位置， 默认剧中
    layout, // 文字位置
    color, // 填充颜色
    showCoord // 是否显示坐标系
    ) {
        if (title === void 0) { title = ''; }
        if (referencePt === void 0) { referencePt = ELayout.LEFT_TOP; }
        if (layout === void 0) { layout = ELayout.CENTER_MIDDLE; }
        if (color === void 0) { color = 'grey'; }
        if (showCoord === void 0) { showCoord = false; }
        if (this.context2D !== null) {
            var x = 0;
            var y = 0;
            switch (referencePt) {
                case ELayout.LEFT_TOP:
                    x = 0;
                    y = 0;
                    break;
                case ELayout.LEFT_MIDDLE:
                    x = 0;
                    y = -height * 0.5;
                    break;
                case ELayout.LEFT_BOTTOM:
                    x = 0;
                    y = -height;
                    break;
                case ELayout.CENTER_TOP:
                    x = -width * 0.5;
                    y = 0;
                    break;
                case ELayout.CENTER_MIDDLE:
                    x = -width * 0.5;
                    y = -height * 0.5;
                    break;
                case ELayout.CENTER_BOTTOM:
                    x = -width * 0.5;
                    y = -height;
                    break;
                case ELayout.RIGHT_TOP:
                    x = -width;
                    y = 0;
                    break;
                case ELayout.RIGHT_MIDDLE:
                    x = -width;
                    y = -height * 0.5;
                    break;
                case ELayout.RIGHT_BOTTOM:
                    x = -width;
                    y = -height;
                    break;
            }
            this.context2D.save();
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect(x, y, width, height);
            this.context2D.fill();
            if (title.length !== 0) {
                var rect = this.calcLocalTextRectangle(layout, title, width, height);
                this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'green', 'left', 'top', '10px sans-serif');
                this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)');
                this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
            }
            if (showCoord) {
                this.strokeCoord(0, 0, width + 20, height + 20);
                this.fillCircle(0, 0, 3);
            }
            this.context2D.restore();
        }
    };
    TestApplication.prototype.testMyTextLayout = function () {
        var x = 20;
        var y = 20;
        var width = this.canvas.width - x * 2;
        var height = this.canvas.height - y * 2;
        var right = x + width;
        var bottom = y + height;
        var drawX = x;
        var drawY = y;
        var drawWidth = 30;
        var drawHeight = 30;
        this.fillRectWithTitle(x, y, width, height, undefined, undefined, 'rgba(0, 0, 0, 0.6)');
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '左上', ELayout.LEFT_TOP, 'rgba(255, 255, 0, 0.2)');
        drawX = (right - drawWidth) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '中上', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawX = right - drawWidth;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '右上', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawX = right - drawWidth;
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '右中', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawY = bottom - drawHeight;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '右下', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawX = (right - drawWidth) * 0.5;
        drawY = bottom - drawHeight;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '中下', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawX = x;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '左下', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '左中', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
        drawX = (right - drawWidth) * 0.5;
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '中', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)');
    };
    TestApplication.prototype.loadAndDrawImage = function (url) {
        var _this = this;
        var img = document.createElement('img');
        img.src = url;
        img.onload = function (e) {
            if (_this.context2D !== null) {
                // this.context2D.drawImage(img, 10, 10)
                // this.context2D.drawImage(img, img.width + 30, 10, 200, img.height)
                // this.context2D.drawImage(img, 44, 6, 162, 175, 200, img.height + 30, 200, 130)
                var rect = Rectangle.create(10, 10, _this.canvas.width - 20, _this.canvas.height - 20);
                _this.drawImage(img, rect, undefined, EImageFillType.REPEAT_Y);
            }
        };
    };
    TestApplication.prototype.drawImage = function (// 绘制图像 REPEAT REPEAT_X REPEAT_Y STRENTH
    img, destRect, srcRect, fillType) {
        if (srcRect === void 0) { srcRect = Rectangle.create(0, 0, img.width, img.height); }
        if (fillType === void 0) { fillType = EImageFillType.STRETCH; }
        if (this.context2D === null)
            return false;
        if (srcRect.isEmpty())
            return false;
        if (destRect.isEmpty())
            return false;
        if (fillType === EImageFillType.STRETCH) {
            this.context2D.drawImage(img, srcRect.origin.x, srcRect.origin.y, srcRect.size.width, srcRect.size.height, destRect.origin.x, destRect.origin.y, destRect.size.width, destRect.size.height);
        }
        else {
            this.fillRectangleWithColor(destRect, 'grey');
            var rows = Math.ceil(destRect.size.width / srcRect.size.width);
            var columns = Math.ceil(destRect.size.height / srcRect.size.height);
            var left = 0;
            var top_1 = 0;
            var right = 0;
            var bottom = 0;
            var width = 0;
            var height = 0;
            var destRight = destRect.origin.x + destRect.size.width; // 画布右边界
            var destBottom = destRect.origin.y + destRect.size.height; // 画布下边界
            console.log(destRect, srcRect);
            if (fillType === EImageFillType.REPEAT_X) {
                columns = 1;
            }
            else if (fillType === EImageFillType.REPEAT_Y) {
                rows = 1;
            }
            for (var i = 0; i < rows; i++) { // 绘制水平方向图像
                for (var j = 0; j < columns; j++) { // 绘制垂直方向图像
                    // 计算图像绘制的坐标点 左上角
                    left = destRect.origin.x + i * srcRect.size.width;
                    top_1 = destRect.origin.y + j * srcRect.size.height;
                    width = srcRect.size.width;
                    height = srcRect.size.height;
                    // 计算图像绘制坐标点 右下角
                    right = left + width;
                    bottom = top_1 + height;
                    if (right > destRight) {
                        width = srcRect.size.width - (right - destRight);
                    }
                    if (bottom > destBottom) {
                        height = srcRect.size.height - (bottom - destBottom);
                    }
                    this.context2D.drawImage(img, srcRect.origin.x, srcRect.origin.y, width, height, left, top_1, width, height);
                }
            }
        }
        return true;
    };
    TestApplication.prototype.getColorCanvas = function (amount) {
        if (amount === void 0) { amount = 32; }
        var step = 4;
        var canvas = document.createElement('canvas');
        canvas.width = amount * step;
        canvas.height = amount * step;
        var context = canvas.getContext('2d');
        if (context === null) {
            alert('渲染失败');
            throw new Error('渲染失败');
        }
        for (var i = 0; i < step; i++) {
            for (var j = 0; j < step; j++) {
                var idx = step * i + j;
                context.save();
                context.fillStyle = TestApplication.Colors[idx];
                context.fillRect(i * amount, j * amount, amount, amount);
                context.restore();
            }
        }
        console.log(canvas);
        return canvas;
    };
    TestApplication.prototype.drawColorCanvas = function () {
        var colorsCanvas = this.getColorCanvas(30);
        var rect = Rectangle.create(10, 10, this.canvas.width - 20, this.canvas.height - 20);
        this.drawImage(colorsCanvas, rect, undefined, EImageFillType.REPEAT);
    };
    TestApplication.prototype.testChangePartCanvasImageData = function (// 改变指定位置canvas
    rRow, rColum, cRow, cColum, size) {
        if (rRow === void 0) { rRow = 2; }
        if (rColum === void 0) { rColum = 0; }
        if (cRow === void 0) { cRow = 1; }
        if (cColum === void 0) { cColum = 0; }
        if (size === void 0) { size = 30; }
        var colorCanvas = this.getColorCanvas(size);
        var context = colorCanvas.getContext('2d');
        if (context === null)
            return;
        this.drawImage(colorCanvas, Rectangle.create(10, 10, colorCanvas.width, colorCanvas.height));
        var imgData = context.createImageData(size, size);
        var data = imgData.data; // 默认为全是255值的数组 数组长度 size*size*4 每连续四个都是rgba值
        var rgbaCount = data.length;
        for (var i = 0; i < rgbaCount; i++) { // 红色
            data[i * 4 + 0] = 255;
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
            data[i * 4 + 3] = 255;
        }
        context.putImageData(imgData, size * rColum, size * rRow, 0, 0, size, size); // 改变第三行第一列色块
        imgData = context.getImageData(0, 0, 300, 300);
        data = imgData.data;
        var component = 0;
        for (var i = 0; i < imgData.width; i++) {
            for (var j = 0; j < imgData.height; j++) {
                for (var k = 0; k < 4; k++) {
                    var idx = (i * imgData.height + j) * 4 + k;
                    component = data[idx];
                    if (idx % 4 !== 3) {
                        data[idx] = 255 - component;
                    }
                }
            }
        }
        context.putImageData(imgData, size * cColum, size * cRow, 0, 0, size, size);
        this.drawImage(colorCanvas, Rectangle.create(150, 10, colorCanvas.width, colorCanvas.height));
    };
    TestApplication.prototype.drawCanvasCoordCenter = function () {
        if (this.context2D === null)
            return;
        var halfWidth = this.canvas.width * 0.5;
        var halfHeight = this.canvas.height * 0.5;
        this.context2D.save();
        this.context2D.lineWidth = 2;
        this.context2D.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.strokeLine(0, halfHeight, this.canvas.width, halfHeight);
        this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height);
        this.context2D.restore();
        this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0, 0, 0, 0.5)');
    };
    TestApplication.prototype.drawCoordInfo = function (info, x, y) {
        this.fillText(info, x, y, 'black', 'center', 'bottom');
    };
    TestApplication.prototype.distance = function (x0, y0, x1, y1) {
        var diffX = x1 - x0;
        var diffY = y1 - y0;
        return Math.sqrt(diffX * diffX + diffY * diffY);
    };
    TestApplication.prototype.dispatchMouseMove = function (e) {
        this._mouseX = e.canvasPosition.x;
        this._mouseY = e.canvasPosition.y;
        this._tank.onMouseMove(e);
    };
    TestApplication.prototype.dispatchKeyPress = function (e) {
        this._tank.onKeyPress(e);
    };
    TestApplication.prototype.doTransform = function (degree, rotateFirst) {
        if (rotateFirst === void 0) { rotateFirst = true; }
        if (this.context2D !== null) {
            var radians = Math2D.toRadian(degree);
            this.context2D.save();
            var x = this.canvas.width * 0.5;
            var y = this.canvas.height * 0.5;
            var width = 50;
            var height = 30;
            if (rotateFirst) {
                this.context2D.rotate(radians);
                this.context2D.translate(x, y);
            }
            else {
                this.context2D.translate(x, y);
                this.context2D.rotate(radians);
            }
            this.fillRectWithTitle(0, 0, width, height, 'asdasd');
            this.context2D.restore();
            var radius = this.distance(0, 0, x, y);
            this.strokeCircle(0, 0, radius, 'black');
        }
    };
    TestApplication.prototype.rotateTranslate = function (degree, layout, width, height) {
        if (layout === void 0) { layout = ELayout.LEFT_TOP; }
        if (width === void 0) { width = 40; }
        if (height === void 0) { height = 20; }
        if (this.context2D === null)
            return;
        var x = this.canvas.width * 0.5;
        var y = this.canvas.height * 0.5;
        var radians = Math2D.toRadian(degree);
        this.context2D.save();
        this.context2D.rotate(radians);
        this.context2D.translate(x, y);
        this.fillLocalRectWithTitle(width, height, '', layout);
        this.context2D.restore();
    };
    TestApplication.prototype.testFillLocalRectWithTitle = function () {
        if (this.context2D !== null) {
            this.rotateTranslate(0, ELayout.LEFT_TOP);
            this.rotateTranslate(10, ELayout.LEFT_MIDDLE);
            this.rotateTranslate(20, ELayout.LEFT_BOTTOM);
            this.rotateTranslate(30, ELayout.CENTER_TOP);
            this.rotateTranslate(40, ELayout.CENTER_MIDDLE);
            this.rotateTranslate(-40, ELayout.CENTER_BOTTOM);
            this.rotateTranslate(-10, ELayout.RIGHT_TOP);
            this.rotateTranslate(-20, ELayout.RIGHT_MIDDLE);
            this.rotateTranslate(-30, ELayout.RIGHT_BOTTOM);
            var x = this.canvas.width * 0.5;
            var y = this.canvas.height * 0.5;
            var radius = this.distance(0, 0, x, y);
            this.strokeCircle(0, 0, radius, 'black');
        }
    };
    TestApplication.prototype.fillLocalRectWidthTitleUV = function (// 优化fillLocalRectWithTitle
    width, height, title, u, v, layout, color, showCoord) {
        if (title === void 0) { title = ''; }
        if (u === void 0) { u = 0; }
        if (v === void 0) { v = 0; }
        if (layout === void 0) { layout = ELayout.CENTER_MIDDLE; }
        if (color === void 0) { color = 'grey'; }
        if (showCoord === void 0) { showCoord = true; }
        if (this.context2D !== null) {
            var x = -width * u;
            var y = -height * v;
            this.context2D.save();
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect(x, y, width, height);
            this.context2D.fill();
            if (title.length !== 0) {
                var rect = this.calcLocalTextRectangle(layout, title, width, height);
                this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'green', 'left', 'top', '10px sans-serif');
                this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)');
                this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
            }
            if (showCoord) {
                this.strokeCoord(0, 0, width + 20, height + 20);
                this.fillCircle(0, 0, 3);
            }
            this.context2D.restore();
        }
    };
    TestApplication.prototype.translateRotateTranslateDrawRect = function (// u: x轴偏移量 1 为百分百   v: y轴偏移量 1 为百分百
    degree, u, v, radius, width, height) {
        if (u === void 0) { u = 0; }
        if (v === void 0) { v = 0; }
        if (radius === void 0) { radius = 200; }
        if (width === void 0) { width = 40; }
        if (height === void 0) { height = 20; }
        if (this.context2D === null)
            return;
        var radians = Math2D.toRadian(degree);
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5); // 坐标系移动到中心
        this.context2D.rotate(radians); // 旋转坐标系
        this.context2D.translate(radius, 0); // 移动坐标系
        this.fillLocalRectWidthTitleUV(width, height, '', u, v);
        this.context2D.restore();
    };
    TestApplication.prototype.testFillLocalRectWidthTitleUV = function () {
        if (this.context2D === null)
            return;
        var radius = 200;
        var steps = 18;
        for (var i = 0; i <= steps; i++) {
            var n = i / steps;
            this.translateRotateTranslateDrawRect(i * 10, n, 0, radius);
        }
        for (var i = 0; i < steps; i++) {
            var n = i / steps;
            this.translateRotateTranslateDrawRect(-i * 10, 0, n, radius);
        }
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 - radius * 0.4, this.canvas.height * 0.5 - radius * 0.4);
        this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 0.5, 0.5);
        this.context2D.restore();
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 + radius * 0.2, this.canvas.height * 0.5 - radius * 0.2);
        this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 0, 1);
        this.context2D.restore();
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 - radius * 0.1, this.canvas.height * 0.5 + radius * 0.1);
        this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 1, 0.2);
        this.context2D.restore();
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 + radius * 0.4, this.canvas.height * 0.5 + radius * 0.3);
        this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 0.3, 0.7);
        this.context2D.restore();
    };
    TestApplication.prototype.doLocalTransfrom = function () {
        if (this.context2D === null)
            return;
        var width = 100;
        var height = 60;
        var coordWidth = width * 1.2;
        var coordHeight = height * 1.2;
        var radius = 5;
        this.context2D.save();
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        this.fillCircle(0, 0, radius);
        this.fillLocalRectWithTitle(width, height, '1,初始状态');
        this.context2D.translate(this.canvas.width * 0.5, 10);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        this.fillCircle(0, 0, radius);
        this.fillLocalRectWithTitle(width, height, '2,平移');
        this.context2D.translate(0, this.canvas.height * 0.5 - 10);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        this.fillCircle(0, 0, radius);
        this.fillLocalRectWithTitle(width, height, '3,平移到画布中心');
        this.context2D.rotate(Math2D.toRadian(-120));
        this.fillLocalRectWithTitle(width, height, '4,旋转-120');
        this.strokeCoord(0, 0, coordWidth, coordHeight); // 旋转后 坐标系也变化了
        this.context2D.rotate(Math2D.toRadian(-130));
        this.fillLocalRectWithTitle(width, height, '5,旋转-130');
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        this.context2D.translate(50, 100);
        this.fillLocalRectWithTitle(width, height, '6,局部平移100px');
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        this.context2D.scale(1.5, 2.0);
        this.fillLocalRectWithTitle(width, height, '7,局部坐标系x轴放大1.5，y轴放大2倍', ELayout.LEFT_MIDDLE);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        this.fillCircle(0, 0, radius);
        this.context2D.restore();
    };
    TestApplication.prototype.draw4Quadrant = function () {
        if (this.context2D === null)
            return;
        this.context2D.save();
        this.fillText("第一象限", this.canvas.width, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'right', 'bottom', '20px sans-serif');
        this.fillText("第二象限", 0, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'left', 'bottom', '20px sans-serif');
        this.fillText("第三象限", 0, 0, 'rgba(0, 0, 255, 0.5)', 'left', 'top', '20px sans-serif');
        this.fillText("第四象限", this.canvas.width, 0, 'rgba(0, 0, 255, 0.5)', 'right', 'top', '20px sans-serif');
        this.context2D.restore();
    };
    TestApplication.prototype.rotationAndRevolutionSimulation = function (radius) {
        if (radius === void 0) { radius = 150; }
        console.log('绘制');
        if (this.context2D === null)
            return;
        var rotationMoon = Math2D.toRadian(this._rotationMoon);
        var rotationSun = Math2D.toRadian(this._rotationSun);
        var revolution = Math2D.toRadian(this._revolution);
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5); // 1
        this.context2D.save();
        this.context2D.rotate(rotationSun); // 2 旋转坐标轴
        this.fillLocalRectWidthTitleUV(100, 100, '自转', 0.5, 0.5); // 2 绘制矩形
        this.context2D.restore(); // 2 请除 2 中对坐标轴的操作
        this.context2D.save();
        this.context2D.rotate(revolution); // 3 旋转公转坐标轴
        this.strokeLine(0, 0, 1000, 0); // 月球自转原点就在这条线上
        this.context2D.translate(radius, 0); // 3 旋转后平移出去
        this.context2D.rotate(rotationMoon); // 3 旋转自转坐标轴
        this.fillLocalRectWidthTitleUV(80, 80, '自转 + 公转', 0.5, 0.5); // 3 绘制矩形
        this.context2D.restore(); // 3 请除 3 中对坐标轴的操作
        this.context2D.restore(); // 函数多次调用， 所以必须请除掉 1状态(改变的坐标轴)
    };
    TestApplication.prototype.drawTriangle = function (x0, y0, x1, y1, x2, y2, stroke) {
        if (stroke === void 0) { stroke = true; }
        if (this.context2D === null)
            return;
        this.context2D.save();
        this.context2D.lineWidth = 3;
        this.context2D.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.context2D.beginPath();
        this.context2D.moveTo(x0, y0);
        this.context2D.lineTo(x1, y1);
        this.context2D.lineTo(x2, y2);
        this.context2D.closePath();
        if (stroke) {
            this.context2D.stroke();
        }
        else {
            this.context2D.fill();
        }
        this.fillCircle(x2, y2, 5);
        this.context2D.restore();
    };
    // public render(): void { // 测试方法
    //   if (this.context2D !== null) {
    //     // this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
    //     // this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20)
    //     // this.fillLinearRect(10, 10, this.canvas.width - 20, this.canvas.height - 20)
    //     // this.fillRadialRect(0, 0, this.canvas.width, this.canvas.height)
    //     // this.fillPatternRect(10, 10, this.canvas.width - 20, this.canvas.height - 20)
    //     // this.fillCircle(30, 30, 30)
    //     // this.strokeCoord(10, 10, this.canvas.width, this.canvas.height)
    //     // this.strokeGrid('green', 30)
    //     // this.testCanvas2DTextLayout()
    //     // this.loadAndDrawImage('./img/gaiminka.png')
    //     // this.testMyTextLayout()
    //     // this.drawColorCanvas()
    //     // this.testChangePartCanvasImageData()
    //   }
    // }
    TestApplication.prototype.render = function () {
        if (this.context2D !== null) {
            this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.strokeGrid();
            this.drawCanvasCoordCenter();
            this.draw4Quadrant();
            // this.doTransform(0)
            // this.doTransform(20)
            // this.doTransform(-20)
            // this.testFillLocalRectWithTitle()
            // this.doLocalTransfrom()
            // this.testFillLocalRectWidthTitleUV()
            // this.rotationAndRevolutionSimulation()
            this.drawTank();
            this.drawCoordInfo("[" + this._mouseX + ", " + this._mouseY + ", " + this._tank.tankRotation.toFixed(2) + "]", this._mouseX, this._mouseY);
        }
    };
    TestApplication.prototype.update = function (elapsedMsec, intervalSec) {
        this._rotationMoon += this._rotationMoonSpeed * intervalSec;
        this._rotationSun += this._rotationSunSpeed * intervalSec;
        this._revolution += this._revolutionSpeed * intervalSec;
        this._tank.update(intervalSec);
        // console.log(this._rotationMoon, this._rotationSun, this._revolution)
    };
    TestApplication.prototype.test = function (color, num) {
        if (color === void 0) { color = 'black'; }
        if (num === void 0) { num = 100; }
        if (this.context2D === null)
            return;
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context2D.strokeStyle = color;
        this.context2D.lineWidth = 2;
        var x = this.canvas.width * 0.5;
        var y = this.canvas.height * 0.5;
        this.context2D.save();
        this.context2D.translate(x, y);
        this.context2D.save();
        this.context2D.translate(x - num, y - num);
        this.context2D.strokeRect(0, 0, 100, 100);
        this.context2D.restore();
        this.context2D.strokeRect(0, 0, 100, 100);
        this.context2D.restore();
        this.context2D.strokeRect(0, 0, 100, 100);
        this.context2D.restore();
    };
    TestApplication.Colors = [
        'aqua',
        'black',
        'blue',
        'fuchsia',
        'gray',
        'green',
        'lime',
        'marron',
        'navy',
        'olive',
        'orange',
        'purple',
        'red',
        'silver',
        'teal',
        'white',
        'yellow',
    ];
    return TestApplication;
}(Canvas2DApplication));
export { TestApplication };
var canvas = document.getElementById('canvas');
var app = new TestApplication(canvas);
function timerCallback(id, data) {
    console.log("当前调用Timer的id：" + id + "data：" + data);
}
var timer0 = app.addTimer(timerCallback, 3, true);
var timer1 = app.addTimer(timerCallback, 5, false);
app.update(0, 0);
app.render();
// app.test()
// app.test('green', 200)
var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
startButton.onclick = function (ev) {
    app.start();
};
stopButton.onclick = function (ev) {
    app.stop();
};
