const EPSILON = 0.00001
const PiBy180: number = 0.017453292519943295

export class vec2 {
  public values: Float32Array

  public constructor (x: number = 0, y: number = 0) {
    this.values = new Float32Array([x, y])
  }
  public static create(x: number = 0, y: number = 0): vec2 {
    return new vec2(x, y)
  }
  public static copy(src: vec2, result: vec2 | null = null) {
    if (result === null) result = new vec2()
    result.values[0] = src.values[0]
    result.values[1] = src.values[1]
    return result
  }
  public toString(): string {
    return `[${this.values[0]},${this.values[1]}]`
  }
  public get squaredLength(): number { // 返回没有开根号的向量大小
    let x = this.values[0]
    let y = this.values[1]
    return (x * x + y * y)
  }
  public get length(): number { // 返回开根号向量大小
    return Math.sqrt(this.squaredLength)
  }
  
  public normalize(): number { // 计算单位向量
    let len: number = this.length
    console.log(this.values)
    if (Math2D.isEquals(len, 0)) {
      this.values[0] = 0
      this.values[1] = 0
      return 0
    }
    if (Math2D.isEquals(len, 1)) { 
      return 1.0
    }

    this.values[0] /= len
    this.values[1] /= len
    return len
  }
  public static xAxis = new vec2(1, 0)
  public static YAxis = new vec2(0, 1)
  public static nXAxis = new vec2(-1, 0)
  public static nYAxis = new vec2(0, -1)

  public static sum(left: vec2, right: vec2, result: vec2 | null = null): vec2 { // 向量相加
    if (result === null) result = new vec2()
    result.values[0] = left.values[0] + right.values[0]
    result.values[1] = left.values[1] + right.values[1]
    return result
  }

  public add(right: vec2): vec2 {
    vec2.sum(this, right, this)
    return this
  }

  public static difference(end: vec2, start: vec2, result: vec2 | null = null): vec2 { // 向量相减
    if (result === null) result = new vec2()
    result.values[0] = end.values[0]  - start.values[0]
    result.values[1] = end.values[1] - start.values[1]
    return result
  }

  public substract(another: vec2): vec2 {
    vec2.difference(this, another, this)
    return this
  }

  public negative(): vec2 { // 负向量
    this.values[0] = -this.values[0]
    this.values[1] = -this.values[1]
    return this
  }

  public static scale(direction: vec2, scalar: number, result: vec2 | null = null): vec2 { // 向量相乘
    if (result === null) result = new vec2()
    result.values[0] = direction.values[0] * scalar
    result.values[1] = direction.values[1] * scalar
    return result
  }

  public static scaleAdd(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
    if (result === null) result = new vec2()
    vec2.scale(direction, scalar, result)
    return vec2.sum(start, result, result)
  }

  public static dotProduct(left: vec2, right: vec2): number { // 向量点乘
    return left.values[0] * right.values[0] + left.values[1] * right.values[1]
  }

  public innerProduct(right: vec2): number {
    return vec2.dotProduct(this, right)
  }

  public static getAngle(a: vec2, b: vec2, isRadian: boolean = false): number {
    let dot: number = vec2.dotProduct(a, b)
    let radian: number = Math.acos(dot / (a.length * b.length))
    if (isRadian === false) {
      radian = Math2D.toDegree(radian)
    }
    return radian
  }

  public static getOrientation(from: vec2, to: vec2, isRadian: boolean = false): number {
    let diff: vec2 = vec2.difference(to, from)
    let radian = Math.atan2(diff.y, diff.x)
    if (isRadian === false) {
      radian = Math2D.toDegree(radian)
    }
    return radian
  }

  public get x(): number { return this.values[0] }
  public set x(x: number) { this.values[0] = x }
  public get y(): number { return this.values[1] }
  public set y(y: number) { this.values[1] = y }
  public reset(x: number = 0, y: number = 0): vec2 {
    this.values[0] = x
    this.values[1] = y
    return this
  }
  public equals(vector: vec2): boolean {
    if (Math.abs(this.values[0] - vector.values[0]) > EPSILON) {
      return false
    }
    if (Math.abs(this.values[1] - vector.values[1]) > EPSILON) {
      return false
    }
    return true
  }
}

export class Size {
  public values: Float32Array
  public constructor(w: number = 1, h: number = 1) {
    this.values = new Float32Array([w, h])
  }
  public get width(): number { return this.values[0] }
  public set width(value: number) { this.values[0] = value }
  public get height(): number { return this.values[1] }
  public set height(value: number) { this.values[1] = value }

  public static create(w: number = 0, h: number = 0): Size {
    return new Size(w, h)
  }
}

export class Math2D {
  public static isEquals (left: number, right: number, espilon: number = EPSILON) : boolean {
    if (Math.abs(right - left) > espilon) {
        return false
    }
    return true
  }
  public static toDegree(radian: number): number {
    return radian / PiBy180
  }
  public static toRadian(degree: number): number {
    return degree * PiBy180
  }
  public static projectPointOnlineSegment(pt: vec2, start: vec2, end: vec2, closePoint: vec2): boolean {
    let v0: vec2 = vec2.create()
    let v1: vec2 = vec2.create()
    let d: number = 0
    vec2.difference(pt, start, v0)
    vec2.difference(end, start, v1)
    d = v1.normalize()
    let t: number = vec2.dotProduct(v0, v1)
    if (t < 0) {
      closePoint.x = start.x
      closePoint.y = start.y
      return false
    } else if (t > d) {
      closePoint.x = end.x
      closePoint.y = end.y
      return false
    } else {
      vec2.scaleAdd(start, v1, t, closePoint)
    }
    return true
  }
}

export class Rectangle {
  public origin: vec2
  public size: Size
  public constructor(orign: vec2 = new vec2(), size: Size = new Size(1, 1)) {
    this.origin = orign
    this.size= size
  }
  public static create(x: number = 0, y: number = 0, w: number = 1, h: number = 1): Rectangle {
    let origin: vec2 = new vec2(x, y)
    let size: Size = new Size(w, h)
    return new Rectangle(origin, size)
  }
  public isEmpty(): boolean {
    let area: number = this.size.width * this.size.height
    return Math2D.isEquals(area, 0) !== true
  }
}

