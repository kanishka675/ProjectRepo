/**
 * Interactive Framework - Base Classes for Learning Module Interactives
 * Provides foundation for simulators, animations, diagrams, and playgrounds
 */

// Base Interactive Element Class
class InteractiveElement {
    constructor(container, config = {}) {
        this.container = container;
        this.config = config;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
    }

    init() {
        this.createCanvas();
        this.setupControls();
        this.render();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width || 600;
        this.canvas.height = this.config.height || 400;
        this.canvas.style.border = '2px solid #ddd';
        this.canvas.style.borderRadius = '8px';
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }

    setupControls() {
        // Override in subclasses
    }

    render() {
        // Override in subclasses
    }

    clear() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
        this.container.innerHTML = '';
    }
}

// Simulator Class (for interactive experiments)
class Simulator extends InteractiveElement {
    constructor(container, config) {
        super(container, config);
        this.state = {};
        this.controls = {};
    }

    updateState(key, value) {
        this.state[key] = value;
        this.render();
    }

    addSlider(label, key, min, max, initial, step = 1) {
        const controlDiv = document.createElement('div');
        controlDiv.style.margin = '10px 0';
        controlDiv.style.textAlign = 'center';

        const labelEl = document.createElement('label');
        labelEl.textContent = `${label}: `;
        labelEl.style.fontWeight = 'bold';
        labelEl.style.marginRight = '10px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = initial;
        slider.step = step;
        slider.style.width = '200px';
        slider.style.verticalAlign = 'middle';

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = initial;
        valueDisplay.style.marginLeft = '10px';
        valueDisplay.style.minWidth = '40px';
        valueDisplay.style.display = 'inline-block';

        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            valueDisplay.textContent = value;
            this.updateState(key, value);
        });

        controlDiv.appendChild(labelEl);
        controlDiv.appendChild(slider);
        controlDiv.appendChild(valueDisplay);
        this.container.appendChild(controlDiv);

        this.controls[key] = slider;
        this.state[key] = initial;
    }

    addButton(label, callback) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.margin = '10px 5px';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        button.addEventListener('click', callback);
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#45a049';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#4CAF50';
        });

        this.container.appendChild(button);
        return button;
    }
}

// Animation Class (for animated demonstrations)
class Animation extends InteractiveElement {
    constructor(container, config) {
        super(container, config);
        this.frame = 0;
        this.fps = config.fps || 30;
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = 0;
    }

    animate(timestamp) {
        if (!this.isRunning) return;

        const elapsed = timestamp - this.lastFrameTime;

        if (elapsed > this.frameInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
            this.clear();
            this.renderFrame(this.frame);
            this.frame++;
        }

        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    renderFrame(frame) {
        // Override in subclasses
    }

    play() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            this.animate(this.lastFrameTime);
        }
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    reset() {
        this.pause();
        this.frame = 0;
        this.clear();
        this.renderFrame(0);
    }
}

// Diagram Class (for interactive diagrams)
class InteractiveDiagram extends InteractiveElement {
    constructor(container, config) {
        super(container, config);
        this.elements = [];
        this.selectedElement = null;
        this.hoveredElement = null;
    }

    init() {
        super.init();
        this.setupMouseEvents();
    }

    setupMouseEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleHover(x, y);
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleClick(x, y);
        });
    }

    handleHover(x, y) {
        // Override in subclasses
    }

    handleClick(x, y) {
        // Override in subclasses
    }

    showTooltip(text, x, y) {
        // Simple tooltip rendering
        this.ctx.save();
        this.ctx.font = '14px Arial';
        const metrics = this.ctx.measureText(text);
        const padding = 8;
        const boxWidth = metrics.width + padding * 2;
        const boxHeight = 24;

        // Draw tooltip background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(x, y - boxHeight - 10, boxWidth, boxHeight);

        // Draw tooltip text
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, x + padding, y - 15);
        this.ctx.restore();
    }
}

// Code Playground Class (for live coding)
class CodePlayground extends InteractiveElement {
    constructor(container, config) {
        super(container, config);
        this.editor = null;
        this.output = null;
    }

    createCanvas() {
        // Override to create text editor instead of canvas
        const editorContainer = document.createElement('div');
        editorContainer.style.display = 'flex';
        editorContainer.style.gap = '10px';
        editorContainer.style.marginTop = '10px';

        // Code editor
        const editorDiv = document.createElement('div');
        editorDiv.style.flex = '1';

        this.editor = document.createElement('textarea');
        this.editor.style.width = '100%';
        this.editor.style.height = '300px';
        this.editor.style.fontFamily = 'monospace';
        this.editor.style.fontSize = '14px';
        this.editor.style.padding = '10px';
        this.editor.style.border = '2px solid #ddd';
        this.editor.style.borderRadius = '4px';
        this.editor.placeholder = 'Write your code here...';
        editorDiv.appendChild(this.editor);

        // Output console
        const outputDiv = document.createElement('div');
        outputDiv.style.flex = '1';

        this.output = document.createElement('pre');
        this.output.style.width = '100%';
        this.output.style.height = '300px';
        this.output.style.fontFamily = 'monospace';
        this.output.style.fontSize = '14px';
        this.output.style.padding = '10px';
        this.output.style.border = '2px solid #ddd';
        this.output.style.borderRadius = '4px';
        this.output.style.backgroundColor = '#f5f5f5';
        this.output.style.overflow = 'auto';
        this.output.textContent = 'Output will appear here...';
        outputDiv.appendChild(this.output);

        editorContainer.appendChild(editorDiv);
        editorContainer.appendChild(outputDiv);
        this.container.appendChild(editorContainer);
    }

    setupControls() {
        const runButton = document.createElement('button');
        runButton.textContent = '▶ Run Code';
        runButton.style.margin = '10px 0';
        runButton.style.padding = '10px 20px';
        runButton.style.backgroundColor = '#4CAF50';
        runButton.style.color = 'white';
        runButton.style.border = 'none';
        runButton.style.borderRadius = '4px';
        runButton.style.cursor = 'pointer';
        runButton.style.fontSize = '16px';

        runButton.addEventListener('click', () => this.runCode());
        this.container.insertBefore(runButton, this.container.firstChild);
    }

    runCode() {
        // Override in subclasses
    }
}

// Global registry for interactive components
window.InteractiveRegistry = {
    Simulator,
    Animation,
    InteractiveDiagram,
    CodePlayground,
    components: {}
};

// Helper function to initialize interactive
window.initializeInteractive = function (container, type, config) {
    const ComponentClass = window.InteractiveRegistry.components[type];
    if (ComponentClass) {
        const instance = new ComponentClass(container, config);
        instance.init();
        return instance;
    } else {
        console.warn(`Interactive type "${type}" not found`);
        container.innerHTML = `<p style="text-align:center;color:#888;padding:20px;">
            Interactive "${type}" coming soon!</p>`;
        return null;
    }
};
