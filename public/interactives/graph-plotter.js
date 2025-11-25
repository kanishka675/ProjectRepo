/**
 * Graph Plotter - Interactive linear equation visualizer
 * For Math modules (Grade 8 and above)
 */

class GraphPlotter extends Simulator {
    constructor(container, config) {
        super(container, Object.assign({
            width: 600,
            height: 400
        }, config));

        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;
        this.scale = 20; // pixels per unit
    }

    setupControls() {
        this.addSlider('Slope (m)', 'slope', -5, 5, 1, 0.1);
        this.addSlider('Y-Intercept (b)', 'intercept', -10, 10, 0, 0.5);

        const info = document.createElement('div');
        info.style.textAlign = 'center';
        info.style.margin = '10px';
        info.style.fontSize = '18px';
        info.style.fontWeight = 'bold';
        info.id = 'equation-display';
        this.container.appendChild(info);
    }

    render() {
        this.clear();

        const { slope, intercept } = this.state;

        // Draw grid
        CanvasUtils.drawGrid(this.ctx, this.canvas.width, this.canvas.height, this.scale, '#f0f0f0');

        // Draw axes
        CanvasUtils.drawAxes(this.ctx, this.canvas.width, this.canvas.height, this.originX, this.originY, '#333');

        // Draw axis labels
        CanvasUtils.drawText(this.ctx, 'x', this.canvas.width - 20, this.originY + 20, '#333', '14px Arial');
        CanvasUtils.drawText(this.ctx, 'y', this.originX + 10, 20, '#333', '14px Arial');

        // Draw axis numbers
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                const x = this.originX + i * this.scale;
                const y = this.originY - i * this.scale;

                // X-axis numbers
                if (x >= 0 && x <= this.canvas.width) {
                    CanvasUtils.drawText(this.ctx, i.toString(), x, this.originY + 15, '#666', '10px Arial', 'center');
                }

                // Y-axis numbers
                if (y >= 0 && y <= this.canvas.height) {
                    CanvasUtils.drawText(this.ctx, i.toString(), this.originX - 20, y, '#666', '10px Arial', 'right', 'middle');
                }
            }
        }

        // Draw the line y = mx + b
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 3;

        for (let screenX = 0; screenX <= this.canvas.width; screenX++) {
            const x = (screenX - this.originX) / this.scale;
            const y = slope * x + intercept;
            const screenY = this.originY - y * this.scale;

            if (screenX === 0) {
                this.ctx.moveTo(screenX, screenY);
            } else {
                this.ctx.lineTo(screenX, screenY);
            }
        }
        this.ctx.stroke();

        // Highlight y-intercept point
        const interceptY = this.originY - intercept * this.scale;
        CanvasUtils.drawCircle(this.ctx, this.originX, interceptY, 6, '#FF5722', '#fff', 2);

        // Update equation display
        const equationDisplay = document.getElementById('equation-display');
        if (equationDisplay) {
            const slopeStr = slope >= 0 ? slope.toFixed(1) : `(${slope.toFixed(1)})`;
            const interceptStr = intercept >= 0 ? `+ ${intercept.toFixed(1)}` : `- ${Math.abs(intercept).toFixed(1)}`;
            equationDisplay.textContent = `y = ${slopeStr}x ${interceptStr}`;
            equationDisplay.style.color = '#2196F3';
        }
    }
}

// Register component
window.InteractiveRegistry.components['graph-plotter'] = GraphPlotter;
