var Canvas2D = /** @class */ (function () {
    function Canvas2D(canvas) {
        this.context = canvas.getContext("2d");
    }
    Canvas2D.prototype.drawText = function (text) {
        if (this.context !== null) {
            this.context.save();
            this.context.textBaseline = 'middle';
            this.context.textAlign = 'center';
            var centerX = this.context.canvas.width * 0.5;
            var centerY = this.context.canvas.height * 0.5;
            this.context.fillStyle = 'red';
            this.context.fillText(text, centerX, centerY);
            this.context.strokeStyle = 'green';
            this.context.strokeText(text, centerY, centerY);
            this.context.restore();
        }
    };
    return Canvas2D;
}());
export { Canvas2D };
