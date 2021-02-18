import { Math2D, vec2 } from './vec2.js';
var Tank = /** @class */ (function () {
    function Tank() {
        // 坦克大小
        this.width = 80;
        this.height = 50;
        // 坦克位置
        this.x = 100;
        this.y = 100;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        // 坦克当前的旋转角度
        this.tankRotation = 0; // 旋转180° 对应的旋转角度为Math.PI(3.145926) 旋转360°则为2 * Math.PI
        // 炮塔当前的旋转角度
        this.turretRotation = 0;
        this.initYAxis = true; // tank初始化时是否朝着y轴正方向
        this.showLine = false; // 是否显示坦克原点与画布中心点和目标点之间的连线
        this.showCoord = false; // 是否显示坦克本身的局部坐标系
        this.gunLength = Math.max(this.width, this.height); // 炮管长度, defualt情况下为坦克width,height中最大的值
        this.gunMuzzleRadius = 5; // 炮口半径
        // 鼠标坐标
        this.targetX = 0;
        this.targetY = 0;
        // 移动速率
        this.linearSpeed = 100.0;
        // 炮塔旋转速度
        this.turretRotateSpeed = Math2D.toRadian(10);
        // 向量
        this.pos = new vec2(100, 100);
        this.target = new vec2();
    }
    // private _moveTowardTo(intervalSec: number): void { // 三角函数移动
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
    Tank.prototype._moveTowardTo = function (intervalSec) {
        var dir = vec2.difference(this.target, this.pos); // 目标点减去当前位置 得到向量dir
        // console.log(this.pos, this.target)
        // console.log(JSON.stringify(dir.values))
        dir.normalize(); // 获取dir单位向量(方向)
        // console.log(JSON.stringify(dir.values), JSON.stringify(this.pos.values), this.linearSpeed * intervalSec)
        this.pos = vec2.scaleAdd(this.pos, dir, this.linearSpeed * intervalSec);
        // console.log('12312312312312333333333333333333333')
        this.x = this.pos.x;
        this.y = this.pos.y;
    };
    Tank.prototype._lookAt = function () {
        var diffX = this.targetX - this.x;
        var diffY = this.targetY - this.y;
        var radian = Math.atan2(diffY, diffX);
        if (this.initYAxis) {
            radian -= Math.PI / 2;
        }
        this.tankRotation = radian;
    };
    Tank.prototype.update = function (intervalSec) {
        this._moveTowardTo(intervalSec);
    };
    Tank.prototype.onMouseMove = function (evt) {
        // 三角函数
        this.targetX = evt.canvasPosition.x;
        this.targetY = evt.canvasPosition.y;
        // 向量
        this.target.values[0] = evt.canvasPosition.x;
        this.target.values[1] = evt.canvasPosition.y;
        this._lookAt();
    };
    Tank.prototype.onKeyPress = function (e) {
        if (e.key === 'r') {
            this.turretRotation += this.turretRotateSpeed;
        }
        else if (e.key === 't') {
            this.turretRotation = 0;
        }
        else if (e.key === 'e') {
            this.turretRotation -= this.turretRotateSpeed;
        }
    };
    Tank.prototype.draw = function (app) {
        if (app.context2D === null)
            return;
        app.context2D.save();
        app.context2D.translate(this.x, this.y);
        app.context2D.rotate(this.initYAxis ? this.tankRotation - Math.PI * 0.5 : this.tankRotation);
        app.context2D.scale(this.scaleX, this.scaleY);
        // 绘制坦克底盘
        app.context2D.save();
        app.context2D.fillStyle = '#999';
        app.context2D.beginPath();
        if (this.initYAxis) {
            app.context2D.rect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
        }
        else {
            app.context2D.rect(-this.height * 0.5, -this.width * 0.5, this.height, this.width);
        }
        app.context2D.fill();
        app.context2D.restore();
        // 椭圆炮塔
        app.context2D.save();
        app.context2D.rotate(this.turretRotation);
        app.context2D.fillStyle = 'pink';
        app.context2D.beginPath();
        if (this.initYAxis) {
            app.context2D.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2);
        }
        else {
            app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
        }
        app.context2D.fill();
        // 炮管
        app.context2D.strokeStyle = 'lightblue';
        app.context2D.lineWidth = 5;
        app.context2D.lineCap = 'round';
        app.context2D.beginPath();
        app.context2D.moveTo(0, 0);
        if (this.initYAxis) {
            app.context2D.lineTo(-this.gunLength, 0);
        }
        else {
            app.context2D.lineTo(0, this.gunLength);
        }
        app.context2D.stroke();
        // 炮口
        if (this.initYAxis) {
            app.context2D.translate(-this.gunLength, 0);
            app.context2D.translate(-this.gunMuzzleRadius, 0);
        }
        else {
            app.context2D.translate(0, this.gunLength);
            app.context2D.translate(0, this.gunMuzzleRadius);
        }
        app.fillCircle(0, 0, 5, 'grey');
        app.context2D.restore();
        // 坦克前方
        app.context2D.save();
        if (this.initYAxis) {
            app.context2D.translate(-this.width * 0.5, 0);
        }
        else {
            app.context2D.translate(0, this.width * 0.5);
        }
        app.fillCircle(0, 0, 10, 'lightgreen');
        app.context2D.restore();
        if (this.showCoord) {
            app.context2D.save();
            app.context2D.lineWidth = 1;
            app.context2D.lineCap = 'round';
            app.strokeCoord(0, 0, this.width * 1.2, this.height * 1.2);
            app.context2D.restore();
        }
        app.context2D.restore();
        app.context2D.save();
        app.strokeLine(this.x, this.y, app.canvas.width * 0.5, app.canvas.height * 0.5);
        app.strokeLine(this.x, this.y, this.targetX, this.targetY);
        app.context2D.restore();
    };
    return Tank;
}());
export { Tank };
