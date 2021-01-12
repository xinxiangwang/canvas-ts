import { Application, CanvasKeyBoardEvent, CanvasMouseEvent, Canvas2DApplication } from './application.js'
import { Math2D, Rectangle, Size, vec2 } from './vec2.js'
import { Tank } from './tank.js'

type Repeatition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'

type TextBaseline = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'

type FontType = '10px sans-serif' | '15px sans-serif' | '20px sans-serif' | '25px sans-serif'

type FontStyle = 'normal' | 'italic' | 'oblique'

type FontVariant = 'normal' | 'small-caps'

type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

type FontSize = '10px' | '12px' | '16px' | '18px' | '24px' | '50%' | '75%' | '100%' | '125%' | '150%' | 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large'

type FontFamily = 'sans-serif' | 'serif' | 'courier' | 'fantasy' | 'monospace'

export enum ELayout {
  LEFT_TOP,
  RIGHT_TOP,
  RIGHT_BOTTOM,
  LEFT_BOTTOM,
  CENTER_MIDDLE,
  CENTER_TOP,
  RIGHT_MIDDLE,
  CENTER_BOTTOM,
  LEFT_MIDDLE,
}

export enum EImageFillType {
  STRETCH,
  REPEAT,
  REPEAT_X,
  REPEAT_Y
}

class RenderState {
  public lineWidth: number = 1
  public strokeStyle: string = 'red'
  public fillStyle: string = 'green'

  public clone(): RenderState {
    let state: RenderState = new RenderState()
    state.lineWidth = this.lineWidth
    state.strokeStyle = this.strokeStyle
    state.fillStyle = this.fillStyle
    return state
  }

  public toString(): string {
    return JSON.stringify(this, null, '')
  }
}

class RenderStateStack {
  private _stack: Array<RenderState> = [new RenderState()]
  private get _currentState(): RenderState {
    return this._stack[this._stack.length - 1]
  }
  public save(): void {
    this._stack.push(this._currentState.clone())
  }
  public restore(): void { // 删除第一个元素
    this._stack.pop()
  }

  public get lineWidth(): number {
    return this._currentState.lineWidth
  }
  public set lineWidth(value: number) {
    this._currentState.lineWidth = value
  }

  public get strokeStyle(): string {
    return this._currentState.strokeStyle
  }
  public set stokeStyle(value: string) {
    this._currentState.strokeStyle = value
  }

  public get fillStyle(): string {
    return this._currentState.strokeStyle
  }
  public set fillStyle(value: string) {
    this._currentState.strokeStyle = value
  }

  public printCurrentStateInfo(): void {
    console.log(this._currentState.toString())
  }
}

export class TestApplication extends Canvas2DApplication {
  private _lineDashOffset: number = 0 // 虚线边框间隔
  public _linearGradient!: CanvasGradient
  public _radialGradient!: CanvasGradient
  public _pattern!: CanvasPattern | null

  // 鼠标移动
  private _mouseX: number = 0
  private _mouseY: number = 0

  // 公转与自转
  private _rotationSunSpeed: number = 50 // 太阳自传角速度 以角为单位
  private _rotationMoonSpeed: number = 100 // 月球自转的角速度 以角为单位
  private _revolutionSpeed: number = 60 // 月球公转的角速度
  private _rotationSun: number = 0 // 太阳自转的角位移
  private _rotationMoon: number = 0 // 月亮自转的角位移
  private _revolution: number = 0 // 月亮围绕太阳公转的角位移

  private _tank: Tank

  

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.addTimer(this.timeCallback.bind(this), 0.033)
    this.isSupportMouseMove = true

