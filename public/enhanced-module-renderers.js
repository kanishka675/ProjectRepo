// Enhanced Interactive Module Renderers
// This file contains visual displays for all interactive learning module types

function renderEnhancedInteractive(container, type) {
    switch (type) {
        case 'state-changer':
            container.innerHTML = `
                <div class="state-visual" style="text-align:center; padding:30px;">
                    <h4>🧊💧💨 States of Matter</h4>
                    <div style="display:flex; justify-content:space-around; margin:30px 0;">
                        <div style="flex:1; padding:20px; background:#e3f2fd; border-radius:10px; margin:0 10px;">
                            <div style="font-size:40px;">🧊</div>
                            <strong>SOLID</strong>
                            <p style="font-size:12px;">Fixed shape<br/>& volume</p>
                        </div>
                        <div style="flex:1; padding:20px; background:#fff3e0; border-radius:10px; margin:0 10px;">
                            <div style="font-size:40px;">💧</div>
                            <strong>LIQUID</strong>
                            <p style="font-size:12px;">Fixed volume<br/>Flows freely</p>
                        </div>
                        <div style="flex:1; padding:20px; background:#fce4ec; border-radius:10px; margin:0 10px;">
                            <div style="font-size:40px;">💨</div>
                            <strong>GAS</strong>
                            <p style="font-size:12px;">Fills entire<br/>container</p>
                        </div>
                    </div>
                    <p class="text-muted">⬆️ Heat transforms matter: Solid → Liquid → Gas</p>
                </div>
            `;
            break;

        case 'cycle-animation':
            container.innerHTML = `
                <div class="cycle-visual" style="text-align:center; padding:30px;">
                    <h4>🌊 Water Cycle Animation</h4>
                    <div style="position:relative; height:300px; background:linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #90EE90 100%); border-radius:15px; padding:20px;">
                        <div style="position:absolute; top:10px; right:20px; font-size:50px; animation: pulse 2s ease-in-out infinite;">☀️</div>
                        <div style="position:absolute; top:40px; left:50%; transform:translateX(-50%); font-size:35px;">☁️ ☁️</div>
                        <div style="position:absolute; top:120px; left:50%; transform:translateX(-50%); font-size:25px; animation: fall 1.5s linear infinite;">💧💧💧</div>
                        <div style="position:absolute; bottom:20px; left:30px; font-size:40px;">🌊</div>
                        <div style="position:absolute; bottom:20px; right:30px; font-size:40px;">🏔️</div>
                    </div>
                    <div style="margin-top:20px; display:flex; justify-content:space-around;">
                        <span>☀️ Evaporation</span>
                        <span>☁️ Condensation</span>
                        <span>💧 Precipitation</span>
                        <span>🌊 Collection</span>
                    </div>
                </div>
                <style>
                    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                    @keyframes fall { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(20px); opacity: 1; } }
                </style>
            `;
            break;

        case 'decimal-grid':
            container.innerHTML = `
                <div class="decimal-visual" style="text-align:center; padding:30px;">
                    <h4>🔢 Decimal Place Values</h4>
                    <div style="display:flex; justify-content:center; gap:5px; margin:30px 0; font-size:24px; font-family:monospace;">
                        <div style="padding:15px; background:#e1f5fe; border:2px solid #0277bd; border-radius:8px;">1</div>
                        <div style="padding:15px; background:#e8f5e9; border:2px solid #2e7d32; border-radius:8px;">2</div>
                        <div style="padding:15px; background:#fff3e0; font-size:30px;">.</div>
                        <div style="padding:15px; background:#fce4ec; border:2px solid #c2185b; border-radius:8px;">3</div>
                        <div style="padding:15px; background:#f3e5f5; border:2px solid #7b1fa2; border-radius:8px;">4</div>
                    </div>
                    <div style="display:flex; justify-content:center; gap:5px; font-size:11px;">
                        <div style="width:50px;">Tens<br/>(10)</div>
                        <div style="width:50px;">Ones<br/>(1)</div>
                        <div style="width:20px;"></div>
                        <div style="width:50px;">Tenths<br/>(0.1)</div>
                        <div style="width:70px;">Hundredths<br/>(0.01)</div>
                    </div>
                    <p style="margin-top:20px; font-size:20px;"><strong>12.34</strong> = 12 + 0.3 + 0.04</p>
                </div>
            `;
            break;

        case 'shape-measurer':
            container.innerHTML = `
                <div class="shape-measure-visual" style="text-align:center; padding:30px;">
                    <h4>📏 Measuring Shapes</h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px; margin:30px 0;">
                        <div style="padding:20px; background:#e8f5e9; border-radius:10px;">
                            <div style="width:120px; height:80px; background:#4caf50; margin:0 auto 15px; border-radius:5px; position:relative;">
                                <div style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); font-size:11px; background:white; padding:2px 5px; border-radius:3px;">5</div>
                                <div style="position:absolute; left:-25px; top:50%; transform:translateY(-50%); writing-mode:vertical-lr; font-size:11px; background:white; padding:2px 5px; border-radius:3px;">3</div>
                            </div>
                            <strong>Rectangle</strong>
                            <p style="font-size:12px;">Perimeter = 2(5+3) = 16<br/>Area = 5×3 = 15</p>
                        </div>
                        <div style="padding:20px; background:#e3f2fd; border-radius:10px;">
                            <div style="width:100px; height:100px; background:#2196f3; margin:0 auto 15px; border-radius:5px; position:relative;">
                                <div style="position:absolute; bottom:-15px; left:50%; transform:translateX(-50%); font-size:11px; background:white; padding:2px 5px; border-radius:3px;">4</div>
                            </div>
                            <strong>Square</strong>
                            <p style="font-size:12px;">Perimeter = 4×4 = 16<br/>Area = 4² = 16</p>
                        </div>
                    </div>
                </div>
            `;
            break;

        default:
            // Return false to indicate this renderer didn't handle the type
            return false;
    }
    return true; // Indicate successful render
}
