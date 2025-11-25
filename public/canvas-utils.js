/**
 * Canvas Utilities - Helper functions for drawing on HTML5 Canvas
 */

const CanvasUtils = {
    // Draw a circle
    drawCircle(ctx, x, y, radius, fillColor, strokeColor = null, lineWidth = 2) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    },

    // Draw a rectangle
    drawRect(ctx, x, y, width, height, fillColor, strokeColor = null, lineWidth = 2) {
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(x, y, width, height);
        }
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(x, y, width, height);
        }
    },

    // Draw a line
    drawLine(ctx, x1, y1, x2, y2, color = '#000', lineWidth = 2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    },

    // Draw text
    drawText(ctx, text, x, y, color = '#000', font = '16px Arial', align = 'left', baseline = 'top') {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
    },

    // Draw arrow
    drawArrow(ctx, fromX, fromY, toX, toY, color = '#000', lineWidth = 2, headSize = 10) {
        const angle = Math.atan2(toY - fromY, toX - fromX);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headSize * Math.cos(angle - Math.PI / 6),
            toY - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headSize * Math.cos(angle + Math.PI / 6),
            toY - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    },

    // Draw grid
    drawGrid(ctx, width, height, gridSize = 50, color = '#e0e0e0') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    },

    // Draw axes
    drawAxes(ctx, width, height, originX, originY, color = '#000') {
        // X-axis
        this.drawArrow(ctx, 0, originY, width, originY, color, 2, 8);
        // Y-axis  
        this.drawArrow(ctx, originX, height, originX, 0, color, 2, 8);
    },

    // Check if point is inside circle
    isPointInCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return (dx * dx + dy * dy) <= (radius * radius);
    },

    // Check if point is inside rectangle
    isPointInRect(px, py, rx, ry, width, height) {
        return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
    },

    // Linear interpolation
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    // Convert radians to degrees
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    // Generate random color
    randomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    // Create gradient
    createLinearGradient(ctx, x1, y1, x2, y2, colorStops) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        colorStops.forEach(stop => {
            gradient.addColorStop(stop.offset, stop.color);
        });
        return gradient;
    },

    // Draw rounded rectangle
    drawRoundedRect(ctx, x, y, width, height, radius, fillColor, strokeColor = null) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        }
    },

    // Draw dashed line
    drawDashedLine(ctx, x1, y1, x2, y2, color = '#000', dashPattern = [5, 5]) {
        ctx.setLineDash(dashPattern);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.setLineDash([]);
    }
};

// Export for use in other modules
window.CanvasUtils = CanvasUtils;
