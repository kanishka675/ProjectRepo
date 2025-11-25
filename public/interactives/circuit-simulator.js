/**
 * Simple Circuit Simulator - Interactive electrical circuit builder
 * For Engineering modules (Grade 8)
 */

class CircuitSimulator extends Simulator {
    constructor(container, config) {
        super(container, Object.assign({
            width: 600,
            height: 400
        }, config));

        this.circuitType = 'series'; // 'series' or 'parallel'
        this.voltage = 9; // volts
        this.resistance = 10; // ohms
        this.numBulbs = 1;
        this.animationPhase = 0;
    }

    setupControls() {
        // Circuit type selector
        const typeDiv = document.createElement('div');
        typeDiv.style.margin = '10px';
        typeDiv.style.textAlign = 'center';

        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Circuit Type: ';
        typeLabel.style.fontWeight = 'bold';
        typeLabel.style.marginRight = '10px';

        const typeSelect = document.createElement('select');
        typeSelect.style.padding = '5px';
        typeSelect.innerHTML = `
            <option value="series">Series</option>
            <option value="parallel">Parallel</option>
        `;
        typeSelect.addEventListener('change', (e) => {
            this.circuitType = e.target.value;
            this.render();
        });

        typeDiv.appendChild(typeLabel);
        typeDiv.appendChild(typeSelect);
        this.container.appendChild(typeDiv);

        // Voltage slider
        this.addSlider('Battery Voltage (V)', 'voltage', 3, 12, 9, 1);

        // Number of bulbs
        this.addSlider('Number of Bulbs', 'numBulbs', 1, 3, 1, 1);

        // Animate button
        const animateBtn = this.addButton('⚡ Animate Current', () => {
            this.startAnimation();
        });

        // Info display
        const infoDiv = document.createElement('div');
        infoDiv.id = 'circuit-info';
        infoDiv.style.textAlign = 'center';
        infoDiv.style.margin = '10px';
        infoDiv.style.fontSize = '14px';
        this.container.appendChild(infoDiv);
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        const animate = () => {
            this.animationPhase = (this.animationPhase + 0.1) % (Math.PI * 2);
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();

        // Stop after 3 seconds
        setTimeout(() => {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }, 3000);
    }

    render() {
        this.clear();

        const voltage = this.state.voltage || this.voltage;
        const numBulbs = Math.floor(this.state.numBulbs || this.numBulbs);

        // Calculate current
        const totalResistance = this.circuitType === 'series' ?
            this.resistance * numBulbs :
            this.resistance / numBulbs;
        const current = voltage / totalResistance;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw title
        CanvasUtils.drawText(
            this.ctx,
            `${this.circuitType === 'series' ? 'Series' : 'Parallel'} Circuit`,
            centerX,
            30,
            '#333',
            'bold 18px Arial',
            'center'
        );

        if (this.circuitType === 'series') {
            this.drawSeriesCircuit(centerX, centerY, voltage, numBulbs, current);
        } else {
            this.drawParallelCircuit(centerX, centerY, voltage, numBulbs, current);
        }

        // Update info display
        const infoDiv = document.getElementById('circuit-info');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <strong>Voltage:</strong> ${voltage}V &nbsp;|&nbsp;
                <strong>Current:</strong> ${current.toFixed(2)}A &nbsp;|&nbsp;
                <strong>Total Resistance:</strong> ${totalResistance.toFixed(2)}Ω
            `;
        }
    }

    drawSeriesCircuit(centerX, centerY, voltage, numBulbs, current) {
        const width = 400;
        const height = 200;
        const left = centerX - width / 2;
        const right = centerX + width / 2;
        const top = centerY - height / 2;
        const bottom = centerY + height / 2;

        // Draw battery (left side)
        this.drawBattery(left + 50, centerY, voltage);

        // Draw wires and bulbs
        const bulbSpacing = (width - 150) / (numBulbs + 1);

        // Top wire
        CanvasUtils.drawLine(this.ctx, left + 80, top + 20, right - 30, top + 20, '#000', 3);

        // Draw bulbs on top wire
        for (let i = 0; i < numBulbs; i++) {
            const x = left + 100 + (i + 1) * bulbSpacing;
            this.drawBulb(x, top + 20, current > 0);

            // Animate current flow
            if (this.animationPhase && current > 0) {
                const offset = (this.animationPhase * 30) % 30;
                for (let j = 0; j < 3; j++) {
                    const electronX = x - 40 + offset + j * 30;
                    if (electronX < x + 40 && electronX > x - 40) {
                        CanvasUtils.drawCircle(this.ctx, electronX, top + 20, 3, '#FFD700');
                    }
                }
            }
        }

        // Right wire
        CanvasUtils.drawLine(this.ctx, right - 30, top + 20, right - 30, bottom - 20, '#000', 3);

        // Bottom wire
        CanvasUtils.drawLine(this.ctx, right - 30, bottom - 20, left + 80, bottom - 20, '#000', 3);

        // Complete circuit
        CanvasUtils.drawLine(this.ctx, left + 80, bottom - 20, left + 80, centerY + 30, '#000', 3);
        CanvasUtils.drawLine(this.ctx, left + 80, centerY - 30, left + 80, top + 20, '#000', 3);
    }

    drawParallelCircuit(centerX, centerY, voltage, numBulbs, current) {
        const width = 400;
        const height = 250;
        const left = centerX - width / 2;
        const right = centerX + width / 2;

        // Draw battery
        this.drawBattery(left + 50, centerY, voltage);

        // Main wires
        CanvasUtils.drawLine(this.ctx, left + 80, centerY - 30, left + 120, centerY - 30, '#000', 3);
        CanvasUtils.drawLine(this.ctx, left + 80, centerY + 30, left + 120, centerY + 30, '#000', 3);

        // Parallel branches
        const branchSpacing = height / (numBulbs + 1);
        for (let i = 0; i < numBulbs; i++) {
            const y = centerY - height / 2 + (i + 1) * branchSpacing;

            // Top connection
            CanvasUtils.drawLine(this.ctx, left + 120, centerY - 30, left + 120, y, '#000', 2);
            CanvasUtils.drawLine(this.ctx, left + 120, y, left + 250, y, '#000', 2);

            // Bulb
            this.drawBulb(left + 185, y, current > 0);

            // Bottom connection
            CanvasUtils.drawLine(this.ctx, left + 250, y, right - 120, y, '#000', 2);
            CanvasUtils.drawLine(this.ctx, right - 120, y, right - 120, centerY + 30, '#000', 2);
        }

        // Close circuit
        CanvasUtils.drawLine(this.ctx, right - 120, centerY + 30, left + 120, centerY + 30, '#000', 3);
    }

    drawBattery(x, y, voltage) {
        // Battery symbol
        CanvasUtils.drawLine(this.ctx, x, y - 30, x, y - 10, '#000', 4);
        CanvasUtils.drawLine(this.ctx, x, y + 10, x, y + 30, '#000', 4);
        CanvasUtils.drawLine(this.ctx, x - 15, y - 10, x + 15, y - 10, '#000', 3);
        CanvasUtils.drawLine(this.ctx, x - 10, y + 10, x + 10, y + 10, '#000', 3);

        // Voltage label
        CanvasUtils.drawText(this.ctx, `${voltage}V`, x + 25, y - 5, '#000', 'bold 14px Arial');

        // + and - symbols
        CanvasUtils.drawText(this.ctx, '+', x - 25, y - 15, '#FF0000', 'bold 16px Arial');
        CanvasUtils.drawText(this.ctx, '−', x - 25, y + 15, '#0000FF', 'bold 16px Arial');
    }

    drawBulb(x, y, isLit) {
        // Bulb circle
        CanvasUtils.drawCircle(
            this.ctx,
            x, y, 15,
            isLit ? '#FFEB3B' : '#FFF',
            '#000',
            2
        );

        // Filament
        this.ctx.beginPath();
        this.ctx.moveTo(x - 5, y - 5);
        this.ctx.lineTo(x + 5, y + 5);
        this.ctx.moveTo(x + 5, y - 5);
        this.ctx.lineTo(x - 5, y + 5);
        this.ctx.strokeStyle = isLit ? '#FF6F00' : '#999';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Glow effect if lit
        if (isLit) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#FFEB3B';
            CanvasUtils.drawCircle(this.ctx, x, y, 15, null, '#FFEB3B', 2);
            this.ctx.shadowBlur = 0;
        }
    }
}

// Register component
window.InteractiveRegistry.components['circuit-builder'] = CircuitSimulator;
