export enum ETokenType {
  NONE,
  STRING,
  NUMBER
}
export interface IDoom3Token {
  reset(): void
  isString(str: string): boolean
  readonly type: ETokenType
  getString(): string
  getFloat(): number
  getInt(): number
}
export interface IDoom3Tokenizer extends IEnumerator<IDoom3Token> {
  createIDoom3Token(): IDoom3Token
  setSource (source: string): void
  reset(): void
  _getNextToken(token: IDoom3Token): boolean
}
export interface IEnumerator<T> {
  reset(): void
  moveNext(): boolean
  readonly current: T
}
export class Doom3Factory {
  public static createDoom3Tokenizer(): IDoom3Tokenizer {
    const ret: IDoom3Tokenizer = new Doom3Tokenizer()
    return ret
  }
}


class Doom3Token implements IDoom3Token {
  private _type!: ETokenType
  // private _charArr: string[] = []
  private _charArr: Array<string> = new Array<string>()
  private _val!: number
  public constructor() {
    this.reset()
  }
  public reset(): void {
    this._charArr.length = 0
    this._type = ETokenType.NONE
    this._val = 0.0
  }
  public get type(): ETokenType {
    return this._type
  }
  public getString(): string {
    return this._charArr.join("")
  }
  public getFloat(): number {
    return this._val
  }
  public getInt(): number {
    return parseInt(this._val.toString(), 10)
  }
  public isString(str: string): boolean {
    let count: number = this._charArr.length
    if (str.length !== count) {
      return false
    }
    for (let i: number = 0; i < count; i++){
      if (this._charArr[i] !== str[i]) {
        return false
      }
    }
    return true
  }
  public addChar(c: string): void {
    this._charArr.push(c)
    console.log(this._charArr)
  }
  public setVal(num: number): void {
    this._val = num
    this._type = ETokenType.NUMBER
  }
  public setType(type: ETokenType): void {
    this._type = type
  }
}

class Doom3Tokenizer implements IDoom3Tokenizer {
  public createIDoom3Token(): IDoom3Token {
    return new Doom3Token()
  }
  private _digits: string[] = ['0','1','2','3','4','5','6','7','8','9']
  private _whiteSpaces: string[] = [' ', '\t', '\v', '\n']
  private _specialChar: string[] = ['(', ')', '[', ']', '{', '}', ',', '.']
  private _source: string = "Doom3Tokenizer"
  private _currIdx: number = 0

  private _current: IDoom3Token = new Doom3Token()
  public moveNext(): boolean {
    return this._getNextToken(this._current)
  }
  public get current(): IDoom3Token {
    return this._current
  }

  private _isDigit(c: string): boolean { // 判断某个字符是不是数字
    // console.log('_isDigit调用结果：' + this._digits.some((item: string) => item === c))
    return this._digits.some((item: string) => item === c)
  }
  private _isWhitespace(c: string): boolean {
    return this._whiteSpaces.some((item: string) => item === c)
  }
  public setSource(source: string): void {
    this._source = source
    this._currIdx = 0
  }