    this._tank = new Tank()
    this._tank.x = canvas.width * 0.5
    this._tank.y = canvas.height * 0.5
    // this._tank.tankRotation = Math2D.toRadian(30)
    // this._tank.turretRotation = Math2D.toRadian(-60)
  }

  public drawTank(): void {
    this._tank.draw(this)
  }

  public static Colors: Array<string> = [
    'aqua', // 浅绿色
    'black', // 黑色
    'blue', // 蓝色
    'fuchsia', // 紫红色
    'gray', // 灰色
    'green', // 绿色
    'lime', // 绿黄色
    'marron', // 褐红色
    'navy', // 海军蓝色
    'olive', // 橄榄色
    'orange', // 橘色
    'purple', // 紫色
    'red', // 红色
    'silver', // 银灰色
    'teal', // 蓝绿色
    'white', // 白色
    'yellow', // 黄册
  ]

  public static makeFontString( // 设置字体
    size: FontSize = '10px',
    weight: FontWeight = 'normal',
    style: FontStyle = 'normal',
    variant: FontVariant = 'normal',
    family: FontFamily = 'sans-serif'
  ): string {
    let strs: Array<string> = []
    strs.push(style)
    strs.push(variant)
    strs.push(weight)
    strs.push(size)
    strs.push(family)
    return strs.join(' ')
  }

  private _updareLineDashOffset(): void {
    this._lineDashOffset++
    if (this._lineDashOffset > 10000) {
      this._lineDashOffset = 0
    }
  }

  public timeCallback(id: number, data: any): void {
    this._updareLineDashOffset()
    this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20)
  }

  private _drawRect(x: number, y: number, w: number, h: number): void { // 绘制基本矩形
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.fillStyle = 'rgba(0, 255, 0, 0.5)'
      this.context2D.strokeStyle = 'rgb(0, 0, 255)'
      this.context2D.lineWidth = 2
      this.context2D.lineCap = 'butt'
      this.context2D.setLineDash([10, 5])
      this.context2D.lineDashOffset = this._lineDashOffset
      this.context2D.beginPath()
      this.context2D.moveTo(x, y)
      this.context2D.lineTo(x + w, y)
      this.context2D.lineTo(x + w, y + h)
      this.context2D.lineTo(x, y + h)
      this.context2D.closePath()
      this.context2D.fill()
      this.context2D.stroke()
      this.context2D.restore()
    }
  }

  public fillLinearRect(x: number, y: number, w: number, h: number): void { // 绘制渐变矩形
    if (this.context2D !== null) {
      // this.context2D.save()
      if (this._linearGradient === undefined) {
        // 从右到左渐变
        this._linearGradient = this.context2D.createLinearGradient(x, y, x + w, y)
        this._linearGradient.addColorStop(0.0, 'green')
        this._linearGradient.addColorStop(0.25, 'rgba(255, 0, 0, 1)')
        this._linearGradient.addColorStop(0.5, 'green')
        this._linearGradient.addColorStop(0.75, '#0000FF')
        this._linearGradient.addColorStop(1, 'black')
        console.log(x, y, x + w, y)
        console.log(this._linearGradient, this.context2D)
        this.context2D.fillStyle = this._linearGradient
        this.context2D.beginPath()
        // this.context2D.rect() // 绘制矩形
        this.context2D.fillRect(x, y, w, h) // 填充
        // this.context2D.restore()
      }
    }
  }

  public fillRadialRect(x: number, y: number, w: number, h: number): void { // 绘制放射渐变
    if (this.context2D !== null) {
      this.context2D.save()
      if (this._radialGradient === undefined) {
        let centX: number = x + w * 0.5
        let centY: number = y + h * 0.5
        let radius: number = Math.min(w, h) // 选择矩形宽度小的作为圆形直径
        radius *= 0.5
        this._radialGradient = this.context2D.createRadialGradient(centX, centY, radius * 0.1, centX, centY, radius)
        this._radialGradient.addColorStop(0.0, 'black')
        this._radialGradient.addColorStop(0.25, 'rgba(255, 0, 0, 1)')
        this._radialGradient.addColorStop(0.5, 'green')
        this._radialGradient.addColorStop(0.75, '#0000FF')
        this._radialGradient.addColorStop(1.0, 'white')
        this.context2D.fillStyle = this._radialGradient
        this.context2D.fillRect(x, y, w, h)
        this.context2D.restore()
      }
    }
  }

  public fillPatternRect(x: number, y: number, w: number, h: number): void { // 绘制图案填充
    if (this.context2D !== null) {
      if (this._pattern === undefined) {
        let img: HTMLImageElement = document.createElement('img')
        let repeat: Repeatition = 'repeat'
        img.src = './img/gaiminka.png'
        img.onload = (e: Event): void => {
          if (this.context2D !== null) {
            this._pattern = this.context2D.createPattern(img, repeat)
            if (this._pattern === null) return
            this.context2D.save()
            this.context2D.fillStyle = this._pattern
            this.context2D.beginPath()
            this.context2D.fillRect(x, y, w, h)
            this.context2D.restore()
          }
        }
      } else {
        this.context2D.save()
        if (this._pattern === null) return
        this.context2D.fillStyle = this._pattern
        this.context2D.beginPath()
        this.context2D.fillRect(x, y, w, h)
        this.context2D.restore()
      }
    }
  }

  public fillCircle( // 绘制圆形 实心
    x: number,
    y: number,
    radius: number,
    fillStyle: string | CanvasGradient | CanvasPattern = 'red'
  ): void {
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.fillStyle = fillStyle
      this.context2D.beginPath()
      this.context2D.arc(x, y, radius, 0, Math.PI * 2)
      this.context2D.fill()
      this.context2D.restore()
    }
  }

  public strokeCircle( // 绘制圆形 空心
    x: number,
    y: number,
    radius: number,
    strokeStyle: string | CanvasGradient | CanvasPattern = 'red'
  ): void {
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.strokeStyle = strokeStyle
      this.context2D.beginPath()
      this.context2D.arc(x, y, radius, 0, Math.PI * 2)
      this.context2D.stroke()
      this.context2D.restore()
    }
  }

  public strokeRect( // 绘制矩形 空心
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle: string | CanvasGradient | CanvasPattern = 'red'
  ): void {
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.strokeStyle = strokeStyle
      this.context2D.lineWidth = 2
      this.context2D.rect(x, y, width, height)
      this.context2D.stroke()
      this.context2D.restore()
    }
  }

  public fillText( // 绘制文字
    text: string,
    x: number,
    y: number,
    color: string = 'white',
    align: TextAlign = 'left',
    baseline: TextBaseline = 'top',
    font: FontType = '10px sans-serif'
  ): void { // 绘制文字
    if (this.context2D === null) return
    this.context2D.save()
    this.context2D.textAlign = align
    this.context2D.textBaseline = baseline
    this.context2D.font = font
    this.context2D.fillStyle = color
    this.context2D.fillText(text, x, y)
    this.context2D.restore()
  }

  public fillRectangleWithColor(rect: Rectangle, color: string) { // 绘制指定颜色矩形
    const { x, y } = rect.origin
    const { width: w, height: h } = rect.size
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.fillStyle = color
      this.context2D.beginPath()
      this.context2D.moveTo(x, y)
      this.context2D.lineTo(x + w, y)
      this.context2D.lineTo(x + w, y + h)
      this.context2D.lineTo(x, y + h)
      this.context2D.closePath()
      this.context2D.fill()
      this.context2D.stroke()
      this.context2D.restore()
    }
  }

  public testCanvas2DTextLayout(): void { // 绘制各个位置的文字
    const x: number = 20 // 绘制的矩形外边距20
    const y: number = 20
    const width: number = this.canvas.width - x * 2 // 绘制的矩形宽度减去两个x外边距
    const height: number = this.canvas.height - y * 2
    let drawX: number = x
    let drawY: number = y
    const radius: number = 3 // 绘制原点
    this.fillRectWithTitle(x, y, width, height) // 绘制背景

    // 左上角
    this.fillText('左上角', drawX, drawY, 'red', 'left', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 右上角
    drawX = x + width
    drawY = y
    this.fillText('右上角', drawX, drawY, 'red', 'right', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 右下角
    drawX = x + width
    drawY = y + height
    this.fillText('右下角', drawX, drawY, 'red', 'right', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 左下角
    drawX = x
    drawY = y + height
    this.fillText('左下角', drawX, drawY, 'red', 'left', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 中心
    drawX = x + width * 0.5
    drawY = y + width * 0.5
    this.fillText('中心', drawX, drawY, 'red', 'center', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 中上
    drawX = x + width * 0.5
    drawY = y
    this.fillText('中上', drawX, drawY, 'red', 'center', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 中右
    drawX = x + width
    drawY = y + height * 0.5
    this.fillText('中右', drawX, drawY, 'red', 'right', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 中下
    drawX = x + width * 0.5
    drawY = y + height
    this.fillText('中下', drawX, drawY, 'red', 'center', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 中左
    drawX = x
    drawY = y + height * 0.5
    this.fillText('中下', drawX, drawY, 'red', 'left', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

  }

  public calcTextSize(text: string, char: string = 'W', scale: number = 0.5): Size { // 计算文字宽高
    if (this.context2D !== null) {
      let size = new Size()
      size.width = this.context2D.measureText(text).width
      let w: number = this.context2D.measureText(char).width
      size.height = w + w * scale
      return size
    } else {
      throw new Error('缺少context2D对象')
    }
  }

  public strokeLine(x0: number, y0: number, x1: number, y1: number): void { // 线段绘制
    if (this.context2D !== null) {
      this.context2D.beginPath()
      this.context2D.moveTo(x0, y0)
      this.context2D.lineTo(x1, y1)
      this.context2D.stroke()
    }
  }
  public strokeCoord(orginX: number, orginY: number, width: number, height: number): void { // 绘制坐标轴
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.strokeStyle = 'red'
      this.strokeLine(orginX, orginY, orginX + width, orginY)

      this.context2D.strokeStyle = 'blue'
      this.strokeLine(orginX, orginY, orginX, orginY + height)

      this.context2D.restore()
    }
  }

  public strokeGrid(color: string = 'grey', interval: number = 10): void { // 绘制网格
    if (this.context2D !== null) {
      this.context2D.save()
      this.context2D.strokeStyle = color
      this.context2D.lineWidth = 0.5
      for (let i: number = interval + 0.5; i < this.canvas.width; i += interval) {  // 绘制竖线
        this.strokeLine(i, 0, i, this.canvas.height)
      }
      for (let i: number = interval + 0.5; i < this.canvas.height; i += interval) {  // 绘制横线
        this.strokeLine(0, i, this.canvas.width, i)
      }
      this.context2D.restore()
      this.fillCircle(0, 0, 5, 'green')
      this.strokeCoord(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  public calcLocalTextRectangle( // 根据文字获取文字在各个位置的坐标
    layout: ELayout,
    text: string,
    parentWidth: number,
    parentHeight: number
  ): Rectangle {
    let s: Size = this.calcTextSize(text)
    let o: vec2 = vec2.create()
    let left: number = 0
    let top: number = 0
    let right: number = parentWidth - s.width
    let bottom: number = parentHeight - s.height
    let center: number = right * 0.5
    let middle: number = bottom * 0.5

    switch (layout) {
      case ELayout.LEFT_TOP:
        o.x = left
        o.y = top
        break
      case ELayout.RIGHT_TOP:
        o.x = right
        o.y = top
        break
      case ELayout.RIGHT_BOTTOM:
        o.x = right
        o.y = bottom
        break
      case ELayout.LEFT_BOTTOM:
        o.x = left
        o.x = bottom
        break
      case ELayout.CENTER_TOP:
        o.x = center
        o.y = top
        break
      case ELayout.RIGHT_MIDDLE:
        o.x = right
        o.y = middle
        break
      case ELayout.CENTER_BOTTOM:
        o.x = center
        o.y = bottom
        break
      case ELayout.LEFT_MIDDLE:
        o.x = left
        o.y = middle
        break
    }
    return new Rectangle(o, s)
  }

  public fillRectWithTitle( // 绘制文字周围的坐标
    x: number,
    y: number,
    width: number,
    height: number,
    title: string = '',
    layout: ELayout = ELayout.CENTER_MIDDLE,
    color: string = 'grey',
    showCoord: boolean = true
  ): void {
    if (this.context2D === null) return
    // 绘制矩形
    this.context2D.save()
    this.context2D.fillStyle = color
    this.context2D.beginPath()
    this.context2D.fillRect(x, y, width, height)
    if (title.length !== 0) {
      // 获取文字对应位置的坐标
      let rect: Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
      this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif')
      this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
      if (showCoord) {
        this.strokeCoord(x, y, width + 20, height + 20)
        this.fillCircle(x, y, 3)
      }
    }
    this.context2D.restore()
  }

  public fillLocalRectWithTitle(
    width: number, // 要绘制矩形的宽度
    height: number, // 高度
    title: string = '', // 矩形中字符串
    referencePt: ELayout = ELayout.LEFT_TOP, // 坐标系原点位置， 默认剧中
    layout: ELayout = ELayout.CENTER_MIDDLE, // 文字位置
    color: string = 'grey', // 填充颜色
    showCoord: boolean = false // 是否显示坐标系
  ): void {
    if (this.context2D !== null) {
      let x: number = 0
      let y: number = 0
      switch (referencePt) {
        case ELayout.LEFT_TOP:
          x = 0
          y = 0
          break
        case ELayout.LEFT_MIDDLE:
          x = 0
          y = - height * 0.5
          break
        case ELayout.LEFT_BOTTOM:
          x = 0
          y = - height
          break
        case ELayout.CENTER_TOP:
          x = - width * 0.5
          y = 0
          break
        case ELayout.CENTER_MIDDLE:
          x =  - width * 0.5
          y =  - height * 0.5
          break
        case ELayout.CENTER_BOTTOM:
          x =  - width * 0.5
          y =  - height
          break
        case ELayout.RIGHT_TOP:
          x =  - width
          y =  0
          break
        case ELayout.RIGHT_MIDDLE:
          x =  - width
          y =  - height * 0.5
          break
        case ELayout.RIGHT_BOTTOM:
          x =  - width
          y =  - height
          break
      }
      this.context2D.save()
      this.context2D.fillStyle = color
      this.context2D.beginPath()
      this.context2D.rect(x, y, width, height)
      this.context2D.fill()
      if (title.length !== 0) {
        let rect: Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
        this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'green', 'left', 'top', '10px sans-serif')
        this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)')
        this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
      }
      if (showCoord) {
        this.strokeCoord(0, 0, width + 20, height + 20)
        this.fillCircle(0, 0, 3)
      }
      this.context2D.restore()
    }
  }

  public testMyTextLayout(): void { // 自定义文字对其
    let x: number = 20
    let y: number = 20
    let width: number = this.canvas.width - x * 2
    let height: number = this.canvas.height - y * 2
    let right: number = x + width
    let bottom: number = y + height
    let drawX: number = x
    let drawY: number = y
    let drawWidth: number = 30
    let drawHeight: number = 30
    this.fillRectWithTitle(x, y, width, height, undefined, undefined, 'rgba(0, 0, 0, 0.6)')
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '左上', ELayout.LEFT_TOP, 'rgba(255, 255, 0, 0.2)')
    drawX = (right - drawWidth) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '中上', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawX = right - drawWidth
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '右上', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawX = right - drawWidth
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '右中', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '右下', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawX = (right - drawWidth) * 0.5
    drawY = bottom - drawHeight
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '中下', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawX = x
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '左下', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '左中', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
    drawX = (right - drawWidth) * 0.5
    drawY = (bottom - drawHeight) * 0.5
    this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, '中', ELayout.CENTER_TOP, 'rgba(255, 255, 0, 0.2)')
  }

  public loadAndDrawImage(url: string): void {
    let img: HTMLImageElement = document.createElement('img')
    img.src = url
    img.onload = (e: Event): void => {
      if (this.context2D !== null) {
        // this.context2D.drawImage(img, 10, 10)
        // this.context2D.drawImage(img, img.width + 30, 10, 200, img.height)
        // this.context2D.drawImage(img, 44, 6, 162, 175, 200, img.height + 30, 200, 130)
        const rect = Rectangle.create(10, 10, this.canvas.width - 20, this.canvas.height - 20)
        this.drawImage(img, rect, undefined, EImageFillType.REPEAT_Y)
      }
    }
  }

  public drawImage( // 绘制图像 REPEAT REPEAT_X REPEAT_Y STRENTH
    img: HTMLImageElement | HTMLCanvasElement,
    destRect: Rectangle,
    srcRect: Rectangle = Rectangle.create(0, 0, img.width, img.height),
    fillType: EImageFillType = EImageFillType.STRETCH): boolean {
    if (this.context2D === null) return false
    if (srcRect.isEmpty()) return false
    if (destRect.isEmpty()) return false
    if (fillType === EImageFillType.STRETCH) {
      this.context2D.drawImage(
        img,
        srcRect.origin.x,
        srcRect.origin.y,
        srcRect.size.width,
        srcRect.size.height,
        destRect.origin.x,
        destRect.origin.y,
        destRect.size.width,
        destRect.size.height
      )
    } else {
      this.fillRectangleWithColor(destRect, 'grey')
      let rows: number = Math.ceil(destRect.size.width / srcRect.size.width)
      let columns: number = Math.ceil(destRect.size.height / srcRect.size.height)
      let left: number = 0
      let top: number = 0
      let right: number = 0
      let bottom: number = 0
      let width: number = 0
      let height: number = 0

      let destRight: number = destRect.origin.x + destRect.size.width // 画布右边界
      let destBottom: number = destRect.origin.y + destRect.size.height // 画布下边界

      console.log(destRect, srcRect)

      if (fillType === EImageFillType.REPEAT_X) {
        columns = 1
      } else if (fillType === EImageFillType.REPEAT_Y) {
        rows = 1
      }

      for (let i: number = 0; i < rows; i++) { // 绘制水平方向图像
        for (let j: number = 0; j < columns; j++) { // 绘制垂直方向图像
          // 计算图像绘制的坐标点 左上角
          left = destRect.origin.x + i * srcRect.size.width
          top = destRect.origin.y + j * srcRect.size.height

          width = srcRect.size.width
          height = srcRect.size.height

          // 计算图像绘制坐标点 右下角
          right = left + width
          bottom = top + height
          if (right > destRight) {
            width = srcRect.size.width - (right - destRight)
          }

          if (bottom > destBottom) {
            height = srcRect.size.height - (bottom - destBottom)
          }

          this.context2D.drawImage(
            img,
            srcRect.origin.x,
            srcRect.origin.y,
            width,
            height,
            left,
            top,
            width,
            height
          )
        }
      }
    }
    return true
  }

  public getColorCanvas(amount: number = 32): HTMLCanvasElement { // 生成canvas dom
    let step: number = 4
    let canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.width = amount * step
    canvas.height = amount * step
    let context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (context === null) {
      alert('渲染失败')
      throw new Error('渲染失败')
    }

    for (let i: number = 0; i < step; i++) {
      for (let j: number = 0; j < step; j++) {
        let idx: number = step * i + j
        context.save()
        context.fillStyle = TestApplication.Colors[idx]
        context.fillRect(i * amount, j * amount, amount, amount)
        context.restore()
      }
    }
    console.log(canvas)
    return canvas
  }

  public drawColorCanvas(): void { // 绘制彩色canvas
    let colorsCanvas: HTMLCanvasElement = this.getColorCanvas(30)
    const rect = Rectangle.create(10, 10, this.canvas.width - 20, this.canvas.height - 20)
    this.drawImage(colorsCanvas, rect, undefined, EImageFillType.REPEAT)
  }

  public testChangePartCanvasImageData( // 改变指定位置canvas
    rRow: number = 2,
    rColum: number = 0,
    cRow: number = 1,
    cColum: number = 0,
    size: number = 30
  ): void {
    let colorCanvas: HTMLCanvasElement = this.getColorCanvas(size)
    let context: CanvasRenderingContext2D | null = colorCanvas.getContext('2d')
    if (context === null) return
    this.drawImage(colorCanvas, Rectangle.create(10, 10, colorCanvas.width, colorCanvas.height))
    let imgData: ImageData = context.createImageData(size, size)
    let data: Uint8ClampedArray = imgData.data // 默认为全是255值的数组 数组长度 size*size*4 每连续四个都是rgba值
    let rgbaCount: number = data.length
    for (let i = 0; i < rgbaCount; i++) { // 红色
      data[i * 4 + 0] = 255
      data[i * 4 + 1] = 0
      data[i * 4 + 2] = 0
      data[i * 4 + 3] = 255
    }
    context.putImageData(imgData, size * rColum, size * rRow, 0, 0, size, size) // 改变第三行第一列色块
    imgData = context.getImageData(0, 0, 300, 300)
    data = imgData.data
    let component: number = 0
    for (let i: number = 0; i < imgData.width; i++) {
      for (let j: number = 0; j < imgData.height; j++) {
        for (let k: number = 0; k < 4; k++) {
          let idx: number = (i * imgData.height + j) * 4 + k
          component = data[idx]
          if (idx % 4 !== 3) {
            data[idx] = 255 - component
          }
        }
      }
    }
    context.putImageData(imgData, size * cColum, size * cRow, 0, 0, size, size)
    this.drawImage(colorCanvas, Rectangle.create(150, 10, colorCanvas.width, colorCanvas.height))
  }

  public drawCanvasCoordCenter(): void { // 绘制中心坐标轴
    if (this.context2D === null) return
    let halfWidth: number = this.canvas.width * 0.5
    let halfHeight: number = this.canvas.height * 0.5
    this.context2D.save()
    this.context2D.lineWidth = 2
    this.context2D.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    this.strokeLine(0, halfHeight, this.canvas.width, halfHeight)
    this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height)
    this.context2D.restore()
    this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0, 0, 0, 0.5)')
  }

  public drawCoordInfo(info: string, x: number, y: number): void { // 指定位置绘制文字
    this.fillText(info, x, y, 'black', 'center', 'bottom')
  }

  public distance(x0: number, y0: number, x1: number, y1: number): number { // 计算两点之间的距离
    let diffX: number = x1 - x0
    let diffY: number = y1 - y0
    return Math.sqrt(diffX * diffX + diffY * diffY)
  }

  protected dispatchMouseMove(e: CanvasMouseEvent): void { // 鼠标移动回调
    this._mouseX = e.canvasPosition.x
    this._mouseY = e.canvasPosition.y
    this._tank.onMouseMove(e)
  }

  protected dispatchKeyPress(e: CanvasKeyBoardEvent): void {
    this._tank.onKeyPress(e)
  }

  public doTransform(degree: number, rotateFirst: boolean = true): void {
    if (this.context2D !== null) {
      let radians: number = Math2D.toRadian(degree)
      this.context2D.save()
      let x: number = this.canvas.width * 0.5
      let y: number = this.canvas.height * 0.5
      let width: number = 50
      let height: number = 30
      if (rotateFirst) {
        this.context2D.rotate(radians)
        this.context2D.translate(x, y)
      } else {
        this.context2D.translate(x, y)
        this.context2D.rotate(radians)
      }
      this.fillRectWithTitle(0, 0, width, height, 'asdasd')
      this.context2D.restore()
      let radius = this.distance(0, 0, x, y)
      this.strokeCircle(0, 0, radius, 'black')
    }
  }

  public rotateTranslate(
    degree: number,
    layout: ELayout = ELayout.LEFT_TOP,
    width: number = 40,
    height: number = 20
  ): void {
    if (this.context2D === null) return
    let x = this.canvas.width * 0.5
    let y = this.canvas.height * 0.5
    let radians: number = Math2D.toRadian(degree)
    this.context2D.save()
    this.context2D.rotate(radians)
    this.context2D.translate(x, y)
    this.fillLocalRectWithTitle(width, height, '', layout)
    
    this.context2D.restore()
  }

  public testFillLocalRectWithTitle(): void {
    if (this.context2D !== null) {
      this.rotateTranslate(0, ELayout.LEFT_TOP)
      this.rotateTranslate(10, ELayout.LEFT_MIDDLE)
      this.rotateTranslate(20, ELayout.LEFT_BOTTOM)
      this.rotateTranslate(30, ELayout.CENTER_TOP)
      this.rotateTranslate(40, ELayout.CENTER_MIDDLE)
      this.rotateTranslate(-40, ELayout.CENTER_BOTTOM)
      this.rotateTranslate(-10, ELayout.RIGHT_TOP)
      this.rotateTranslate(-20, ELayout.RIGHT_MIDDLE)
      this.rotateTranslate(-30, ELayout.RIGHT_BOTTOM)
      let x = this.canvas.width * 0.5
      let y = this.canvas.height * 0.5
      let radius = this.distance(0, 0, x, y)
      this.strokeCircle(0, 0, radius, 'black')
    }
  }

  public fillLocalRectWidthTitleUV( // 优化fillLocalRectWithTitle
    width: number,
    height: number,
    title: string = '',
    u: number = 0,
    v: number = 0,
    layout: ELayout = ELayout.CENTER_MIDDLE,
    color: string = 'grey',
    showCoord: boolean = true
  ): void {
    if (this.context2D !== null) {
      let x: number = -width * u
      let y: number = -height * v
      this.context2D.save()
      this.context2D.fillStyle = color
      this.context2D.beginPath()
      this.context2D.rect(x, y, width, height)
      this.context2D.fill()
      if (title.length !== 0) {
        let rect: Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
        this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'green', 'left', 'top', '10px sans-serif')
        this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0, 0, 0, 0.5)')
        this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
      }
      if (showCoord) {
        this.strokeCoord(0, 0, width + 20, height + 20)
        this.fillCircle(0, 0, 3)
      }
      this.context2D.restore()
    }
  }

  public translateRotateTranslateDrawRect( // u: x轴偏移量 1 为百分百   v: y轴偏移量 1 为百分百
    degree: number,
    u: number = 0,
    v: number = 0,
    radius = 200,
    width: number = 40,
    height: number = 20
  ): void {
    if (this.context2D === null) return
    let radians: number = Math2D.toRadian(degree)
    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5) // 坐标系移动到中心
    this.context2D.rotate(radians) // 旋转坐标系
    this.context2D.translate(radius, 0) // 移动坐标系
    this.fillLocalRectWidthTitleUV(width, height, '', u, v)
    this.context2D.restore()
  }

  public testFillLocalRectWidthTitleUV(): void {
    if (this.context2D === null) return
    let radius: number = 200
    let steps: number = 18

    for (let i = 0; i <= steps; i++) {
      let n: number = i / steps
      this.translateRotateTranslateDrawRect(i * 10, n, 0, radius)
    }

    for (let i = 0; i < steps; i++) {
      let n: number = i / steps
      this.translateRotateTranslateDrawRect(-i * 10, 0, n, radius)
    }

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 - radius * 0.4, this.canvas.height * 0.5 - radius * 0.4)
    this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 0.5, 0.5)
    this.context2D.restore()

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 + radius * 0.2, this.canvas.height * 0.5 - radius * 0.2)
    this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 0, 1)
    this.context2D.restore()

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 - radius * 0.1, this.canvas.height * 0.5 + radius * 0.1)
    this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 1, 0.2)
    this.context2D.restore()

    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5 + radius * 0.4, this.canvas.height * 0.5 + radius * 0.3)
    this.fillLocalRectWidthTitleUV(100, 60, 'u:0.5,v:0.5', 0.3, 0.7)
    this.context2D.restore()



  }

  public doLocalTransfrom(): void {
    if (this.context2D === null) return
    let width: number = 100
    let height: number = 60
    let coordWidth: number = width * 1.2
    let coordHeight: number = height * 1.2
    let radius: number = 5
    this.context2D.save()
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillCircle(0, 0, radius)
    this.fillLocalRectWithTitle(width, height, '1,初始状态')

    this.context2D.translate(this.canvas.width * 0.5, 10)
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillCircle(0, 0, radius)
    this.fillLocalRectWithTitle(width, height, '2,平移')

    this.context2D.translate(0, this.canvas.height * 0.5 - 10)
    this.strokeCoord(0, 0, coordWidth, coordHeight)
    this.fillCircle(0, 0, radius)
    this.fillLocalRectWithTitle(width, height, '3,平移到画布中心')

    this.context2D.rotate(Math2D.toRadian(-120))
    this.fillLocalRectWithTitle(width, height, '4,旋转-120')

    this.strokeCoord(0, 0, coordWidth, coordHeight) // 旋转后 坐标系也变化了

    this.context2D.rotate(Math2D.toRadian(-130))
    this.fillLocalRectWithTitle(width, height, '5,旋转-130')
    this.strokeCoord(0, 0, coordWidth, coordHeight)

    this.context2D.translate(50, 100)
    this.fillLocalRectWithTitle(width, height, '6,局部平移100px')
    this.strokeCoord(0, 0, coordWidth, coordHeight)

    this.context2D.scale(1.5, 2.0)
    this.fillLocalRectWithTitle(width, height, '7,局部坐标系x轴放大1.5，y轴放大2倍', ELayout.LEFT_MIDDLE)
    this.strokeCoord(0, 0, coordWidth, coordHeight)

    this.fillCircle(0, 0, radius)

    this.context2D.restore()
  }

  public draw4Quadrant(): void { // 绘制象限
    if (this.context2D === null) return
    this.context2D.save()
    this.fillText("第一象限", this.canvas.width, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'right', 'bottom', '20px sans-serif')
    this.fillText("第二象限", 0, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'left', 'bottom', '20px sans-serif')
    this.fillText("第三象限", 0, 0, 'rgba(0, 0, 255, 0.5)', 'left', 'top', '20px sans-serif')
    this.fillText("第四象限", this.canvas.width, 0, 'rgba(0, 0, 255, 0.5)', 'right', 'top', '20px sans-serif')
    this.context2D.restore()
  }

  public rotationAndRevolutionSimulation(radius: number = 150): void { // 太阳公转自转
    console.log('绘制')
    if (this.context2D === null) return
    let rotationMoon: number = Math2D.toRadian(this._rotationMoon)
    let rotationSun: number = Math2D.toRadian(this._rotationSun)
    let revolution: number = Math2D.toRadian(this._revolution)
    this.context2D.save()
    this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5) // 1

    this.context2D.save()
    this.context2D.rotate(rotationSun) // 2 旋转坐标轴
    this.fillLocalRectWidthTitleUV(100, 100, '自转', 0.5, 0.5) // 2 绘制矩形
    this.context2D.restore() // 2 请除 2 中对坐标轴的操作

    this.context2D.save()
    this.context2D.rotate(revolution) // 3 旋转公转坐标轴
    this.strokeLine(0, 0, 1000, 0) // 月球自转原点就在这条线上
    this.context2D.translate(radius, 0) // 3 旋转后平移出去
    this.context2D.rotate(rotationMoon) // 3 旋转自转坐标轴
    this.fillLocalRectWidthTitleUV(80, 80, '自转 + 公转', 0.5, 0.5) // 3 绘制矩形
    this.context2D.restore() // 3 请除 3 中对坐标轴的操作

    this.context2D.restore() // 函数多次调用， 所以必须请除掉 1状态(改变的坐标轴)
  }

  public drawTriangle(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke: boolean = true
  ): void {
    if (this.context2D === null) return
    this.context2D.save()
    this.context2D.lineWidth = 3
    this.context2D.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    this.context2D.beginPath()
    this.context2D.moveTo(x0, y0)
    this.context2D.lineTo(x1, y1)
    this.context2D.lineTo(x2, y2)
    this.context2D.closePath()
    if (stroke) {
      this.context2D.stroke()
    } else {
      this.context2D.fill()
    }
    this.fillCircle(x2, y2, 5)
    this.context2D.restore()
  }

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
  public render(): void {
    if (this.context2D !== null) {
      this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.strokeGrid()
      this.drawCanvasCoordCenter()
      this.draw4Quadrant()

      // this.doTransform(0)
      // this.doTransform(20)
      // this.doTransform(-20)

      // this.testFillLocalRectWithTitle()
      // this.doLocalTransfrom()
      // this.testFillLocalRectWidthTitleUV()
      // this.rotationAndRevolutionSimulation()
      this.drawTank()

      this.drawCoordInfo(`[${this._mouseX}, ${this._mouseY}, ${this._tank.tankRotation.toFixed(2)}]`, this._mouseX, this._mouseY)
    }
  }
  
  public update(elapsedMsec: number, intervalSec: number): void {
    this._rotationMoon += this._rotationMoonSpeed * intervalSec
    this._rotationSun += this._rotationSunSpeed * intervalSec
    this._revolution += this._revolutionSpeed * intervalSec
    this._tank.update(intervalSec)
    // console.log(this._rotationMoon, this._rotationSun, this._revolution)
  }
  public test(color: string = 'black', num: number = 100): void {
    if (this.context2D === null) return
    this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context2D.strokeStyle = color
    this.context2D.lineWidth = 2
    let x = this.canvas.width * 0.5
    let y = this.canvas.height * 0.5
    this.context2D.save()

    this.context2D.translate(x, y)

    this.context2D.save()
    this.context2D.translate(x - num, y - num)
    this.context2D.strokeRect(0, 0, 100, 100)
    this.context2D.restore()

    this.context2D.strokeRect(0, 0, 100, 100)
    this.context2D.restore()
    
    this.context2D.strokeRect(0, 0, 100, 100)
    this.context2D.restore()
  }
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement

let app: Application = new TestApplication(canvas)


function timerCallback(id: number, data: string): void {
  console.log("当前调用Timer的id：" + id + "data：" + data)
}

let timer0: number = app.addTimer(timerCallback, 3, true)
let timer1: number = app.addTimer(timerCallback, 5, false)

app.update(0, 0)
app.render()
// app.test()
// app.test('green', 200)
let startButton: HTMLButtonElement | null = document.getElementById('start') as HTMLButtonElement
let stopButton: HTMLButtonElement | null = document.getElementById('stop') as HTMLButtonElement
startButton.onclick = (ev: MouseEvent): void => {
  app.start()
}
stopButton.onclick = (ev: MouseEvent): void => {
  app.stop()
}
