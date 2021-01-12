import { Canvas2D } from './canvas2d/Canvas2D.js'

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement
if (canvas === null) {
  alert('获取canvas实例失败')
  throw new Error('获取canvas实例失败')
}
let canvas2d: Canvas2D = new Canvas2D(canvas)
canvas2d.drawText('hello world')