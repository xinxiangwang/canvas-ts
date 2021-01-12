import { Canvas2D } from './canvas2d/Canvas2D.js';
var canvas = document.getElementById('canvas');
if (canvas === null) {
    alert('获取canvas实例失败');
    throw new Error('获取canvas实例失败');
}
var canvas2d = new Canvas2D(canvas);
canvas2d.drawText('hello world');
