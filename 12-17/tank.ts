import { CanvasKeyBoardEvent, CanvasMouseEvent } from './application.js'
import { TestApplication} from './applicationTest.js'
import { Math2D, vec2 } from './vec2.js'

export class Tank {
  // 坦克大小
  public width: number = 80
  public height: number = 50
  // 坦克位置
  public x: number = 100
  public y: number = 100
  public scaleX: number = 1.0
  public scaleY: number = 1.0
  // 坦克当前的旋转角度
  public tankRotation: number = 0 // 旋转180° 对应的旋转角度为Math.PI(3.145926) 旋转360°则为2 * Math.PI
  // 炮塔当前的旋转角度
  public turretRotation: number = 0

  public initYAxis: boolean = true // tank初始化时是否朝着y轴正方向
  public showLine: boolean = false // 是否显示坦克原点与画布中心点和目标点之间的连线
  public showCoord: boolean = false // 是否显示坦克本身的局部坐标系
  public gunLength: number = Math.max(this.width, this.height) // 炮管长度, defualt情况下为坦克width,height中最大的值
  public gunMuzzleRadius: number = 5 // 炮口半径


  // 鼠标坐标
  public targetX: number = 0
  public targetY: number = 0

  // 移动速率
  public linearSpeed: number = 100.0

  // 炮塔旋转速度
  public turretRotateSpeed: number = Math2D.toRadian(10)

    // 向量
  public pos: vec2 = new vec2(100, 100)
  public target: vec2 = new vec2()
  
  // private _moveTowardTo(intervalSec: number): void {
  //   const diffX: number = this.targetX - this.x
  //   const diffY: number = this.targetY - this.y
  //   const currSpeed: number = this.linearSpeed * intervalSec

  //   if ((diffX * diffX + diffY * diffY) > currSpeed * currSpeed) {
  //     let rot: number = this.tankRotation
  //     if (this.initYAxis) {
  //       rot += Math.PI / 2
  //     }
  //     this.x = this.x + Math.cos(rot) * currSpeed
  //     this.y = this.y + Math.sin(rot) * currSpeed
  //   }
  // }
  public _moveTowardTo(intervalSec: number): void { // 向量移动
    let dir: vec2 = vec2.difference(this.target, this.pos) // 目标点减去当前位置 得到向量dir
    console.log(this.pos, this.target)
    console.log(JSON.stringify(dir.values))
    dir.normalize() // 获取dir单位向量(方向)
    console.log(JSON.stringify(dir.values), JSON.stringify(this.pos.values), this.linearSpeed * intervalSec)
    this.pos = vec2.scaleAdd(this.pos, dir, this.linearSpeed * intervalSec)
    console.log('12312312312312333333333333333333333')
    this.x = this.pos.x
    this.y = this.pos.y
  }


  public _lookAt(): void {
    let diffX: number = this.targetX - this.x
    let diffY: number = this.targetY - this.y
    let radian = Math.atan2(diffY, diffX)
    if (this.initYAxis) {
      radian -= Math.PI / 2
    }
    this.tankRotation = radian
  }

  public update(intervalSec: number): void {
    this._moveTowardTo(intervalSec)
  }

  public onMouseMove(evt: CanvasMouseEvent): void {
    // 三角函数
    this.targetX = evt.canvasPosition.x
    this.targetY = evt.canvasPosition.y
    // 向量
    this.target.values[0] = evt.canvasPosition.x
    this.target.values[1] = evt.canvasPosition.y
    this._lookAt()
  }

  public onKeyPress(e: CanvasKeyBoardEvent): void {
    if (e.key === 'r') {
      this.turretRotation += this.turretRotateSpeed
    } else if (e.key === 't') {
      this.turretRotation = 0
    } else if (e.key === 'e') {
      this.turretRotation -= this.turretRotateSpeed
    }
  }

  public draw(app: TestApplication): void {
    if (app.context2D === null) return
    app.context2D.save()
    app.context2D.translate(this.x, this.y)
    app.context2D.rotate(this.initYAxis ? this.tankRotation - Math.PI * 0.5 : this.tankRotation)
    app.context2D.scale(this.scaleX, this.scaleY)


    // 绘制坦克底盘
    app.context2D.save()
    app.context2D.fillStyle = '#999'
    app.context2D.beginPath()
    if (this.initYAxis) {
      app.context2D.rect(-this.width * 0.5, -this.height * 0.5, this.width, this.height)
    } else {
      app.context2D.rect(-this.height * 0.5, -this.width * 0.5, this.height, this.width)
    }
    app.context2D.fill()
    app.context2D.restore()

    // 椭圆炮塔
    app.context2D.save()
    app.context2D.rotate(this.turretRotation)
    app.context2D.fillStyle = 'pink'
    app.context2D.beginPath()
    if (this.initYAxis) {
      app.context2D.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2)
    } else {
      app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2)
    }
    app.context2D.fill()

    // 炮管
    app.context2D.strokeStyle = 'lightblue'
    app.context2D.lineWidth = 5
    app.context2D.lineCap = 'round'
    app.context2D.beginPath()
    app.context2D.moveTo(0, 0)
    if (this.initYAxis) {
      app.context2D.lineTo(-this.gunLength, 0)
    } else {
      app.context2D.lineTo(0, this.gunLength)
    }
    app.context2D.stroke()

    // 炮口
    if (this.initYAxis) {
      app.context2D.translate(-this.gunLength, 0)
      app.context2D.translate(-this.gunMuzzleRadius, 0)
    } else {
      app.context2D.translate(0, this.gunLength)
      app.context2D.translate(0, this.gunMuzzleRadius)
    }
    app.fillCircle(0, 0, 5, 'grey')
    app.context2D.restore()

    // 坦克前方
    app.context2D.save()
    if (this.initYAxis) {
      app.context2D.translate(-this.width * 0.5, 0)
    } else {
      app.context2D.translate(0, this.width * 0.5)
    }
    app.fillCircle(0, 0, 10, 'lightgreen')
    app.context2D.restore()

    if (this.showCoord) {
      app.context2D.save()
      app.context2D.lineWidth = 1
      app.context2D.lineCap = 'round'
      app.strokeCoord(0, 0, this.width * 1.2, this.height * 1.2)
      app.context2D.restore()
    }
    app.context2D.restore()

    app.context2D.save()
    app.strokeLine(this.x, this.y, app.canvas.width * 0.5, app.canvas.height * 0.5)
    app.strokeLine(this.x, this.y, this.targetX, this.targetY)
    app.context2D.restore()
  }
}