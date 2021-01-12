var EPSILON = 0.00001;
var PiBy180 = 0.017453292519943295;
var vec2 = /** @class */ (function () {
    function vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.values = new Float32Array([x, y]);
    }
    vec2.create = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return new vec2(x, y);
    };
    vec2.copy = function (src, result) {
        if (result === void 0) { result = null; }
        if (result === null)
            result = new vec2();
        result.values[0] = src.values[0];
        result.values[1] = src.values[1];
        return result;
    };
    vec2.prototype.toString = function () {
        return "[" + this.values[0] + "," + this.values[1] + "]";
    };
    Object.defineProperty(vec2.prototype, "squaredLength", {
        get: function () {
            var x = this.values[0];
            var y = this.values[1];
            return (x * x + y * y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "length", {
        get: function () {
            return Math.sqrt(this.squaredLength);
        },
        enumerable: false,
        configurable: true
    });
    vec2.prototype.normalize = function () {
        var len = this.length;
        if (Math2D.isEquals(len, 0)) {
            this.values[0] = 0;
            this.values[1] = 0;
            return 0;
        }
        if (Math2D.isEquals(len, 1)) {
            return 1.0;
        }
        this.values[0] /= len;
        this.values[1] /= len;
        return len;
    };
    vec2.sum = function (left, right, result) {
        if (result === void 0) { result = null; }
        if (result === null)
            result = new vec2();
        result.values[0] = left.values[0] + right.values[0];
        result.values[1] = left.values[1] + right.values[1];
        return result;
    };
    vec2.prototype.add = function (right) {
        vec2.sum(this, right, this);
        return this;
    };
    vec2.difference = function (end, start, result) {
        if (result === void 0) { result = null; }
        if (result === null)
            result = new vec2();
        result.values[0] = end.values[0] - start.values[0];
        result.values[1] = end.values[1] - start.values[1];
        return result;
    };
    vec2.prototype.substract = function (another) {
        vec2.difference(this, another, this);
        return this;
    };
    vec2.prototype.negative = function () {
        this.values[0] = -this.values[0];
        this.values[1] = -this.values[1];
        return this;
    };
    vec2.scale = function (direction, scalar, result) {
        if (result === void 0) { result = null; }
        if (result === null)
            result = new vec2();
        result.values[0] = direction.values[0] * scalar;
        result.values[1] = direction.values[1] * scalar;
        return result;
    };
    vec2.scaleAdd = function (start, direction, scalar, result) {
        if (result === void 0) { result = null; }
        if (result === null)
            result = new vec2();
        vec2.scale(direction, scalar, result);
        return vec2.sum(start, result, result);
    };
    Object.defineProperty(vec2.prototype, "x", {
        get: function () { return this.values[0]; },
        set: function (x) { this.values[0] = x; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "y", {
        get: function () { return this.values[1]; },
        set: function (y) { this.values[1] = y; },
        enumerable: false,
        configurable: true
    });
    vec2.prototype.reset = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.values[0] = x;
        this.values[1] = y;
        return this;
    };
    vec2.prototype.equals = function (vector) {
        if (Math.abs(this.values[0] - vector.values[0]) > EPSILON) {
            return false;
        }
        if (Math.abs(this.values[1] - vector.values[1]) > EPSILON) {
            return false;
        }
        return true;
    };
    vec2.xAxis = new vec2(1, 0);
    vec2.YAxis = new vec2(0, 1);
    vec2.nXAxis = new vec2(-1, 0);
    vec2.nYAxis = new vec2(0, -1);
    return vec2;
}());
export { vec2 };
var Size = /** @class */ (function () {
    function Size(w, h) {
        if (w === void 0) { w = 1; }
        if (h === void 0) { h = 1; }
        this.values = new Float32Array([w, h]);
    }
    Object.defineProperty(Size.prototype, "width", {
        get: function () { return this.values[0]; },
        set: function (value) { this.values[0] = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "height", {
        get: function () { return this.values[1]; },
        set: function (value) { this.values[1] = value; },
        enumerable: false,
        configurable: true
    });
    Size.create = function (w, h) {
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        return new Size(w, h);
    };
    return Size;
}());
export { Size };
var Math2D = /** @class */ (function () {
    function Math2D() {
    }
    Math2D.isEquals = function (left, right, espilon) {
        if (espilon === void 0) { espilon = EPSILON; }
        if (Math.abs(right - left) > espilon) {
            return false;
        }
        return true;
    };
    Math2D.toDegree = function (radian) {
        return radian / PiBy180;
    };
    Math2D.toRadian = function (degree) {
        return degree * PiBy180;
    };
    return Math2D;
}());
export { Math2D };
var Rectangle = /** @class */ (function () {
    function Rectangle(orign, size) {
        if (orign === void 0) { orign = new vec2(); }
        if (size === void 0) { size = new Size(1, 1); }
        this.origin = orign;
        this.size = size;
    }
    Rectangle.create = function (x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 1; }
        if (h === void 0) { h = 1; }
        var origin = new vec2(x, y);
        var size = new Size(w, h);
        return new Rectangle(origin, size);
    };
    Rectangle.prototype.isEmpty = function () {
        var area = this.size.width * this.size.height;
        return Math2D.isEquals(area, 0) !== true;
    };
    return Rectangle;
}());
export { Rectangle };
