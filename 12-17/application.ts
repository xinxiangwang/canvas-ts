import { vec2 } from './vec2.js'

export type TimerCallback = (id: number, data: any) => void
class Timer {
  public id: number = -1 // 计时器ID
  public enabled: boolean = false // 计时器是否有效
  public callback: TimerCallback // 回调
  public callbackData: any = undefined // 回调函数参数
  public countdown: number = 0 // 倒计时器
  public timeout: number = 0 // 任务执行时间间距 秒
  public onlyOnce: boolean = false // 是否只执行一次回调

  constructor(callback: TimerCallback) {
    this.callback = callback
  }
}

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

export class Application implements EventListenerObject {
  protected _start: boolean = false // 动画是否已经开始
  protected _requestId: number = -1 // requestAnimationFrame的ID
  protected _lastTime!: number // 动画结束时间
  protected _startTime!: number // 动画开始时间
  public canvas: HTMLCanvasElement // canvas实例

  private _fps: number = 0

  public timers: Array<Timer> = []
  private _timeId: number = -1

  public isSupportMouseMove: boolean
  protected _isMouseDown: boolean

  public get fps() {
    return this._fps
  }

  public removeTimer(id: number): boolean { // 根据任务id移除任务
    let timer = this.timers.find((item: Timer) => item.id === id)
    if (timer) {
      timer.enabled = false
    }
    return !!timer
  }

  public addTimer(
    callback: TimerCallback,
    timeout: number = 1.0,
    onlyOnce: boolean = false,
    data: any = undefined
  ): number {
    let timer: Timer
    // let found: boolean = false
    for (let i = 0; i < this.timers.length; i++) { // 如果存在enabled为false的任务，则更新这个任务
      let timer: Timer = this.timers[i]
      if(timer.enabled === false) {
        timer.callback = callback
        timer.callbackData = data
        timer.timeout = timeout
        timer.countdown = timeout
        timer.enabled = true
        timer.onlyOnce = onlyOnce
        return timer.id
      }
    }
    // 新建任务
    timer = new Timer(callback)
    timer.callbackData = data
    timer.timeout = timeout
    timer.countdown = timeout
    timer.enabled = true
    timer.id = ++this._timeId
    timer.onlyOnce = onlyOnce // 一次回调还是重复回调
    this.timers.push(timer)
    return timer.id
  }

  private _handleTimers(intervalSec: number): void {
    for (let i = 0; i < this.timers.length; i++) {
      let timer: Timer = this.timers[i]
      if (timer.enabled === false) {
        continue
      }
      // 任务运行时间5s一次的话 减去每次 requestAnimationFrame运行时间intervalSec， 到0.00就证明该运行了
      timer.countdown -= intervalSec
      if (timer.countdown < 0.0) {
        // console.log(timer.countdown)
        timer.callback(timer.id, timer.callbackData)
        if (timer.onlyOnce === false) { // 如果不是只运行一次 那么就初始化运行任务还差的时间
          timer.countdown = timer.timeout
        } else {
          this.removeTimer(timer.id) // 如果只运行一次 就直接 “删除”
        }
      }
    }
  }

  

  public constructor(canvas: HTMLCanvasElement | null) {
    if(canvas !== null) {
      this.canvas = canvas
      this.canvas.addEventListener('mousedown', this, false)
      this.canvas.addEventListener('mouseup', this, false)
      this.canvas.addEventListener('mousemove', this, false)
      window.addEventListener('keydown', this, false)
      window.addEventListener('keyup', this, false)
      window.addEventListener('keypress', this, false)
      this._isMouseDown = false
      this.isSupportMouseMove = false
    } else {
      alert('获取canvas实例失败')
      throw new Error('获取canvas实例失败')
    }
  }

