let posX: number = 0
let speedX: number = 10

function update(timestamp: number, elapsedMsec: number, intervalMsec: number): void {
  let t: number = intervalMsec / 1000
  posX += speedX * t
  console.log("posX：" + posX)
}

function render(ctx: CanvasRenderingContext2D | null): void {
  console.log("render")
}

let start: number = 0
let lastTime: number = 0
let count: number = 0
function step(timestamp: number) {
  if (!start) start = timestamp
  if (!lastTime) lastTime = timestamp
  let elapsedMsec = timestamp - start
  let intervalMsec = timestamp - lastTime
  lastTime = timestamp
  update(timestamp, elapsedMsec, intervalMsec)
  render(null)
  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)