export var ETokenType;
(function (ETokenType) {
    ETokenType[ETokenType["NONE"] = 0] = "NONE";
    ETokenType[ETokenType["STRING"] = 1] = "STRING";
    ETokenType[ETokenType["NUMBER"] = 2] = "NUMBER";
})(ETokenType || (ETokenType = {}));
var Doom3Factory = /** @class */ (function () {
    function Doom3Factory() {
    }
    Doom3Factory.createDoom3Tokenizer = function () {
        var ret = new Doom3Tokenizer();
        return ret;
    };
    return Doom3Factory;
}());
export { Doom3Factory };
var Doom3Token = /** @class */ (function () {
    function Doom3Token() {
        // private _charArr: string[] = []
        this._charArr = new Array();
        this.reset();
    }
    Doom3Token.prototype.reset = function () {
        this._charArr.length = 0;
        this._type = ETokenType.NONE;
        this._val = 0.0;
    };
    Object.defineProperty(Doom3Token.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Doom3Token.prototype.getString = function () {
        return this._charArr.join("");
    };
    Doom3Token.prototype.getFloat = function () {
        return this._val;
    };
    Doom3Token.prototype.getInt = function () {
        return parseInt(this._val.toString(), 10);
    };
    Doom3Token.prototype.isString = function (str) {
        var count = this._charArr.length;
        if (str.length !== count) {
            return false;
        }
        for (var i = 0; i < count; i++) {
            if (this._charArr[i] !== str[i]) {
                return false;
            }
        }
        return true;
    };
    Doom3Token.prototype.addChar = function (c) {
        this._charArr.push(c);
        console.log(this._charArr);
    };
    Doom3Token.prototype.setVal = function (num) {
        this._val = num;
        this._type = ETokenType.NUMBER;
    };
    Doom3Token.prototype.setType = function (type) {
        this._type = type;
    };
    return Doom3Token;
}());
var Doom3Tokenizer = /** @class */ (function () {
    function Doom3Tokenizer() {
        this._digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this._whiteSpaces = [' ', '\t', '\v', '\n'];
        this._specialChar = ['(', ')', '[', ']', '{', '}', ',', '.'];
        this._source = "Doom3Tokenizer";
        this._currIdx = 0;
        this._current = new Doom3Token();
    }
    Doom3Tokenizer.prototype.createIDoom3Token = function () {
        return new Doom3Token();
    };
    Doom3Tokenizer.prototype.moveNext = function () {
        return this._getNextToken(this._current);
    };
    Object.defineProperty(Doom3Tokenizer.prototype, "current", {
        get: function () {
            return this._current;
        },
        enumerable: false,
        configurable: true
    });
    Doom3Tokenizer.prototype._isDigit = function (c) {
        // console.log('_isDigit调用结果：' + this._digits.some((item: string) => item === c))
        return this._digits.some(function (item) { return item === c; });
    };
    Doom3Tokenizer.prototype._isWhitespace = function (c) {
        return this._whiteSpaces.some(function (item) { return item === c; });
    };
    Doom3Tokenizer.prototype.setSource = function (source) {
        this._source = source;
        this._currIdx = 0;
    };
    Doom3Tokenizer.prototype.reset = function () {
        // console.log('调用reset _currIdx 重置了')
        this._currIdx = 0;
    };
    Doom3Tokenizer.prototype._getChar = function () {
        // console.log('调用_getChar=>_currIdx：' + this._currIdx)
        if (this._currIdx >= 0 && this._currIdx < this._source.length) {
            return this._source.charAt(this._currIdx++);
        }
        return '';
    };
    Doom3Tokenizer.prototype._peekChar = function () {
        if (this._currIdx >= 0 && this._currIdx < this._source.length) {
            return this._source.charAt(this._currIdx);
        }
        return '';
    };
    Doom3Tokenizer.prototype._ungetChar = function () {
        // console.log(`调用_ungetChar=>_currIdx：${this._currIdx - 1}`)
        if (this._currIdx > 0) {
            --this._currIdx;
        }
    };
    Doom3Tokenizer.prototype._skipWhitespace = function () {
        var c = '';
        do {
            c = this._getChar();
        } while (c.length > 0 && this._isWhitespace(c));
        return c;
    };
    Doom3Tokenizer.prototype._skipComments0 = function () {
        var c = '';
        do {
            c = this._getChar();
        } while (c.length > 0 && c !== '\n');
        return c;
    };
    Doom3Tokenizer.prototype._skipComments1 = function () {
        var c = '';
        c = this._getChar();
        do {
            c = this._getChar();
        } while (c.length > 0 && (c !== '*' || this._peekChar() !== '/'));
        c = this._getChar();
        return c;
    };
    Doom3Tokenizer.prototype._getNextToken = function (tok) {
        var token = tok;
        var c = '';
        token.reset();
        // console.log('调用getNextToken=>_currIdx：' + this._currIdx)
        do {
            c = this._skipWhitespace();
            if (c === '/' && this._peekChar() === '/') { // 跳过单行注释
                c = this._skipComments0();
                console.log(c);
            }
            else if (c === '/' && this._peekChar() === '*') { // 跳过多行注释
                c = this._skipComments1();
                console.log(c);
            }
            else if (this._isDigit(c) || c === '-' || c === '+' || (c === '.' && this._isDigit(this._peekChar()))) {
                this._ungetChar();
                this._getNumber(token);
                return true;
            }
            else if (c === '\"' || c === '\'') {
                this._getSubstring(token, c);
                return true;
            }
            else if (c.length > 0) {
                this._ungetChar();
                this._getString(token);
                return true;
            }
        } while (c.length > 0);
        return false;
    };
    Doom3Tokenizer.prototype._getNumber = function (token) {
        var val = 0.0; // 数字解析结果
        var isFloat = false; // 是否为浮点数
        var scaleValue = 0.1; // 小数点后面的数字从左到右就是0.1 0.1*0.1 0.1*0.1*0.1
        var c = this._getChar(); // 进入这一步之前 调用了_ungetChar
        // console.log('调用_getNumber=>c：' + c)
        var isNegate = (c === '-'); // 预先判断是否为负数
        var consumed = false; // 循环第一次与第n+1次的区别标识
        var ascii0 = '0'.charCodeAt(0); // 获取0 ASCII编码
        do {
            token.addChar(c);
            if (c === '.') {
                isFloat = true;
            }
            else if (c !== '-' && c !== '+') {
                var ascii = c.charCodeAt(0);
                var vc = (ascii - ascii0);
                if (!isFloat) { // 整数算法
                    val = 10 * val + vc;
                }
                else { // 如果是小数 每调用一次这块代码 小数点后增加一位 即 0.1 0.11 0.111
                    val = val + scaleValue * vc;
                    scaleValue *= 0.1;
                }
            }
            // 循环第二次开始就为true了 一开始循环时是在循环体外调用_getChar 后面就是在循环体里面了
            if (consumed === true) {
                this._getChar();
            }
            c = this._peekChar();
            // console.log('调用_getNumber=>c：' + c)
            consumed = true;
            // 长度大于0 并且得是数字 或者  不是浮点数但是是.的 因为如果已经是浮点数了 那么不能再次出现.了
        } while (c.length > 0 && (this._isDigit(c) || (!isFloat && c === '.')));
        if (isNegate) {
            val = -val;
        }
        token.setVal(val);
    };
    Doom3Tokenizer.prototype._getSubstring = function (token, endChar) {
        var end = false;
        var c = '';
        token.setType(ETokenType.STRING);
        do {
            c = this._getChar();
            if (c === endChar) {
                end = true;
            }
            else {
                token.addChar(c);
            }
        } while (c.length > 0 && c !== '\n' && !end);
    };
    Doom3Tokenizer.prototype._getString = function (token) {
        var c = this._getChar();
        token.setType(ETokenType.STRING);
        do {
            token.addChar(c);
            if (!this._isSpecialChar(c)) {
                c = this._getChar();
            }
        } while (c.length > 0 && !this._isWhitespace(c) && !this._isSpecialChar(c));
        // console.log(this._currIdx)
    };
    Doom3Tokenizer.prototype._isSpecialChar = function (c) {
        return this._specialChar.includes(c);
    };
    return Doom3Tokenizer;
}());
// let str: string = `[3.14, -3.14,  .14, -.14, 3., -3., +3.14]`
var str = "\n    numMeshes  5\n    /*\n    * joints\u5173\u952E\u5B57\u5B9A\u4E49\u4E86\u9AA8\u9ABC\u52A8\u753B\u7684bindPose\n    */\n   joints  {\n     \"origin\" -1 ( 0 0 0 ) ( -0.5 -0.5 -0.5 )\n     \"Body\"  0 ( -12 0 79 ) ( -0.5-0.5-0.5 )\n     //origin\n   }\n";
var tokenizer = Doom3Factory.createDoom3Tokenizer();
// let token = tokenizer.createIDoom3Token()
tokenizer.setSource(str);
export function test() {
    tokenizer.moveNext();
    if (tokenizer.current.type === ETokenType.NUMBER) {
        console.log("NUMBER：" + tokenizer.current.getFloat());
    }
    else {
        console.log("STRING:" + tokenizer.current.getString());
    }
}
var dom = document.getElementById('btn');
if (dom !== null) {
    dom.addEventListener('click', function () {
        test();
    });
}