  public handleEvent(evt: Event): void { // addEventListener 专用
    switch(evt.type) {
      case 'mousedown':
        this._isMouseDown = true
        this.dispatchMouseDown(this._toCanvasMouseEvent(evt))
        break
      case 'mouseup':
        this._isMouseDown = false
        this.dispatchMouseUp(this._toCanvasMouseEvent(evt))
        break
      case 'mousemove':
        if (this.isSupportMouseMove) {
          this.dispatchMouseMove(this._toCanvasMouseEvent(evt))
        }
        if (this._isMouseDown) {
          this.dispatchMouseDrag(this._toCanvasMouseEvent(evt))
        }
        break
      case 'keypress':
        this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt))
        break
      case 'keydown':
        this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt))
        break
      case 'keyup':
        this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt))
        break
    }
  }
  protected dispatchMouseDown(evt: CanvasMouseEvent): void {}
  protected dispatchMouseUp(evt: CanvasMouseEvent): void {}
  protected dispatchMouseMove(evt: CanvasMouseEvent): void {}
  protected dispatchMouseDrag(evt: CanvasMouseEvent): void {}
  protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {}
  protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {}
  protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {}

  public start(): void {
    if (!this._start) {
      this._start = true
      this._requestId = -1
      this._lastTime = -1
      this._startTime = -1
      // this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
      //   this.step(elapsedMsec)
      // })
      requestAnimationFrame((elapsedMsec: number): void => {
        this.step(elapsedMsec)
      })
    }
  }

  public stop(): void {
    if(this._start) {
      cancelAnimationFrame(this._requestId)
      this._start = false
      this._requestId = -1
      this._lastTime = -1
      this._startTime = -1
    }
  }

  public isRunning(): boolean {
    return this._start
  }

  protected step(timeStamp: number): void {
    if (this._startTime === -1) this._startTime = timeStamp
    if (this._lastTime === -1) this._lastTime = timeStamp
    // 当前时间节点与第一次调用时间节点的差
    let elapsedMsec: number = timeStamp - this._startTime
    // 当前时间节点与上一次时间节点的差
    let intervalSec: number = timeStamp - this._lastTime
    if (intervalSec !== 0) {
      this._fps = 1000.0 / intervalSec
    }
    intervalSec /= 1000.0 // 一秒60帧
    this._lastTime = timeStamp
    this._handleTimers(intervalSec)
    this.update(elapsedMsec, intervalSec)
    this.render()
    this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
      this.step(elapsedMsec)
    })
  }
  public update (elapsedMsec: number, intervalSec: number): void {}
  public render(): void {}

  private _viewportToCanvanCoordinate(evt: MouseEvent): vec2 {
    if (this.canvas) {
      let rect: ClientRect = this.canvas.getBoundingClientRect()
      if (evt.type === 'mousedown') {
        console.log('boundClientRect：' + JSON.stringify(rect))
        console.log('clientX：' + evt.clientX + '；clientY：' + evt.clientY)
      }
      let x: number = evt.clientX - rect.left
      let y: number = evt.clientY - rect.top
      return vec2.create(x, y)
    }
    alert('canvas为null')
    throw new Error('canvas为null')
  }
  private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
    let event: MouseEvent = evt as MouseEvent
    let mousePosition: vec2 = this._viewportToCanvanCoordinate(event)
    let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(
      mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey
    )
    return canvasMouseEvent
  }

  private _toCanvasKeyBoardEvent(evt: Event): CanvasKeyBoardEvent {
    let event: KeyboardEvent = evt as KeyboardEvent
    let canvasKeyBoardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(
      event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey
    )
    return canvasKeyBoardEvent
  }
  public test(color: string = 'black', num: number = 100): void{}
}

export enum EInputEventType {
  MOUSEEVENT,
  MOUSEDOWN,
  MOUSEUP,
  MOUSEMOVE,
  MOUSEDRAG,
  KEYBOARDEVENT,
  KEYUP,
  KEYDOWN,
  KEYPRESS
}

export class CanvasInputEvent {
  public altKey: boolean
  public ctrlKey: boolean
  public shiftKey: boolean

  public type: EInputEventType
  
  public constructor(
    altKey: boolean = false,
    ctrlKey: boolean = false,
    shiftKey: boolean = false,
    type: EInputEventType = EInputEventType.MOUSEEVENT
  ) {
    this.altKey = altKey
    this.ctrlKey = ctrlKey
    this.shiftKey = shiftKey
    this.type = type
  }
}

export class CanvasMouseEvent extends CanvasInputEvent {
  public button: number
  public canvasPosition: vec2
  public localPosition: vec2
  public constructor(
    canvasPos: vec2,
    button: number,
    altKey: boolean = false,
    ctrlKey: boolean = false,
    shiftKey: boolean = false
  ) {
    super(altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT)
    this.canvasPosition = canvasPos
    this.button = button
    this.localPosition = vec2.create()
  }
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
  public key: string
  public keyCode: number
  public repeat: boolean
  public constructor(
    key: string,
    keyCode: number,
    repeat: boolean,
    altKey: boolean = false,
    ctrlKey: boolean = false,
    shiftKey: boolean = false
  ) {
    super(altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT)
    this.key = key
    this.keyCode = keyCode
    this.repeat = repeat
  }
}

// export type Canvas2DContextAttributes = any

export class Canvas2DApplication extends Application {
    public context2D: CanvasRenderingContext2D | null
    public constructor (canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings) {
      super(canvas)
      this.context2D = this.canvas.getContext('2d', contextAttributes)
    }
}

export class WebGLApplication extends Application {
  public context3D: WebGLRenderingContext | null
  public constructor(canvas: HTMLCanvasElement, contextAttributes?: WebGLContextAttributes) {
    super(canvas)
    this.context3D = this.canvas.getContext('webgl', contextAttributes)
    if (this.context3D === null) {
      this.context3D = this.canvas.getContext('experimental-webgl', contextAttributes) as WebGLRenderingContext
      if (this.context3D === null) {
        alert('无法创建WebGLRenderingContext上下文对象')
        throw new Error('无法创建WebGLRenderingContext上下文对象')
      }
    }
  }
}
