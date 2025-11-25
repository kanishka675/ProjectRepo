/**
 * Cell Explorer - Interactive cell diagram
 * For Science modules (Grade 6-7)
 */

class CellExplorer extends InteractiveDiagram {
    constructor(container, config) {
        super(container, Object.assign({
            width: 600,
            height: 400
        }, config));

        // Cell organelles with positions and info
        this.organelles = [
            { name: 'Nucleus', x: 300, y: 200, radius: 50, color: '#8B4513', info: 'Controls cell activities and contains DNA' },
            { name: 'Mitochondria', x: 200, y: 150, radius: 30, color: '#FF6B6B', info: 'Powerhouse of the cell - produces energy (ATP)' },
            { name: 'Ribosome', x: 400, y: 250, radius: 15, color: '#4ECDC4', info: 'Makes proteins for the cell' },
            { name: 'Endoplasmic Reticulum', x: 350, y: 150, radius: 35, color: '#95E1D3', info: 'Transports materials within the cell' },
            { name: 'Golgi Body', x: 250, y: 280, radius: 28, color: '#F9CA24', info: 'Packages and ships proteins' },
            { name: 'Vacuole', x: 450, y: 180, radius: 40, color: '#74B9FF', info: 'Stores water, waste, and nutrients' }
        ];

        this.cellBoundary = { x: 300, y: 200, radiusX: 280, radiusY: 180 };
        this.selectedOrganelle = null;
    }

    render() {
        this.clear();

        // Draw cell membrane (outer boundary)
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.cellBoundary.x,
            this.cellBoundary.y,
            this.cellBoundary.radiusX,
            this.cellBoundary.radiusY,
            0, 0, Math.PI * 2
        );
        this.ctx.fillStyle = '#FFF8E1';
        this.ctx.fill();
        this.ctx.strokeStyle = '#795548';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw cell membrane label
        CanvasUtils.drawText(this.ctx, 'Cell Membrane', 520, 30, '#795548', 'bold 14px Arial');

        // Draw organelles
        this.organelles.forEach(organelle => {
            const isHovered = this.hoveredElement === organelle;
            const isSelected = this.selectedOrganelle === organelle;

            // Draw organelle
            CanvasUtils.drawCircle(
                this.ctx,
                organelle.x,
                organelle.y,
                organelle.radius,
                organelle.color,
                isHovered || isSelected ? '#000' : '#333',
                isHovered || isSelected ? 3 : 2
            );

            // Draw organelle name
            CanvasUtils.drawText(
                this.ctx,
                organelle.name,
                organelle.x,
                organelle.y + organelle.radius + 15,
                '#333',
                '12px Arial',
                'center'
            );

            // Show info if hovered
            if (isHovered && !isSelected) {
                this.showOrganelleInfo(organelle, organelle.x, organelle.y - organelle.radius - 60);
            }
        });

        // Draw title
        CanvasUtils.drawText(this.ctx, 'Animal Cell', 300, 20, '#333', 'bold 20px Arial', 'center');
        CanvasUtils.drawText(this.ctx, 'Click on organelles to learn more!', 300, 45, '#666', '14px Arial', 'center');

        // Show selected organelle info
        if (this.selectedOrganelle) {
            this.showDetailedInfo(this.selectedOrganelle);
        }
    }

    showOrganelleInfo(organelle, x, y) {
        const maxWidth = 200;
        const padding = 10;
        const lineHeight = 18;

        // Wrap text
        const words = organelle.info.split(' ');
        const lines = [];
        let currentLine = words[0];

        this.ctx.font = '12px Arial';
        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth - padding * 2) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        const boxHeight = lines.length * lineHeight + padding * 2;
        const boxWidth = maxWidth;

        // Draw tooltip box
        CanvasUtils.drawRoundedRect(
            this.ctx,
            x - boxWidth / 2,
            y,
            boxWidth,
            boxHeight,
            8,
            'rgba(0, 0, 0, 0.9)'
        );

        // Draw text lines
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        lines.forEach((line, index) => {
            this.ctx.fillText(
                line,
                x - boxWidth / 2 + padding,
                y + padding + index * lineHeight + 12
            );
        });
    }

    showDetailedInfo(organelle) {
        const infoBox = document.createElement('div');
        infoBox.style.position = 'absolute';
        infoBox.style.right = '20px';
        infoBox.style.top = '80px';
        infoBox.style.width = '200px';
        infoBox.style.padding = '15px';
        infoBox.style.backgroundColor = organelle.color;
        infoBox.style.borderRadius = '8px';
        infoBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        infoBox.innerHTML = `
            <h3 style="margin:0 0 10px 0;color:#fff;">${organelle.name}</h3>
            <p style="margin:0;color:#fff;font-size:14px;">${organelle.info}</p>
            <button onclick="this.parentElement.remove()" style="margin-top:10px;padding:5px 10px;cursor:pointer;">Close</button>
        `;

        // Remove previous info box if exists
        const existing = this.container.querySelector('div[style*="position: absolute"]');
        if (existing) existing.remove();

        this.container.style.position = 'relative';
        this.container.appendChild(infoBox);
    }

    handleHover(x, y) {
        this.hoveredElement = null;

        for (const organelle of this.organelles) {
            if (CanvasUtils.isPointInCircle(x, y, organelle.x, organelle.y, organelle.radius)) {
                this.hoveredElement = organelle;
                this.canvas.style.cursor = 'pointer';
                break;
            }
        }

        if (!this.hoveredElement) {
            this.canvas.style.cursor = 'default';
        }

        this.render();
    }

    handleClick(x, y) {
        for (const organelle of this.organelles) {
            if (CanvasUtils.isPointInCircle(x, y, organelle.x, organelle.y, organelle.radius)) {
                this.selectedOrganelle = organelle;
                this.render();
                return;
            }
        }
    }
}

// Register component
window.InteractiveRegistry.components['cell-explorer'] = CellExplorer;