  public reset(): void {
    // console.log('调用reset _currIdx 重置了')
    this._currIdx = 0
  }
  private _getChar(): string {
    // console.log('调用_getChar=>_currIdx：' + this._currIdx)
    if (this._currIdx >= 0 && this._currIdx < this._source.length) {
      return this._source.charAt(this._currIdx++)
    }
    return ''
  }
  private _peekChar(): string {
    if (this._currIdx >= 0 && this._currIdx < this._source.length) {
      return this._source.charAt(this._currIdx)
    }
    return ''
  }
  private _ungetChar(): void {
    // console.log(`调用_ungetChar=>_currIdx：${this._currIdx - 1}`)
    if (this._currIdx > 0) {
      --this._currIdx
    }
  }
  private _skipWhitespace(): string {
    let c: string = ''
    do {
      c = this._getChar()
    } while (c.length > 0 && this._isWhitespace(c))
    return c
  }
  private _skipComments0(): string {
    let c: string = ''
    do {
      c = this._getChar()
    } while (c.length > 0 && c !== '\n')
    return c
  }
  private _skipComments1(): string {
    let c: string = ''
    c = this._getChar()
    do {
      c = this._getChar()
    } while(c.length > 0 && (c !== '*' || this._peekChar() !== '/'))
    c= this._getChar()
    return c
  }
  public _getNextToken(tok: IDoom3Token): boolean {
    let token: Doom3Token = tok as Doom3Token
    let c: string = ''
    token.reset()
    // console.log('调用getNextToken=>_currIdx：' + this._currIdx)
    do {
      c = this._skipWhitespace()
      if (c === '/' && this._peekChar() === '/') { // 跳过单行注释
        c = this._skipComments0()
        console.log(c)
      } else if (c === '/' && this._peekChar() === '*') { // 跳过多行注释
        c = this._skipComments1()
        console.log(c)
      } else if (this._isDigit(c) || c === '-' || c === '+' || (c === '.' && this._isDigit(this._peekChar()))) {
        this._ungetChar()
        this._getNumber(token)
        return true
      } else if (c === '\"' || c === '\'') {
        this._getSubstring(token, c)
        return true
      } else if (c.length > 0) {
        this._ungetChar()
        this._getString(token)
        return true
      }
    } while (c.length > 0)
    return false
  }
  public _getNumber(token: Doom3Token): void { // 解析数字类型
    let val: number = 0.0 // 数字解析结果
    let isFloat: boolean = false // 是否为浮点数
    let scaleValue: number = 0.1 // 小数点后面的数字从左到右就是0.1 0.1*0.1 0.1*0.1*0.1
    let c: string = this._getChar() // 进入这一步之前 调用了_ungetChar
    // console.log('调用_getNumber=>c：' + c)
    let isNegate: boolean = (c === '-') // 预先判断是否为负数
    let consumed: boolean = false // 循环第一次与第n+1次的区别标识
    let ascii0 = '0'.charCodeAt(0) // 获取0 ASCII编码
    do {
      token.addChar(c)
      if (c === '.') {
        isFloat = true
      } else if (c !== '-' && c !== '+') {
        let ascii: number = c.charCodeAt(0)
        let vc: number = (ascii - ascii0)
        if (!isFloat) { // 整数算法
          val = 10 * val + vc
        } else { // 如果是小数 每调用一次这块代码 小数点后增加一位 即 0.1 0.11 0.111
          val = val + scaleValue * vc
          scaleValue *= 0.1
        }
      }
      // 循环第二次开始就为true了 一开始循环时是在循环体外调用_getChar 后面就是在循环体里面了
      if(consumed === true) {
        this._getChar()
      }
      c = this._peekChar()
      // console.log('调用_getNumber=>c：' + c)
      consumed = true
      // 长度大于0 并且得是数字 或者  不是浮点数但是是.的 因为如果已经是浮点数了 那么不能再次出现.了
    } while (c.length > 0 && (this._isDigit(c) || (!isFloat && c === '.')))
    if (isNegate) {
      val = -val
    }
    token.setVal(val)
  }
  public _getSubstring(token: Doom3Token, endChar: string): void {
    let end: boolean = false
    let c: string = ''
    token.setType(ETokenType.STRING)
    do {
      c = this._getChar()
      if (c === endChar) {
        end = true
      } else {
        token.addChar(c)
      }
    } while(c.length > 0 && c !== '\n' && !end)
  }
  public _getString(token: Doom3Token): void {
    let c: string = this._getChar()
    token.setType(ETokenType.STRING)
    do {
      token.addChar(c)
      if (!this._isSpecialChar(c)) {
        c = this._getChar()
      }
    } while (c.length > 0 && !this._isWhitespace(c) && !this._isSpecialChar(c))
    // console.log(this._currIdx)
  }
  private _isSpecialChar(c: string): boolean {
    return this._specialChar.includes(c)
  }
}

// let str: string = `[3.14, -3.14,  .14, -.14, 3., -3., +3.14]`
let str: string = `
    numMeshes  5
    /*
    * joints关键字定义了骨骼动画的bindPose
    */
   joints  {
     "origin" -1 ( 0 0 0 ) ( -0.5 -0.5 -0.5 )
     "Body"  0 ( -12 0 79 ) ( -0.5-0.5-0.5 )
     //origin
   }
`
let tokenizer = Doom3Factory.createDoom3Tokenizer()
// let token = tokenizer.createIDoom3Token()
tokenizer.setSource(str)
export function test(): void {
  tokenizer.moveNext()
  if (tokenizer.current.type === ETokenType.NUMBER) {
    console.log("NUMBER：" + tokenizer.current.getFloat())
  } else {
    console.log("STRING:" + tokenizer.current.getString())
  }
}
const dom: HTMLElement | null = document.getElementById('btn')
if (dom !== null) {
  dom.addEventListener('click', () => {
    test()
  })
}

