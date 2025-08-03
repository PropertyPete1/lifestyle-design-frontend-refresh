(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/ChartWave.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>ChartWave
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ChartWave(param) {
    let { color = 'red', amplitude = 10, frequency = 0.01, speed = 1, height = 60, width = 300, className = '', offsetY = 0, isGlowing = false, thickness = 2 } = param;
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const animationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartWave.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            canvas.width = width;
            canvas.height = height;
            const animate = {
                "ChartWave.useEffect.animate": ()=>{
                    // Increment phase continuously for infinite motion
                    phase.current += speed;
                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Begin path for wave
                    ctx.beginPath();
                    // Draw seamless infinite wave with vertical offset
                    for(let x = 0; x < canvas.width; x++){
                        const y = height / 2 + offsetY + amplitude * Math.sin((x + phase.current) * frequency);
                        if (x === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    // 🌟 SPECIAL VISUALS: Glow effect for new records
                    if (isGlowing) {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = thickness + 2; // Thicker when glowing
                        ctx.shadowBlur = 20; // Strong glow
                        ctx.shadowColor = color;
                        ctx.globalAlpha = 0.9;
                    } else {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = thickness;
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = color;
                        ctx.globalAlpha = 0.8;
                    }
                    ctx.stroke();
                    ctx.globalAlpha = 1; // Reset alpha
                    // Continue animation
                    animationId.current = requestAnimationFrame(animate);
                }
            }["ChartWave.useEffect.animate"];
            animate();
            // Cleanup
            return ({
                "ChartWave.useEffect": ()=>{
                    if (animationId.current) {
                        cancelAnimationFrame(animationId.current);
                    }
                }
            })["ChartWave.useEffect"];
        }
    }["ChartWave.useEffect"], [
        amplitude,
        frequency,
        speed,
        height,
        width,
        color
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: className,
        style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        }
    }, void 0, false, {
        fileName: "[project]/src/components/ChartWave.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(ChartWave, "u4PcTacHEXG27lhPFh++CQx/jN4=");
_c = ChartWave;
var _c;
__turbopack_context__.k.register(_c, "ChartWave");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/DashboardChart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChartWave$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ChartWave.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const DashboardChart = ()=>{
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        dailyPostLimit: 3
    });
    const [engagementScore, setEngagementScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.5); // normalized 0–1
    const [autopilotOn, setAutopilotOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newHigh, setNewHigh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastPostSpike, setLastPostSpike] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [autopilotVolume, setAutopilotVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3); // Volume for animation scaling
    const [animationSpeed, setAnimationSpeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3); // Base animation speed
    const [platformData, setPlatformData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        instagram: {
            active: true,
            todayPosts: 0
        },
        youtube: {
            active: true,
            todayPosts: 0
        }
    });
    // ✅ Real-time data fetching with enhanced connections
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardChart.useEffect": ()=>{
            const fetchChartData = {
                "DashboardChart.useEffect.fetchChartData": async ()=>{
                    try {
                        const res = await fetch('http://localhost:3002/api/chart/status');
                        if (res.ok) {
                            var _data_settings, _data_platformData_instagram, _data_platformData, _data_platformData_youtube, _data_platformData1;
                            const data = await res.json();
                            // 🎛️ CORE SETTINGS
                            setSettings(data.settings || {
                                dailyPostLimit: 3
                            });
                            setAutopilotOn(data.autopilotRunning || false);
                            // 📊 ENGAGEMENT DATA (affects wave amplitude)
                            const currentEngagement = data.engagementScore || 0;
                            setEngagementScore(currentEngagement);
                            // 🌟 NEW RECORD DETECTION (triggers glow effect)
                            const isNewRecord = data.newHighScore || false;
                            if (isNewRecord && !newHigh) {
                                console.log('🏆 New engagement record detected! Activating glow effect.');
                            }
                            setNewHigh(isNewRecord);
                            // ⚡ POST SPIKE DETECTION (triggers spike animation)
                            const currentPostTime = data.lastPostTime;
                            if (currentPostTime && currentPostTime !== lastPostSpike) {
                                console.log('📡 New post detected! Triggering spike animation.');
                                setLastPostSpike(currentPostTime);
                            }
                            // 📈 VOLUME SCALING (affects speed and thickness)
                            if ((_data_settings = data.settings) === null || _data_settings === void 0 ? void 0 : _data_settings.dailyPostLimit) {
                                setAutopilotVolume(data.settings.dailyPostLimit);
                            }
                            // 🎯 PLATFORM ACTIVITY (affects line height and visibility)
                            if (data.platformData) {
                                var _data_platformData_instagram1, _data_platformData_youtube1;
                                const prevInstagram = platformData.instagram.todayPosts;
                                const prevYoutube = platformData.youtube.todayPosts;
                                const newInstagram = ((_data_platformData_instagram1 = data.platformData.instagram) === null || _data_platformData_instagram1 === void 0 ? void 0 : _data_platformData_instagram1.todayPosts) || 0;
                                const newYoutube = ((_data_platformData_youtube1 = data.platformData.youtube) === null || _data_platformData_youtube1 === void 0 ? void 0 : _data_platformData_youtube1.todayPosts) || 0;
                                // Log platform activity changes
                                if (newInstagram > prevInstagram) {
                                    console.log("📸 Instagram activity increased: ".concat(prevInstagram, " → ").concat(newInstagram, " posts"));
                                }
                                if (newYoutube > prevYoutube) {
                                    console.log("🎥 YouTube activity increased: ".concat(prevYoutube, " → ").concat(newYoutube, " posts"));
                                }
                                setPlatformData(data.platformData);
                            }
                            console.log('📊 Chart connected - Live data updated:', {
                                autopilot: data.autopilotRunning,
                                engagement: currentEngagement,
                                newRecord: isNewRecord,
                                instagram: ((_data_platformData = data.platformData) === null || _data_platformData === void 0 ? void 0 : (_data_platformData_instagram = _data_platformData.instagram) === null || _data_platformData_instagram === void 0 ? void 0 : _data_platformData_instagram.todayPosts) || 0,
                                youtube: ((_data_platformData1 = data.platformData) === null || _data_platformData1 === void 0 ? void 0 : (_data_platformData_youtube = _data_platformData1.youtube) === null || _data_platformData_youtube === void 0 ? void 0 : _data_platformData_youtube.todayPosts) || 0
                            });
                        }
                    } catch (error) {
                        console.warn('📊 Chart connection failed:', error);
                    }
                }
            }["DashboardChart.useEffect.fetchChartData"];
            // Initial fetch
            fetchChartData();
            // Real-time updates every 3 seconds for responsive chart
            const interval = setInterval(fetchChartData, 3000);
            return ({
                "DashboardChart.useEffect": ()=>clearInterval(interval)
            })["DashboardChart.useEffect"];
        }
    }["DashboardChart.useEffect"], [
        lastPostSpike,
        newHigh,
        platformData.instagram.todayPosts,
        platformData.youtube.todayPosts
    ]);
    // ✅ Poll for immediate frontend events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardChart.useEffect": ()=>{
            let lastEventCheck = Date.now();
            const pollForEvents = {
                "DashboardChart.useEffect.pollForEvents": async ()=>{
                    try {
                        const res = await fetch("http://localhost:3002/api/events/recent?since=".concat(lastEventCheck));
                        if (res.ok) {
                            const data = await res.json();
                            if (data.events && data.events.length > 0) {
                                console.log('🔔 Processing frontend events:', data.events);
                                data.events.forEach({
                                    "DashboardChart.useEffect.pollForEvents": (event)=>{
                                        switch(event.type){
                                            case 'autopilot-success':
                                                console.log("🚀 Autopilot ".concat(event.data.platform, " success detected!"));
                                                setLastPostSpike(event.data.timestamp);
                                                setAutopilotVolume(event.data.volume);
                                                if (event.data.engagement) {
                                                    setEngagementScore(event.data.engagement);
                                                }
                                                break;
                                            case 'post-spike':
                                                console.log("📡 Post spike on ".concat(event.data.platform, "!"));
                                                setLastPostSpike(event.data.timestamp);
                                                break;
                                            case 'new-engagement-record':
                                                console.log("🏆 New engagement record on ".concat(event.data.platform, "!"));
                                                setNewHigh(true);
                                                setTimeout({
                                                    "DashboardChart.useEffect.pollForEvents": ()=>setNewHigh(false)
                                                }["DashboardChart.useEffect.pollForEvents"], 10000);
                                                break;
                                            case 'engagement-updated':
                                                console.log("📊 Engagement updated for ".concat(event.data.platform, ": ").concat(event.data.score));
                                                setEngagementScore(event.data.score);
                                                break;
                                            case 'autopilot-toggled':
                                                console.log("🎛️ Autopilot ".concat(event.data.enabled ? 'enabled' : 'disabled', "!"));
                                                setAutopilotOn(event.data.enabled);
                                                break;
                                        }
                                    }
                                }["DashboardChart.useEffect.pollForEvents"]);
                            }
                            lastEventCheck = data.timestamp;
                        }
                    } catch (error) {
                        console.warn('🔔 Failed to poll for events:', error);
                    }
                }
            }["DashboardChart.useEffect.pollForEvents"];
            // Poll every 2 seconds for immediate responses
            const eventInterval = setInterval(pollForEvents, 2000);
            return ({
                "DashboardChart.useEffect": ()=>clearInterval(eventInterval)
            })["DashboardChart.useEffect"];
        }
    }["DashboardChart.useEffect"], []);
    // ✅ Volume-based animation scaling effect (restored but refined)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardChart.useEffect": ()=>{
            const pulseChartLines = {
                "DashboardChart.useEffect.pulseChartLines": ()=>{
                    const baseSpeed = 3; // 3s animation baseline
                    const baseThickness = 1.5; // Thinner baseline
                    const speed = Math.max(1, baseSpeed - 0.3 * (autopilotVolume - 1)); // Faster with more posts
                    const thickness = baseThickness + (autopilotVolume - 1) * 0.8; // Less extreme thickness scaling
                    setAnimationSpeed(speed);
                    console.log("📊 Chart scaling: Volume=".concat(autopilotVolume, ", Speed=").concat(speed, "s, Thickness=").concat(thickness, "px"));
                }
            }["DashboardChart.useEffect.pulseChartLines"];
            pulseChartLines();
        }
    }["DashboardChart.useEffect"], [
        autopilotVolume
    ]);
    // ✅ Enhanced event listeners for immediate chart updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardChart.useEffect": ()=>{
            // 🚀 AUTOPILOT SUCCESS EVENT (immediate spike + volume update)
            const handleAutopilotSuccess = {
                "DashboardChart.useEffect.handleAutopilotSuccess": (event)=>{
                    var _event_detail, _event_detail1;
                    const volume = ((_event_detail = event.detail) === null || _event_detail === void 0 ? void 0 : _event_detail.volume) || autopilotVolume;
                    const platform = ((_event_detail1 = event.detail) === null || _event_detail1 === void 0 ? void 0 : _event_detail1.platform) || 'unknown';
                    console.log("🚀 Autopilot ".concat(platform, " post successful! Triggering immediate chart update."));
                    // Immediate spike animation
                    setLastPostSpike(Date.now());
                    // Update volume for speed/thickness changes
                    setAutopilotVolume(volume);
                    // Force immediate data refresh
                    setTimeout({
                        "DashboardChart.useEffect.handleAutopilotSuccess": ()=>{
                            const fetchEvent = new Event('force-chart-refresh');
                            window.dispatchEvent(fetchEvent);
                        }
                    }["DashboardChart.useEffect.handleAutopilotSuccess"], 500);
                }
            }["DashboardChart.useEffect.handleAutopilotSuccess"];
            // 🏆 NEW RECORD EVENT (immediate glow effect)
            const handleNewRecord = {
                "DashboardChart.useEffect.handleNewRecord": (event)=>{
                    var _event_detail, _event_detail1;
                    const recordType = ((_event_detail = event.detail) === null || _event_detail === void 0 ? void 0 : _event_detail.type) || 'engagement';
                    const platform = ((_event_detail1 = event.detail) === null || _event_detail1 === void 0 ? void 0 : _event_detail1.platform) || 'unknown';
                    console.log("🏆 New ".concat(recordType, " record on ").concat(platform, "! Activating glow effect."));
                    // Immediate glow activation
                    setNewHigh(true);
                    // Auto-disable glow after 10 seconds
                    setTimeout({
                        "DashboardChart.useEffect.handleNewRecord": ()=>{
                            setNewHigh(false);
                        }
                    }["DashboardChart.useEffect.handleNewRecord"], 10000);
                }
            }["DashboardChart.useEffect.handleNewRecord"];
            // 📊 ENGAGEMENT UPDATE EVENT (immediate amplitude change)
            const handleEngagementUpdate = {
                "DashboardChart.useEffect.handleEngagementUpdate": (event)=>{
                    var _event_detail, _event_detail1;
                    const newScore = ((_event_detail = event.detail) === null || _event_detail === void 0 ? void 0 : _event_detail.score) || 0;
                    const platform = ((_event_detail1 = event.detail) === null || _event_detail1 === void 0 ? void 0 : _event_detail1.platform) || 'unknown';
                    console.log("📊 ".concat(platform, " engagement updated: ").concat(newScore));
                    setEngagementScore(newScore);
                }
            }["DashboardChart.useEffect.handleEngagementUpdate"];
            // 🎛️ AUTOPILOT TOGGLE EVENT (immediate on/off state)
            const handleAutopilotToggle = {
                "DashboardChart.useEffect.handleAutopilotToggle": (event)=>{
                    var _event_detail;
                    const isOn = ((_event_detail = event.detail) === null || _event_detail === void 0 ? void 0 : _event_detail.enabled) || false;
                    console.log("🎛️ Autopilot ".concat(isOn ? 'enabled' : 'disabled', "! Chart responding immediately."));
                    setAutopilotOn(isOn);
                }
            }["DashboardChart.useEffect.handleAutopilotToggle"];
            // Register all event listeners
            window.addEventListener('autopilot-success', handleAutopilotSuccess);
            window.addEventListener('new-engagement-record', handleNewRecord);
            window.addEventListener('engagement-updated', handleEngagementUpdate);
            window.addEventListener('autopilot-toggled', handleAutopilotToggle);
            return ({
                "DashboardChart.useEffect": ()=>{
                    window.removeEventListener('autopilot-success', handleAutopilotSuccess);
                    window.removeEventListener('new-engagement-record', handleNewRecord);
                    window.removeEventListener('engagement-updated', handleEngagementUpdate);
                    window.removeEventListener('autopilot-toggled', handleAutopilotToggle);
                }
            })["DashboardChart.useEffect"];
        }
    }["DashboardChart.useEffect"], [
        autopilotVolume
    ]);
    // ✅ Calculate dynamic wave properties exactly per specifications
    const calculateWaveProps = (platform)=>{
        const platformInfo = platformData[platform];
        const todayPosts = platformInfo.todayPosts;
        const isActive = platformInfo.active;
        // 🧬 LINE BEHAVIOR IMPLEMENTATION
        // 1. BASE SPEED: Slower when autopilot OFF, faster when ON
        const baseSpeed = platform === 'instagram' ? 1.2 : 1.4;
        const speed = autopilotOn ? baseSpeed * Math.max(0.8, 2 - autopilotVolume / 10) // Faster with more posts
         : baseSpeed * 0.4; // Slow when autopilot OFF
        // 2. VERTICAL POSITION: Lines rise based on posts per day
        const postRatio = Math.min(todayPosts / settings.dailyPostLimit, 1);
        const offsetY = autopilotOn ? isActive ? -20 + postRatio * -25 // Higher position = more posts (negative = up)
         : 30 // Inactive platforms stay low
         : 25; // Near bottom when autopilot OFF
        // 3. AMPLITUDE: Based on engagement (larger waves = more engagement)
        const baseAmplitude = platform === 'instagram' ? 12 : 9;
        const engagementMultiplier = 0.5 + engagementScore * 1.5; // 0.5x to 2x based on engagement
        const amplitude = autopilotOn ? isActive ? baseAmplitude * engagementMultiplier // Engagement-responsive waves
         : baseAmplitude * 0.3 // Small waves when inactive
         : baseAmplitude * 0.4; // Low amplitude when autopilot OFF
        // 4. GLOW EFFECT: New record detection
        const isGlowing = newHigh && isActive;
        return {
            speed,
            amplitude,
            offsetY,
            isGlowing
        };
    };
    // Get dynamic wave properties
    const instagramProps = calculateWaveProps('instagram');
    const youtubeProps = calculateWaveProps('youtube');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative',
            width: '100%',
            height: '120px',
            marginTop: '20px',
            backgroundColor: '#121212',
            borderRadius: '6px',
            overflow: 'hidden'
        },
        className: "jsx-ab4dd1192e423219" + " " + "chart-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChartWave$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                color: "rgba(255, 105, 180, 0.9)",
                speed: instagramProps.speed,
                amplitude: instagramProps.amplitude,
                frequency: 0.015,
                height: 120,
                width: 800,
                offsetY: instagramProps.offsetY,
                isGlowing: instagramProps.isGlowing,
                thickness: instagramProps.isGlowing ? 4 : 2
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardChart.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChartWave$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                color: "rgba(255, 0, 0, 0.9)",
                speed: youtubeProps.speed,
                amplitude: youtubeProps.amplitude,
                frequency: 0.015,
                height: 120,
                width: 800,
                offsetY: youtubeProps.offsetY,
                isGlowing: youtubeProps.isGlowing,
                thickness: youtubeProps.isGlowing ? 4 : 2
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardChart.tsx",
                lineNumber: 307,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            lastPostSpike && Date.now() - lastPostSpike < 3000 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    left: "".concat((Date.now() - lastPostSpike) / 30 % 100, "%"),
                    top: 0,
                    width: '2px',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.2))',
                    animation: 'pulse 0.5s ease-in-out infinite alternate',
                    pointerEvents: 'none'
                },
                className: "jsx-ab4dd1192e423219"
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardChart.tsx",
                lineNumber: 321,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "ab4dd1192e423219",
                children: "@keyframes pulse{0%{opacity:.4}to{opacity:1}}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardChart.tsx",
        lineNumber: 281,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DashboardChart, "uLKOt7VHPAxM1R5XF+eOqE7HDgc=");
_c = DashboardChart;
const __TURBOPACK__default__export__ = DashboardChart;
var _c;
__turbopack_context__.k.register(_c, "DashboardChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/HeartStatusCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const HeartStatusCard = ()=>{
    _s();
    const [igData, setIgData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isPosting: false,
        growthRate: 0,
        engagement: 50,
        lastPost: new Date().toISOString()
    });
    const [ytData, setYtData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isPosting: false,
        growthRate: 0,
        engagement: 50,
        lastPost: new Date().toISOString()
    });
    const [showFusion, setShowFusion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastPostSpike, setLastPostSpike] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ig: false,
        yt: false
    });
    // Fetch data from backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeartStatusCard.useEffect": ()=>{
            const fetchData = {
                "HeartStatusCard.useEffect.fetchData": async ()=>{
                    try {
                        var _platformData_instagram, _platformData_instagram1, _platformData_youtube, _platformData_youtube1, _platformData_instagram2, _platformData_youtube2;
                        const response = await fetch('http://localhost:3002/api/chart/status');
                        const data = await response.json();
                        // Use the correct data structure from the actual API
                        const platformData = data.platformData || {};
                        const engagementScore = (data.engagementScore || 0) * 100; // Convert to percentage
                        const isRunning = data.autopilotRunning || false;
                        setIgData({
                            isPosting: isRunning && ((_platformData_instagram = platformData.instagram) === null || _platformData_instagram === void 0 ? void 0 : _platformData_instagram.active),
                            growthRate: ((_platformData_instagram1 = platformData.instagram) === null || _platformData_instagram1 === void 0 ? void 0 : _platformData_instagram1.todayPosts) || 0,
                            engagement: engagementScore,
                            lastPost: new Date(data.lastPostTime || Date.now()).toISOString()
                        });
                        setYtData({
                            isPosting: isRunning && ((_platformData_youtube = platformData.youtube) === null || _platformData_youtube === void 0 ? void 0 : _platformData_youtube.active),
                            growthRate: ((_platformData_youtube1 = platformData.youtube) === null || _platformData_youtube1 === void 0 ? void 0 : _platformData_youtube1.todayPosts) || 0,
                            engagement: engagementScore,
                            lastPost: new Date(data.lastPostTime || Date.now()).toISOString()
                        });
                        // Check for fusion (both platforms posted recently)
                        const lastPostTime = data.lastPostTime;
                        const timeSinceLastPost = lastPostTime ? Date.now() - lastPostTime : Infinity;
                        if (timeSinceLastPost <= 5 * 60 * 1000 && ((_platformData_instagram2 = platformData.instagram) === null || _platformData_instagram2 === void 0 ? void 0 : _platformData_instagram2.active) && ((_platformData_youtube2 = platformData.youtube) === null || _platformData_youtube2 === void 0 ? void 0 : _platformData_youtube2.active)) {
                            setShowFusion(true);
                            setTimeout({
                                "HeartStatusCard.useEffect.fetchData": ()=>setShowFusion(false)
                            }["HeartStatusCard.useEffect.fetchData"], 10000); // Hold for 10 seconds
                        }
                    } catch (error) {
                        console.error('Failed to fetch heart data:', error);
                    }
                }
            }["HeartStatusCard.useEffect.fetchData"];
            fetchData();
            const interval = setInterval(fetchData, 30000); // Update every 30 seconds
            return ({
                "HeartStatusCard.useEffect": ()=>clearInterval(interval)
            })["HeartStatusCard.useEffect"];
        }
    }["HeartStatusCard.useEffect"], []);
    const getHeartStatus = (data)=>{
        const status = {
            cracked: data.engagement < 10,
            pulseSpeed: data.growthRate > 5 ? 'fast' : data.growthRate > 0 ? 'normal' : 'slow',
            spike: false // Will be set by post events
        };
        return status;
    };
    const HeartSVG = (param)=>{
        let { platform, data } = param;
        const status = getHeartStatus(data);
        const color = platform === 'instagram' ? '#E1306C' : '#FF0000';
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "relative",
            animate: {
                scale: status.spike ? [
                    1,
                    1.2,
                    1
                ] : 1
            },
            transition: {
                scale: {
                    duration: 2
                },
                repeat: status.pulseSpeed === 'fast' ? Infinity : status.pulseSpeed === 'normal' ? Infinity : 0,
                repeatDelay: status.pulseSpeed === 'fast' ? 0.5 : 1.5
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].svg, {
                    width: "60",
                    height: "60",
                    viewBox: "0 0 24 24",
                    className: "drop-shadow-lg ".concat(status.cracked ? 'opacity-60' : ''),
                    animate: {
                        filter: data.isPosting ? [
                            "drop-shadow(0 0 10px ".concat(color, ")"),
                            "drop-shadow(0 0 20px ".concat(color, ")"),
                            "drop-shadow(0 0 10px ".concat(color, ")")
                        ] : "drop-shadow(0 0 5px ".concat(color, ")")
                    },
                    transition: {
                        duration: 1,
                        repeat: data.isPosting ? Infinity : 0
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
                            fill: color,
                            className: status.cracked ? 'opacity-70' : ''
                        }, void 0, false, {
                            fileName: "[project]/src/components/HeartStatusCard.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        status.cracked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 3L14 8L12 12L10 8Z",
                            stroke: "#666",
                            strokeWidth: "1",
                            fill: "none",
                            className: "animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/HeartStatusCard.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                data.isPosting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 pointer-events-none",
                    children: [
                        ...Array(3)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "absolute w-1 h-1 bg-white rounded-full",
                            style: {
                                left: "".concat(20 + i * 20, "%"),
                                top: "".concat(30 + i * 10, "%")
                            },
                            animate: {
                                opacity: [
                                    0,
                                    1,
                                    0
                                ],
                                scale: [
                                    0,
                                    1,
                                    0
                                ],
                                y: [
                                    -10,
                                    0,
                                    10
                                ]
                            },
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.5
                            }
                        }, i, false, {
                            fileName: "[project]/src/components/HeartStatusCard.tsx",
                            lineNumber: 138,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                    lineNumber: 136,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/HeartStatusCard.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    const FusionHeart = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                scale: 0,
                rotate: 0
            },
            animate: {
                scale: [
                    0,
                    1.2,
                    1
                ],
                rotate: [
                    0,
                    360,
                    0
                ]
            },
            exit: {
                scale: 0,
                opacity: 0
            },
            transition: {
                duration: 1
            },
            className: "relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].svg, {
                    width: "120",
                    height: "120",
                    viewBox: "0 0 24 24",
                    className: "drop-shadow-2xl",
                    animate: {
                        filter: [
                            'drop-shadow(0 0 20px #8B0000)',
                            'drop-shadow(0 0 40px #8B0000)',
                            'drop-shadow(0 0 20px #8B0000)'
                        ]
                    },
                    transition: {
                        duration: 1,
                        repeat: Infinity
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
                        fill: "#8B0000"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeartStatusCard.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                    lineNumber: 174,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 pointer-events-none",
                    children: [
                        ...Array(8)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "absolute w-2 h-2 bg-yellow-400 rounded-full",
                            style: {
                                left: "".concat(Math.random() * 100, "%"),
                                top: "".concat(Math.random() * 100, "%")
                            },
                            animate: {
                                opacity: [
                                    0,
                                    1,
                                    0
                                ],
                                scale: [
                                    0,
                                    1,
                                    0
                                ],
                                rotate: [
                                    0,
                                    360
                                ]
                            },
                            transition: {
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }
                        }, i, false, {
                            fileName: "[project]/src/components/HeartStatusCard.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                    lineNumber: 195,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/HeartStatusCard.tsx",
            lineNumber: 164,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[120px] mt-5 bg-[#121212] border border-[#333] rounded-md p-4 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/HeartStatusCard.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 h-full flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    mode: "wait",
                    children: showFusion ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FusionHeart, {}, void 0, false, {
                        fileName: "[project]/src/components/HeartStatusCard.tsx",
                        lineNumber: 228,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "flex items-center space-x-8",
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        exit: {
                            opacity: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartSVG, {
                                    platform: "instagram",
                                    data: igData
                                }, void 0, false, {
                                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                                    lineNumber: 237,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeartStatusCard.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartSVG, {
                                    platform: "youtube",
                                    data: ytData
                                }, void 0, false, {
                                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                                    lineNumber: 244,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeartStatusCard.tsx",
                                lineNumber: 243,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/HeartStatusCard.tsx",
                        lineNumber: 230,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/HeartStatusCard.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/HeartStatusCard.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HeartStatusCard.tsx",
        lineNumber: 221,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HeartStatusCard, "v+5Kv+Fwk58LrqXBPqil9/dFMwc=");
_c = HeartStatusCard;
const __TURBOPACK__default__export__ = HeartStatusCard;
var _c;
__turbopack_context__.k.register(_c, "HeartStatusCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/RecentAutoPilotPosts.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const platformStyles = {
    Instagram: {
        borderColor: 'border-pink-600',
        icon: '/icons/ig-icon.svg',
        alt: 'Instagram'
    },
    YouTube: {
        borderColor: 'border-red-600',
        icon: '/icons/yt-icon.svg',
        alt: 'YouTube'
    }
};
const RecentAutoPilotPosts = (param)=>{
    let { posts = [] } = param;
    _s();
    const [showRecent, setShowRecent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleView = ()=>{
        setShowRecent(!showRecent);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "activity-feed-compact",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            margin: 0
                        },
                        children: showRecent ? 'Recent AutoPilot Posts' : 'Upcoming AutoPilot Posts'
                    }, void 0, false, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleView,
                        style: {
                            background: '#8B5CF6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                        },
                        children: showRecent ? 'Show Upcoming' : 'Show Recent'
                    }, void 0, false, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !showRecent ? // Show upcoming posts (existing placeholder content)
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "activity-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-title",
                                        children: "Post auto-published"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-time",
                                        children: "12 minutes ago"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "activity-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-title",
                                        children: "Story view milestone reached"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-time",
                                        children: "1 hour ago"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "activity-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-title",
                                        children: "New follower surge detected"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-time",
                                        children: "3 hours ago"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "activity-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-dot"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-title",
                                        children: "Engagement goal achieved"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "activity-time",
                                        children: "6 hours ago"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true) : // Show recent posts with thumbnails
            posts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "activity-item",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "activity-dot"
                    }, void 0, false, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 91,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "activity-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-title",
                                children: "No recent posts found"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "activity-time",
                                children: "Check back later"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                        lineNumber: 92,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                lineNumber: 90,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)) : posts.map((post, index)=>{
                const platformStyle = platformStyles[post.platform];
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "activity-item",
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #1f1f1f',
                        borderRadius: '8px',
                        marginBottom: '8px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: "2px solid ".concat(post.platform === 'Instagram' ? '#e91e63' : '#f44336'),
                                flexShrink: 0
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: post.thumbnailUrl,
                                alt: "".concat(post.platform, " post thumbnail"),
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                },
                                onError: (e)=>{
                                    e.target.src = '/default-video.jpg';
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 120,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                            lineNumber: 112,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '4px'
                                    },
                                    children: [
                                        post.platform,
                                        " post published"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                    lineNumber: 136,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: '#888',
                                        fontSize: '12px'
                                    },
                                    children: post.timestamp
                                }, void 0, false, {
                                    fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                    lineNumber: 144,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                            lineNumber: 135,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: '24px',
                                height: '24px',
                                flexShrink: 0
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: platformStyle.icon,
                                alt: platformStyle.alt,
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    filter: post.platform === 'Instagram' ? 'hue-rotate(320deg)' : 'hue-rotate(0deg)'
                                },
                                onError: (e)=>{
                                    e.target.style.display = 'none';
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                                lineNumber: 158,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                            lineNumber: 153,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, "".concat(post.platform, "-").concat(index), true, {
                    fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
                    lineNumber: 101,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0));
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RecentAutoPilotPosts.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(RecentAutoPilotPosts, "tAwfDGOmRFJWnPyefUNJ1W1pSv4=");
_c = RecentAutoPilotPosts;
const __TURBOPACK__default__export__ = RecentAutoPilotPosts;
var _c;
__turbopack_context__.k.register(_c, "RecentAutoPilotPosts");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/fetchRecentPosts.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "fetchRecentPosts": ()=>fetchRecentPosts
});
async function fetchRecentPosts(platform) {
    try {
        // ✅ Connect to backend API that filters MongoDB by platform
        const response = await fetch("http://localhost:3002/api/activity/feed?platform=".concat(platform, "&limit=5"));
        if (!response.ok) {
            throw new Error("Failed to fetch ".concat(platform, " posts: ").concat(response.status));
        }
        const data = await response.json();
        // ✅ Transform data to ensure consistent format with thumbnails
        return data.map((post)=>({
                videoId: post.videoId || post.id || post._id,
                thumbnailUrl: post.thumbnail || post.thumbnailUrl || post.video_thumbnail,
                timestampFormatted: post.timestampFormatted || post.timestamp || formatTimestamp(post.createdAt || post.date),
                platform: platform,
                title: post.title || 'Untitled Post'
            }));
    } catch (error) {
        console.warn("⚠️ Failed to fetch ".concat(platform, " posts:"), error);
        return []; // Return empty array on error to prevent crashes
    }
}
// ✅ Helper function to format timestamps consistently
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMins < 60) {
            return "".concat(diffMins, "m ago");
        } else if (diffHours < 24) {
            return "".concat(diffHours, "h ago");
        } else if (diffDays < 7) {
            return "".concat(diffDays, "d ago");
        } else {
            return date.toLocaleDateString();
        }
    } catch (e) {
        return 'Recently posted';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/RecentAutoPilotPostsWrapper.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RecentAutoPilotPosts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RecentAutoPilotPosts.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchRecentPosts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/fetchRecentPosts.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const RecentAutoPilotPostsWrapper = (param)=>{
    let { platform } = param;
    _s();
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecentAutoPilotPostsWrapper.useEffect": ()=>{
            const loadPosts = {
                "RecentAutoPilotPostsWrapper.useEffect.loadPosts": async ()=>{
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchRecentPosts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchRecentPosts"])(platform);
                        // Transform data to match the new component's expected format
                        const transformedPosts = data.map({
                            "RecentAutoPilotPostsWrapper.useEffect.loadPosts.transformedPosts": (post)=>({
                                    platform: platform === 'instagram' ? 'Instagram' : 'YouTube',
                                    thumbnailUrl: post.thumbnailUrl || '/default-video.jpg',
                                    timestamp: post.timestampFormatted || 'Recently posted'
                                })
                        }["RecentAutoPilotPostsWrapper.useEffect.loadPosts.transformedPosts"]);
                        setPosts(transformedPosts);
                    } catch (error) {
                        console.warn("Failed to load ".concat(platform, " posts:"), error);
                        setPosts([]);
                    }
                }
            }["RecentAutoPilotPostsWrapper.useEffect.loadPosts"];
            loadPosts();
        }
    }["RecentAutoPilotPostsWrapper.useEffect"], [
        platform
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RecentAutoPilotPosts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        posts: posts
    }, void 0, false, {
        fileName: "[project]/src/components/RecentAutoPilotPostsWrapper.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(RecentAutoPilotPostsWrapper, "bG8V4duoIfO0BEPgauWMVT5Qvyw=");
_c = RecentAutoPilotPostsWrapper;
const __TURBOPACK__default__export__ = RecentAutoPilotPostsWrapper;
var _c;
__turbopack_context__.k.register(_c, "RecentAutoPilotPostsWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/dashboard/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Dashboard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$auto$2f$auto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/auto/auto.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DashboardChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HeartStatusCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/HeartStatusCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RecentAutoPilotPostsWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RecentAutoPilotPostsWrapper.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const defaultStatus = {
    autopilot: false,
    maxPosts: 3,
    postTime: '14:00',
    repostDelay: 1,
    manual: true
};
function Dashboard() {
    _s();
    const [currentPlatform, setCurrentPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('instagram');
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultStatus);
    // ✅ Ultra-robust unique key generator with global counter
    const uniqueKeyCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const generateUniqueKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[generateUniqueKey]": (post, index, prefix)=>{
            // Triple-layer uniqueness: prefix + index + incrementing counter + random component
            uniqueKeyCounter.current += 1;
            return "".concat(prefix, "-").concat(index, "-").concat(uniqueKeyCounter.current, "-").concat(Math.random().toString(36).substr(2, 5));
        }
    }["Dashboard.useCallback[generateUniqueKey]"], []);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        instagram: {
            followers: '24.8K',
            engagement: '4.7%',
            reach: '89.2K',
            autoPostsPerDay: "".concat(status.maxPosts, "/day")
        },
        youtube: {
            subscribers: 'N/A',
            watchTime: 'N/A',
            views: 'N/A',
            autoUploadsPerWeek: '2/week'
        }
    });
    const [analyticsLoading, setAnalyticsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [recentActivity, setRecentActivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [autopilotRunning, setAutopilotRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [manualPostRunning, setManualPostRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Separate state for manual post button
    const [autopilotStatus, setAutopilotStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle'); // 'idle', 'running', 'success', 'error'
    const [autopilotVolume, setAutopilotVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3); // posts per day
    const [engagementScore, setEngagementScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.65); // 0-1 normalized
    const [newHighScore, setNewHighScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastPostSpike, setLastPostSpike] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [queueSize, setQueueSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [platformSettings, setPlatformSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        instagram: true,
        youtube: true
    });
    const [platformData, setPlatformData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        instagram: {
            active: false,
            todayPosts: 0,
            reach: 0,
            engagement: 0
        },
        youtube: {
            active: false,
            todayPosts: 0,
            reach: 0,
            engagement: 0
        }
    });
    const [lastQueueUpdate, setLastQueueUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // ✅ NEW: Enhanced activity feed and chart state
    const [enhancedActivity, setEnhancedActivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [queuedPosts, setQueuedPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showUpcoming, setShowUpcoming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // Toggle between upcoming and recent
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ✅ NEW: Real-time notifications - DISABLED
    // const [notificationHandler, setNotificationHandler] = useState<((message: string, type?: 'success' | 'error' | 'info') => void) | null>(null);
    const [lastAutopilotCheck, setLastAutopilotCheck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [lastActivityCount, setLastActivityCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // ✅ Memoize notification handler setter to prevent render loops - DISABLED
    // const handleNotificationSetup = useCallback((handler: (message: string, type?: 'success' | 'error' | 'info') => void) => {
    //   setNotificationHandler(() => handler);
    // }, []);
    // ✅ Analytics fetch function
    const fetchAnalytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[fetchAnalytics]": async ()=>{
            try {
                setAnalyticsLoading(true);
                // Fetch both Instagram and YouTube analytics in parallel
                const [instagramRes, youtubeRes] = await Promise.all([
                    fetch('https://lifestyle-design-backend-v2.onrender.com/api/instagram/analytics'),
                    fetch('https://lifestyle-design-backend-v2.onrender.com/api/youtube/analytics')
                ]);
                let instagramData = {};
                let youtubeData = {};
                if (instagramRes.ok) {
                    const igResult = await instagramRes.json();
                    if (igResult.success && igResult.analytics) {
                        instagramData = igResult.analytics;
                        console.log('✅ Instagram analytics loaded:', instagramData.formatted);
                    }
                } else {
                    console.warn('⚠️ Failed to load Instagram analytics');
                }
                if (youtubeRes.ok) {
                    const ytResult = await youtubeRes.json();
                    if (ytResult.success && ytResult.analytics) {
                        youtubeData = ytResult.analytics;
                        console.log('✅ YouTube analytics loaded:', youtubeData.formatted);
                    }
                } else {
                    // Don't spam console for known credential issues
                    if (youtubeRes.status === 400) {
                        console.warn('⚠️ YouTube analytics requires credentials configuration');
                    } else {
                        console.warn('⚠️ Failed to load YouTube analytics');
                    }
                }
                // Update stats with real data
                const igFormatted = instagramData.formatted;
                const ytFormatted = youtubeData.formatted;
                setStats({
                    "Dashboard.useCallback[fetchAnalytics]": (prevStats)=>({
                            instagram: {
                                followers: (igFormatted === null || igFormatted === void 0 ? void 0 : igFormatted.followers) || prevStats.instagram.followers,
                                engagement: (igFormatted === null || igFormatted === void 0 ? void 0 : igFormatted.engagement) || prevStats.instagram.engagement,
                                reach: (igFormatted === null || igFormatted === void 0 ? void 0 : igFormatted.reach) || prevStats.instagram.reach,
                                autoPostsPerDay: "".concat(status.maxPosts, "/day")
                            },
                            youtube: {
                                subscribers: (ytFormatted === null || ytFormatted === void 0 ? void 0 : ytFormatted.subscribers) || prevStats.youtube.subscribers,
                                watchTime: (ytFormatted === null || ytFormatted === void 0 ? void 0 : ytFormatted.watchTime) || prevStats.youtube.watchTime,
                                views: (ytFormatted === null || ytFormatted === void 0 ? void 0 : ytFormatted.views) || prevStats.youtube.views,
                                autoUploadsPerWeek: '2/week'
                            }
                        })
                }["Dashboard.useCallback[fetchAnalytics]"]);
            } catch (err) {
                console.error('❌ Failed to load analytics:', err);
            // Don't show notifications for analytics failures to avoid spam
            } finally{
                setAnalyticsLoading(false);
            }
        }
    }["Dashboard.useCallback[fetchAnalytics]"], [
        status.maxPosts
    ]);
    // ✅ NEW: Check for new autopilot activities and show notifications - DISABLED
    // const checkAutopilotNotifications = useCallback(async () => {
    //   if (!notificationHandler) return;
    //   
    //   try {
    //     // Get recent activity to check for new posts
    //     const res = await fetch('http://localhost:3002/api/activity/feed?limit=20');
    //     if (res.ok) {
    //       const data = await res.json();
    //       const activities = data.data || [];
    //       
    //       // Filter activities from the last 2 minutes
    //       const recentActivities = activities.filter((activity: any) => {
    //         const activityTime = new Date(activity.timestamp || activity.createdAt).getTime();
    //         return activityTime > lastAutopilotCheck;
    //       });
    //       
    //       // Show notifications for recent activities
    //       recentActivities.forEach((activity: any) => {
    //         const platform = activity.platform;
    //         const type = activity.type || 'post';
    //         const status = activity.status;
    //         
    //         if (type === 'post' && status === 'success') {
    //           // ✅ Success notifications disabled to prevent spam
    //           // if (platform === 'instagram') {
    //           //   notificationHandler('✅ Video posted to Instagram', 'success');
    //           // } else if (platform === 'youtube') {
    //           //   notificationHandler('✅ Video posted to YouTube', 'success');
    //           // }
    //         } else if (status === 'failed') {
    //           notificationHandler(`❌ Failed to post to ${platform}`, 'error');
    //         } else if (type === 'repost' && activity.message?.includes('already posted')) {
    //           notificationHandler('🧠 Skipped – Already posted in last 30 days', 'info');
    //         } else if (type === 'storage_check' && status === 'warning') {
    //           notificationHandler('⚠️ Storage warning – check S3/Mongo', 'error');
    //         }
    //       });
    //       
    //       setLastAutopilotCheck(Date.now());
    //     }
    //   } catch (error) {
    //     console.warn('⚠️ Could not check autopilot notifications:', error);
    //   }
    // }, [notificationHandler, lastAutopilotCheck]);
    // ✅ Comprehensive refresh function for all dashboard data
    const refreshAllData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[refreshAllData]": async ()=>{
            try {
                console.log('🔄 Refreshing all dashboard data...');
                // Refresh activity feed
                const posts = await fetchEnhancedActivity();
                setEnhancedActivity(posts);
                // Refresh queued posts
                await fetchQueuedPosts();
                // Check for autopilot notifications - DISABLED
                // await checkAutopilotNotifications();
                // Refresh analytics
                await fetchAnalytics();
                // Refresh status/settings
                try {
                    const res = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/settings');
                    if (res.ok) {
                        const data = await res.json();
                        setStatus({
                            autopilot: data.autopilot || false,
                            manual: data.manual !== false,
                            maxPosts: data.maxPosts || 3,
                            postTime: data.postTime || '14:00',
                            repostDelay: data.repostDelay || 1
                        });
                        // ✅ Update platform settings for ChartLines
                        if (data.autopilotPlatforms) {
                            setPlatformSettings({
                                instagram: data.autopilotPlatforms.instagram || false,
                                youtube: data.autopilotPlatforms.youtube || false
                            });
                        }
                    }
                } catch (settingsError) {
                    console.warn('⚠️ Settings refresh failed:', settingsError);
                }
                console.log('✅ All dashboard data refreshed');
            } catch (error) {
                console.error('❌ Failed to refresh dashboard data:', error);
            }
        }
    }["Dashboard.useCallback[refreshAllData]"], []);
    // ✅ NEW: Fetch queued/upcoming AutoPilot posts
    const fetchQueuedPosts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[fetchQueuedPosts]": async ()=>{
            try {
                console.log('🔍 Fetching upcoming AutoPilot posts...');
                const res = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/autopilot/queue?limit=3');
                if (res.ok) {
                    const data = await res.json();
                    const posts = data.posts || [];
                    console.log('📅 Upcoming posts:', posts);
                    setQueuedPosts(posts);
                    return posts;
                }
            } catch (error) {
                console.warn('⚠️ Could not fetch queued posts:', error);
                setQueuedPosts([]);
            }
            return [];
        }
    }["Dashboard.useCallback[fetchQueuedPosts]"], []);
    // ✅ NEW: Enhanced activity fetch function
    const fetchEnhancedActivity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[fetchEnhancedActivity]": async ()=>{
            try {
                // ✅ NEW: Get reactive chart data first
                const chartRes = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/chart/status');
                if (chartRes.ok) {
                    const chartData = await chartRes.json();
                    console.log('🔥 Chart reactive data:', chartData);
                    // Update reactive states for chart behavior
                    setEngagementScore(chartData.engagementScore || 0.65);
                    setAutopilotRunning(chartData.autopilotRunning || false);
                    setNewHighScore(chartData.newHighScore || false);
                    setLastPostSpike(chartData.lastPostTime);
                    // ✅ NEW: Update platform data for hearts
                    if (chartData.platformData) {
                        var _chartData_platformData_instagram, _chartData_platformData_instagram1, _chartData_platformData_instagram2, _chartData_platformData_youtube, _chartData_platformData_youtube1, _chartData_platformData_youtube2;
                        setPlatformData({
                            instagram: {
                                active: ((_chartData_platformData_instagram = chartData.platformData.instagram) === null || _chartData_platformData_instagram === void 0 ? void 0 : _chartData_platformData_instagram.active) || false,
                                todayPosts: ((_chartData_platformData_instagram1 = chartData.platformData.instagram) === null || _chartData_platformData_instagram1 === void 0 ? void 0 : _chartData_platformData_instagram1.todayPosts) || 0,
                                reach: ((_chartData_platformData_instagram2 = chartData.platformData.instagram) === null || _chartData_platformData_instagram2 === void 0 ? void 0 : _chartData_platformData_instagram2.reach) || 0,
                                engagement: engagementScore // Use global engagement score
                            },
                            youtube: {
                                active: ((_chartData_platformData_youtube = chartData.platformData.youtube) === null || _chartData_platformData_youtube === void 0 ? void 0 : _chartData_platformData_youtube.active) || false,
                                todayPosts: ((_chartData_platformData_youtube1 = chartData.platformData.youtube) === null || _chartData_platformData_youtube1 === void 0 ? void 0 : _chartData_platformData_youtube1.todayPosts) || 0,
                                reach: ((_chartData_platformData_youtube2 = chartData.platformData.youtube) === null || _chartData_platformData_youtube2 === void 0 ? void 0 : _chartData_platformData_youtube2.reach) || 0,
                                engagement: engagementScore // Use global engagement score
                            }
                        });
                    }
                    if (chartData.settings) {
                        setAutopilotVolume(chartData.settings.dailyPostLimit || 3);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Chart status not available');
            }
            try {
                // Try the main activity endpoint first
                const res = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/activity/feed?limit=20');
                if (res.ok) {
                    const data = await res.json();
                    const posts = data.data || [];
                    console.log('📊 Enhanced activity data:', posts.slice(0, 3)); // Debug
                    return posts;
                }
            } catch (error) {
                console.warn('⚠️ Enhanced activity not available, trying autopilot endpoint...');
            }
            try {
                // Try the new autopilot-specific activity endpoint
                const autopilotRes = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/autopilot/activity?limit=20');
                if (autopilotRes.ok) {
                    const autopilotData = await autopilotRes.json();
                    const posts = autopilotData.posts || [];
                    console.log('📊 Autopilot activity data:', posts.slice(0, 3)); // Debug
                    return posts;
                }
            } catch (autopilotError) {
                console.warn('⚠️ Autopilot activity endpoint not available, using final fallback...');
            }
            // No more fallbacks - use existing activity data
            console.warn('⚠️ All activity endpoints failed, using empty data');
            return [];
        }
    }["Dashboard.useCallback[fetchEnhancedActivity]"], []);
    // Helper function to format activity data
    const formatActivity = (activity)=>{
        const timeAgo = getTimeAgo(activity.createdAt);
        console.log("🕒 Activity ".concat(activity.type, ": ").concat(activity.createdAt, " -> ").concat(timeAgo));
        let title = '';
        let icon = '📊';
        switch(activity.type){
            case 'scrape':
                title = "Scraped ".concat(activity.postsProcessed, " Instagram posts");
                icon = '🔍';
                break;
            case 'schedule':
                title = "Queued ".concat(activity.postsSuccessful, " videos for posting");
                icon = '📅';
                break;
            case 'repost':
                if (activity.postsSuccessful > 0) {
                    title = "Posted ".concat(activity.postsSuccessful, " videos successfully");
                    icon = '✅';
                } else {
                    title = 'Checked for posts to publish';
                    icon = '🔄';
                }
                break;
            default:
                title = "".concat(activity.type, " completed");
                icon = '📊';
        }
        return {
            title,
            icon,
            timeAgo
        };
    };
    // Helper function to get time ago
    const getTimeAgo = (date)=>{
        const now = new Date();
        const activityDate = new Date(date);
        // Validate the date
        if (isNaN(activityDate.getTime())) {
            return 'Unknown time';
        }
        const diffMs = now.getTime() - activityDate.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        // Handle negative time differences (future dates)
        if (diffMs < 0) return 'Just now';
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return "".concat(diffMins, " minute").concat(diffMins > 1 ? 's' : '', " ago");
        if (diffHours < 24) return "".concat(diffHours, " hour").concat(diffHours > 1 ? 's' : '', " ago");
        if (diffDays < 7) return "".concat(diffDays, " day").concat(diffDays > 1 ? 's' : '', " ago");
        // For older dates, show actual date
        return activityDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };
    const instagramCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const youtubeCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const particlesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load settings and analytics from backend on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            async function fetchStatus() {
                try {
                    const res = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/settings');
                    if (res.ok) {
                        const data = await res.json();
                        setStatus({
                            autopilot: data.autopilot || false,
                            manual: data.manual !== false,
                            maxPosts: data.maxPosts || 3,
                            postTime: data.postTime || '14:00',
                            repostDelay: data.repostDelay || 1
                        });
                    } else {
                        console.warn('⚠️ No settings found, using defaults.');
                    }
                    // ✅ NEW: Fetch enhanced activity data and generate chart
                    try {
                        const posts = await fetchEnhancedActivity();
                        setEnhancedActivity(posts);
                        // Generate chart data for last 7 days
                        const today = new Date();
                        const last7 = [
                            ...Array(7)
                        ].map({
                            "Dashboard.useEffect.fetchStatus.last7": (_, i)=>{
                                const d = new Date(today);
                                d.setDate(today.getDate() - i);
                                return d.toISOString().split('T')[0];
                            }
                        }["Dashboard.useEffect.fetchStatus.last7"]).reverse();
                        const counts = {
                            instagram: {},
                            youtube: {}
                        };
                        last7.forEach({
                            "Dashboard.useEffect.fetchStatus": (date)=>{
                                counts.instagram[date] = 0;
                                counts.youtube[date] = 0;
                            }
                        }["Dashboard.useEffect.fetchStatus"]);
                        // Process enhanced activity data for chart
                        posts.forEach({
                            "Dashboard.useEffect.fetchStatus": (post)=>{
                                const date = new Date(post.startTime || post.timestamp).toISOString().split('T')[0];
                                if (last7.includes(date)) {
                                    const platform = post.platform || 'unknown';
                                    if (platform === 'instagram' || platform.includes('instagram')) {
                                        counts.instagram[date]++;
                                    }
                                    if (platform === 'youtube' || platform.includes('youtube')) {
                                        counts.youtube[date]++;
                                    }
                                }
                            }
                        }["Dashboard.useEffect.fetchStatus"]);
                        // 🔥 Create reactive chart data based on specifications
                        const createReactiveData = {
                            "Dashboard.useEffect.fetchStatus.createReactiveData": (platform, baseCounts)=>{
                                // ✅ Line Height Logic: AutoPilot status affects baseline
                                let baseValue;
                                if (!autopilotRunning) {
                                    // AutoPilot OFF: lines near bottom (low values)
                                    baseValue = 0.5; // Start near bottom
                                } else {
                                    // AutoPilot ON: height based on daily post limit
                                    const heightRatio = Math.min(autopilotVolume / 10, 0.8); // Max 80% of scale
                                    baseValue = 1 + heightRatio * 8; // Scale 1-9 based on volume
                                }
                                // 🔥 Engagement-Based Wave Enhancement
                                const engagementMultiplier = autopilotRunning ? 0.5 + engagementScore * 1.5 : 0.3;
                                // Apply reactive behavior to data points
                                return baseCounts.map({
                                    "Dashboard.useEffect.fetchStatus.createReactiveData": (count)=>{
                                        const enhancedValue = baseValue + count * engagementMultiplier;
                                        return Math.max(enhancedValue, 0.1); // Minimum visibility
                                    }
                                }["Dashboard.useEffect.fetchStatus.createReactiveData"]);
                            }
                        }["Dashboard.useEffect.fetchStatus.createReactiveData"];
                        // ⚡ Special Effects for New High Score
                        const glowIntensity = newHighScore ? 20 : 0;
                        const lineThickness = newHighScore ? 6 : 4; // 2px → 4px → 6px for extra glow
                        // 📊 Create enhanced chart data
                        setChartData({
                            labels: last7.map({
                                "Dashboard.useEffect.fetchStatus": (date)=>{
                                    const d = new Date(date);
                                    return d.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    });
                                }
                            }["Dashboard.useEffect.fetchStatus"]),
                            datasets: [
                                {
                                    label: 'Instagram',
                                    data: createReactiveData('instagram', last7.map({
                                        "Dashboard.useEffect.fetchStatus": (date)=>counts.instagram[date]
                                    }["Dashboard.useEffect.fetchStatus"])),
                                    borderColor: newHighScore ? '#ff69b4' : 'hotpink',
                                    backgroundColor: "rgba(255, 105, 180, ".concat(newHighScore ? 0.2 : 0.1, ")"),
                                    borderWidth: lineThickness,
                                    tension: 0.4 + engagementScore * 0.3,
                                    pointRadius: newHighScore ? 8 : 6,
                                    pointBackgroundColor: newHighScore ? '#ff1493' : 'hotpink',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2,
                                    fill: true,
                                    shadowOffsetX: glowIntensity,
                                    shadowOffsetY: glowIntensity,
                                    shadowBlur: glowIntensity,
                                    shadowColor: 'rgba(255, 105, 180, 0.6)'
                                },
                                {
                                    label: 'YouTube',
                                    data: createReactiveData('youtube', last7.map({
                                        "Dashboard.useEffect.fetchStatus": (date)=>counts.youtube[date]
                                    }["Dashboard.useEffect.fetchStatus"])),
                                    borderColor: newHighScore ? '#ff0000' : 'red',
                                    backgroundColor: "rgba(255, 0, 0, ".concat(newHighScore ? 0.2 : 0.1, ")"),
                                    borderWidth: lineThickness,
                                    tension: 0.4 + engagementScore * 0.3,
                                    pointRadius: newHighScore ? 8 : 6,
                                    pointBackgroundColor: newHighScore ? '#cc0000' : 'red',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2,
                                    fill: true,
                                    shadowOffsetX: glowIntensity,
                                    shadowOffsetY: glowIntensity,
                                    shadowBlur: glowIntensity,
                                    shadowColor: 'rgba(255, 0, 0, 0.6)'
                                }
                            ]
                        });
                        console.log('📊 Chart data generated:', counts);
                    } catch (enhancedErr) {
                        console.warn('⚠️ Enhanced activity failed, trying fallback...');
                    }
                    // Use scheduler status for autopilot data
                    try {
                        const schedulerRes = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/scheduler/status');
                        if (schedulerRes.ok) {
                            const schedulerData = await schedulerRes.json();
                            if (schedulerData.success) {
                                console.log('📊 Scheduler Status:', schedulerData.data);
                                setAutopilotRunning(schedulerData.data.running || false);
                            }
                        }
                    } catch (schedulerErr) {
                        console.warn('⚠️ Scheduler status not available:', schedulerErr);
                    }
                } catch (err) {
                    console.error('❌ Failed to load settings for dashboard:', err);
                }
            }
            fetchStatus();
            fetchAnalytics();
            // ✅ Enhanced periodic refresh for real-time updates
            const statusInterval = setInterval(fetchStatus, 30000); // Every 30 seconds for live metrics
            // ✅ Additional refresh for activity feed every 60 seconds
            const activityInterval = setInterval({
                "Dashboard.useEffect.activityInterval": async ()=>{
                    try {
                        const posts = await fetchEnhancedActivity();
                        setEnhancedActivity(posts);
                        console.log('🔄 Activity feed auto-refreshed');
                    } catch (error) {
                        console.warn('⚠️ Activity feed auto-refresh failed:', error);
                    }
                }
            }["Dashboard.useEffect.activityInterval"], 60000); // Every 60 seconds
            return ({
                "Dashboard.useEffect": ()=>{
                    clearInterval(statusInterval);
                    clearInterval(activityInterval);
                }
            })["Dashboard.useEffect"];
        }
    }["Dashboard.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            // Update stats when status changes
            setStats({
                "Dashboard.useEffect": (prevStats)=>({
                        ...prevStats,
                        instagram: {
                            ...prevStats.instagram,
                            autoPostsPerDay: "".concat(status.maxPosts, "/day")
                        }
                    })
            }["Dashboard.useEffect"]);
        }
    }["Dashboard.useEffect"], [
        status
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            // Create particles
            const createParticles = {
                "Dashboard.useEffect.createParticles": ()=>{
                    if (!particlesRef.current) return;
                    // Clear existing particles
                    particlesRef.current.innerHTML = '';
                    // Create 20 particles
                    for(let i = 0; i < 20; i++){
                        const particle = document.createElement('div');
                        particle.className = "particle ".concat(currentPlatform);
                        particle.style.left = Math.random() * 100 + '%';
                        particle.style.animationDelay = Math.random() * 20 + 's';
                        particle.style.animationDuration = 15 + Math.random() * 10 + 's';
                        particlesRef.current.appendChild(particle);
                    }
                }
            }["Dashboard.useEffect.createParticles"];
            createParticles();
        }
    }["Dashboard.useEffect"], [
        currentPlatform
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            // Draw charts
            const drawChart = {
                "Dashboard.useEffect.drawChart": (canvas, platform)=>{
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    let animationFrame = 0;
                    const animate = {
                        "Dashboard.useEffect.drawChart.animate": ()=>{
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            // Draw grid
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                            ctx.lineWidth = 1;
                            for(let i = 0; i <= 10; i++){
                                const y = canvas.height / 10 * i;
                                ctx.beginPath();
                                ctx.moveTo(0, y);
                                ctx.lineTo(canvas.width, y);
                                ctx.stroke();
                            }
                            // Calculate pulse effects based on real data and autopilot volume
                            const queueIntensity = Math.min(queueSize / 10, 1); // Max intensity at 10+ videos
                            const volumeIntensity = Math.min(autopilotVolume / 5, 1); // Max intensity at 5+ posts/day
                            const runningGlow = autopilotRunning ? 0.3 : 0;
                            const burstEffect = Date.now() - lastQueueUpdate < 5000 ? Math.sin(animationFrame * 0.5) * 0.5 : 0;
                            // Enhanced wave intensity based on queue size and autopilot volume
                            const baseAmplitude = 50;
                            const combinedIntensity = Math.max(queueIntensity, volumeIntensity);
                            const queueAmplitude = baseAmplitude * (0.5 + combinedIntensity * 0.5);
                            const secondaryAmplitude = 30 * (0.5 + combinedIntensity * 0.5);
                            // Draw animated line with dynamic intensity and speed based on volume
                            const points = [];
                            // Dynamic animation speed: 1/day = slow (0.05), 3+/day = fast (0.15)
                            const baseSpeed = 0.05;
                            const volumeSpeed = Math.min(autopilotVolume * 0.03, 0.1);
                            const animationSpeed = baseSpeed + volumeSpeed;
                            for(let i = 0; i <= 100; i++){
                                const x = canvas.width / 100 * i;
                                const y = canvas.height / 2 + Math.sin((i + animationFrame) * animationSpeed * 2) * queueAmplitude + Math.sin((i + animationFrame) * animationSpeed) * secondaryAmplitude;
                                points.push({
                                    x,
                                    y
                                });
                            }
                            // Add glow effect when autopilot is running
                            if (autopilotRunning || burstEffect > 0) {
                                const glowIntensity = runningGlow + Math.abs(burstEffect);
                                ctx.shadowColor = platform === 'youtube' ? '#ff0000' : '#e1306c';
                                ctx.shadowBlur = 20 * glowIntensity;
                                ctx.shadowOffsetX = 0;
                                ctx.shadowOffsetY = 0;
                            }
                            // Platform-specific gradient with dynamic opacity based on volume
                            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                            const opacity = 0.8 + combinedIntensity * 0.2 + runningGlow;
                            if (platform === 'youtube') {
                                gradient.addColorStop(0, "rgba(255, 0, 0, ".concat(opacity, ")"));
                                gradient.addColorStop(0.5, "rgba(255, 68, 68, ".concat(opacity, ")"));
                                gradient.addColorStop(1, "rgba(204, 0, 0, ".concat(opacity, ")"));
                            } else {
                                gradient.addColorStop(0, "rgba(255, 68, 88, ".concat(opacity, ")"));
                                gradient.addColorStop(0.5, "rgba(225, 48, 108, ".concat(opacity, ")"));
                                gradient.addColorStop(1, "rgba(131, 58, 180, ".concat(opacity, ")"));
                            }
                            ctx.strokeStyle = gradient;
                            // Dynamic line width: 1/day = thin (2px), 3+/day = thick (7px)
                            const baseLineWidth = 2;
                            const volumeLineWidth = Math.min(autopilotVolume * 1.5, 5);
                            ctx.lineWidth = baseLineWidth + volumeLineWidth + combinedIntensity * 2;
                            ctx.beginPath();
                            points.forEach({
                                "Dashboard.useEffect.drawChart.animate": (point, index)=>{
                                    if (index === 0) {
                                        ctx.moveTo(point.x, point.y);
                                    } else {
                                        ctx.lineTo(point.x, point.y);
                                    }
                                }
                            }["Dashboard.useEffect.drawChart.animate"]);
                            ctx.stroke();
                            // Add particle burst effect for new content
                            if (burstEffect > 0) {
                                const particleCount = Math.floor(queueSize / 2) + 3;
                                for(let p = 0; p < particleCount; p++){
                                    const px = Math.random() * canvas.width;
                                    const py = Math.random() * canvas.height;
                                    const size = Math.random() * 3 + 1;
                                    ctx.fillStyle = "rgba(255, 255, 255, ".concat(Math.abs(burstEffect) * 0.8, ")");
                                    ctx.beginPath();
                                    ctx.arc(px, py, size, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                            // Reset shadow for next frame
                            ctx.shadowBlur = 0;
                            animationFrame += 0.5;
                            requestAnimationFrame(animate);
                        }
                    }["Dashboard.useEffect.drawChart.animate"];
                    animate();
                }
            }["Dashboard.useEffect.drawChart"];
            drawChart(instagramCanvasRef.current, 'instagram');
            drawChart(youtubeCanvasRef.current, 'youtube');
        }
    }["Dashboard.useEffect"], [
        autopilotRunning,
        queueSize,
        lastQueueUpdate
    ]);
    const switchPlatform = async (platform)=>{
        try {
            console.log("Switching to ".concat(platform));
            setCurrentPlatform(platform);
            // ✅ Check if this platform is active in autopilot settings
            try {
                const settingsRes = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/settings');
                if (settingsRes.ok) {
                    var _settings_autopilotPlatforms;
                    const settings = await settingsRes.json();
                    const platformActive = ((_settings_autopilotPlatforms = settings.autopilotPlatforms) === null || _settings_autopilotPlatforms === void 0 ? void 0 : _settings_autopilotPlatforms[platform]) !== false;
                    if (!platformActive) {
                        showNotification("⚠️ ".concat(platform.charAt(0).toUpperCase() + platform.slice(1), " is currently disabled in autopilot settings"), 'error');
                    } else {
                        showNotification("📱 Switched to ".concat(platform.charAt(0).toUpperCase() + platform.slice(1)));
                    }
                } else {
                    showNotification("📱 Switched to ".concat(platform.charAt(0).toUpperCase() + platform.slice(1)));
                }
            } catch (settingsError) {
                console.warn('Could not check platform settings:', settingsError);
                showNotification("📱 Switched to ".concat(platform.charAt(0).toUpperCase() + platform.slice(1)));
            }
        } catch (error) {
            console.error('Error switching platform:', error);
            showNotification('❌ Error switching platform', 'error');
        }
    };
    const toggleMenu = ()=>{
        try {
            setMenuOpen(!menuOpen);
        } catch (error) {
            console.error('Error toggling menu:', error);
        }
    };
    const handleMenuClick = (action)=>{
        try {
            console.log('Menu action:', action);
            // Close menu first
            setMenuOpen(false);
            // Handle menu actions
            switch(action){
                case 'upload':
                    // Navigate to upload page
                    window.location.href = '/upload';
                    showNotification('📤 Opening Upload page...');
                    break;
                case 'manual':
                    // Navigate to manual post page
                    window.location.href = '/manual';
                    showNotification('✍️ Opening Manual Post page...');
                    break;
                case 'autopilot-page':
                    // Navigate to AutoPilot dashboard page
                    window.location.href = '/autopilot';
                    showNotification('🚀 Opening AutoPilot Dashboard...');
                    break;
                case 'settings':
                    // Navigate to settings page
                    window.location.href = '/settings';
                    showNotification('⚙️ Opening Settings...');
                    break;
                default:
                    console.warn('Unknown menu action:', action);
                    showNotification('❌ Unknown action: ' + action, 'error');
                    break;
            }
        } catch (error) {
            console.error('Error handling menu click:', error);
        }
    };
    const showNotification = function(message) {
        let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'success';
        try {
            // Create a temporary notification
            const notification = document.createElement('div');
            const bgColor = type === 'error' ? 'rgba(239, 68, 68, 0.9)' : type === 'info' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(34, 197, 94, 0.9)';
            notification.style.cssText = "\n        position: fixed;\n        top: 20px;\n        right: 20px;\n        background: ".concat(bgColor, ";\n        color: white;\n        padding: 1rem 1.5rem;\n        border-radius: 10px;\n        z-index: 10000;\n        backdrop-filter: blur(10px);\n        animation: slideIn 0.3s ease;\n        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n        border: 1px solid rgba(255, 255, 255, 0.1);\n        font-weight: 500;\n        max-width: 300px;\n      ");
            notification.textContent = message;
            document.body.appendChild(notification);
            // Remove notification after 3 seconds
            setTimeout(()=>{
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(()=>{
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    };
    const handleControlBtnClick = (e)=>{
        try {
            const parent = e.currentTarget.parentElement;
            if (parent) {
                const activeBtn = parent.querySelector('.control-btn.active');
                if (activeBtn) {
                    activeBtn.classList.remove('active');
                }
                e.currentTarget.classList.add('active');
            }
            showNotification("📊 Chart period changed to ".concat(e.currentTarget.textContent));
        } catch (error) {
            console.error('Error handling control button click:', error);
        }
    };
    // Manual Post Now handler
    const handleManualPostNow = async ()=>{
        if (manualPostRunning) return; // Prevent double clicks
        setManualPostRunning(true);
        try {
            const response = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/autopilot/manual-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.success) {
                showNotification('✅ Posted successfully!', 'success');
                // Refresh data
                fetchAnalytics();
                fetchEnhancedActivity();
            } else {
                showNotification('❌ Post failed', 'error');
            }
        } catch (error) {
            showNotification('❌ Connection error', 'error');
        }
        // Reset button after 2 seconds
        setTimeout(()=>{
            setManualPostRunning(false);
        }, 2000);
    };
    // Close menu when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            const handleClickOutside = {
                "Dashboard.useEffect.handleClickOutside": (e)=>{
                    const menuContainer = document.querySelector('.menu-container');
                    if (!(menuContainer === null || menuContainer === void 0 ? void 0 : menuContainer.contains(e.target)) && menuOpen) {
                        setMenuOpen(false);
                    }
                }
            }["Dashboard.useEffect.handleClickOutside"];
            document.addEventListener('click', handleClickOutside);
            return ({
                "Dashboard.useEffect": ()=>document.removeEventListener('click', handleClickOutside)
            })["Dashboard.useEffect"];
        }
    }["Dashboard.useEffect"], [
        menuOpen
    ]);
    // Keyboard shortcuts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            const handleKeyDown = {
                "Dashboard.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape' && menuOpen) {
                        setMenuOpen(false);
                    }
                    if (e.key === '1' && e.ctrlKey) {
                        e.preventDefault();
                        switchPlatform('instagram');
                    }
                    if (e.key === '2' && e.ctrlKey) {
                        e.preventDefault();
                        switchPlatform('youtube');
                    }
                    if (e.key === 'u' && e.ctrlKey) {
                        e.preventDefault();
                        handleMenuClick('upload');
                    }
                }
            }["Dashboard.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "Dashboard.useEffect": ()=>document.removeEventListener('keydown', handleKeyDown)
            })["Dashboard.useEffect"];
        }
    }["Dashboard.useEffect"], [
        menuOpen
    ]);
    // ✅ NEW: Real-time notification checking (every 10 seconds) - DISABLED
    // useEffect(() => {
    //   if (!notificationHandler) return;
    //   
    //   // Initialize check timestamp only once
    //   setLastAutopilotCheck(prev => prev === 0 ? Date.now() - 60000 : prev);
    //   
    //   // More frequent notification checking
    //   const notificationInterval = setInterval(checkAutopilotNotifications, 10000);
    //   
    //   return () => clearInterval(notificationInterval);
    // }, [notificationHandler]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "floating-particles",
                ref: particlesRef
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 963,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu-overlay ".concat(menuOpen ? 'show' : ''),
                onClick: ()=>setMenuOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 964,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "platform-switcher",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "platform-btn instagram ".concat(currentPlatform === 'instagram' ? 'active' : ''),
                                        onClick: ()=>switchPlatform('instagram'),
                                        children: "📷 Instagram"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 972,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "platform-btn youtube ".concat(currentPlatform === 'youtube' ? 'active' : ''),
                                        onClick: ()=>switchPlatform('youtube'),
                                        children: "▶️ YouTube"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 978,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 971,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "logo",
                                children: "Lifestyle Design Social"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 986,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "menu-container",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "menu-btn ".concat(menuOpen ? 'active' : ''),
                                                onClick: toggleMenu,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "menu-icon",
                                                    children: "⋮"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 991,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 990,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "dropdown-menu ".concat(menuOpen ? 'show' : ''),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "menu-item",
                                                        onClick: ()=>handleMenuClick('upload'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "menu-item-icon",
                                                                children: "📤"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 995,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Upload Videos"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 996,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 994,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "menu-item",
                                                        onClick: ()=>handleMenuClick('manual'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "menu-item-icon",
                                                                children: "✍"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1000,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Manual Post"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1001,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 999,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "menu-item",
                                                        onClick: ()=>handleMenuClick('autopilot-page'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "menu-item-icon",
                                                                children: "🚀"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1004,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "AutoPilot Dashboard"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1005,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1003,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "menu-item",
                                                        onClick: ()=>handleMenuClick('settings'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "menu-item-icon",
                                                                children: "⚙"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1008,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Settings"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1009,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1007,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 993,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 989,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "user-profile",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "avatar",
                                                children: "SM"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1015,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "status-indicator"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1016,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1014,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 988,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 970,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "instagram-data",
                        className: "platform-data ".concat(currentPlatform === 'instagram' ? 'active' : ''),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metrics-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Followers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1028,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "metric-icon",
                                                        children: "👥"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1029,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1027,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value",
                                                children: stats.instagram.followers
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1031,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change change-positive",
                                                children: "↗ +5.2% this week"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1032,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1026,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Engagement Rate"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1039,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "metric-icon",
                                                        children: "❤️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1040,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1038,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value",
                                                children: stats.instagram.engagement
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1042,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change change-positive",
                                                children: "↗ +0.8% from last post"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1043,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Reach"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1050,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "metric-icon",
                                                        children: "📊"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1051,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1049,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value",
                                                children: stats.instagram.reach
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1053,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change change-positive",
                                                children: "↗ +12.4% today"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1054,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1048,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Auto-Post Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1061,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "auto-post-status ".concat(autopilotStatus === 'error' ? 'inactive' : ''),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "status-indicator ".concat(autopilotStatus === 'running' ? 'pulsing' : '')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1063,
                                                                columnNumber: 19
                                                            }, this),
                                                            autopilotStatus === 'running' ? 'Running...' : autopilotStatus === 'success' ? 'Posted!' : autopilotStatus === 'error' ? 'Failed' : status.autopilot ? 'Active' : 'Inactive'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1062,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1060,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value",
                                                children: [
                                                    status.maxPosts,
                                                    "/day"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1070,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change",
                                                children: [
                                                    "Next post at ",
                                                    status.postTime,
                                                    " (delay: ",
                                                    status.repostDelay,
                                                    "d)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1071,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1059,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1025,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-layout",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1079,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HeartStatusCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1082,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1077,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "manual-post-panel",
                                style: {
                                    marginTop: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '15px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleManualPostNow,
                                    disabled: manualPostRunning,
                                    className: "manual-post-button",
                                    style: {
                                        backgroundColor: manualPostRunning ? '#666' : '#E1306C',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: manualPostRunning ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 12px rgba(225, 48, 108, 0.3)',
                                        transition: 'all 0.3s ease',
                                        opacity: manualPostRunning ? 0.6 : 1
                                    },
                                    onMouseEnter: (e)=>{
                                        if (!manualPostRunning) {
                                            e.currentTarget.style.backgroundColor = '#C13584';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(225, 48, 108, 0.4)';
                                        }
                                    },
                                    onMouseLeave: (e)=>{
                                        if (!manualPostRunning) {
                                            e.currentTarget.style.backgroundColor = '#E1306C';
                                            e.currentTarget.style.transform = 'translateY(0px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(225, 48, 108, 0.3)';
                                        }
                                    },
                                    children: manualPostRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    animation: 'spin 1s linear infinite'
                                                },
                                                children: "⏳"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1129,
                                                columnNumber: 19
                                            }, this),
                                            "Posting..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: "⚡ Post Now"
                                    }, void 0, false)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 1092,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1086,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-layout",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RecentAutoPilotPostsWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        platform: "instagram"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1144,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1145,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1142,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 1024,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "youtube-data",
                        className: "platform-data ".concat(currentPlatform === 'youtube' ? 'active' : ''),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "metrics-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card youtube",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Subscribers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1154,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "metric-icon youtube",
                                                        children: "📺"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1155,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1153,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value youtube",
                                                children: stats.youtube.subscribers
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1157,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change change-positive",
                                                children: "↗ +3.8% this month"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1158,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card youtube",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Watch Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1165,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "metric-icon youtube",
                                                        children: "⏱️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1166,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1164,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value youtube",
                                                children: stats.youtube.watchTime
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1168,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change change-positive",
                                                children: "↗ +15.7% hours this week"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1169,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card youtube",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Views"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1176,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "metric-icon youtube",
                                                        children: "👁️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1177,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1175,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value youtube",
                                                children: stats.youtube.views
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1179,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change change-positive",
                                                children: "↗ +8.3% this week"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1180,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1174,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "metric-card youtube",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-title",
                                                        children: "Auto-Upload"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1187,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "auto-post-status ".concat(autopilotStatus === 'error' ? 'inactive' : ''),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "status-indicator ".concat(autopilotStatus === 'running' ? 'pulsing' : '')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 1189,
                                                                columnNumber: 19
                                                            }, this),
                                                            autopilotStatus === 'running' ? 'Running...' : autopilotStatus === 'success' ? 'Posted!' : autopilotStatus === 'error' ? 'Failed' : status.autopilot ? 'Active' : 'Inactive'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 1188,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1186,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-value youtube",
                                                children: [
                                                    status.maxPosts,
                                                    "/day"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1196,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric-change",
                                                children: [
                                                    "Next upload at ",
                                                    status.postTime,
                                                    " (delay: ",
                                                    status.repostDelay,
                                                    "d)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 1197,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1185,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-layout",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HeartStatusCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid-layout",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RecentAutoPilotPostsWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        platform: "youtube"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 1214,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 1211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 1150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chart-descriptions",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "description-container",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "description-title",
                                    children: "Dashboard Analytics Overview"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 1221,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "description-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "description-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "description-icon",
                                                    children: "🌊"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1225,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: "Dynamic Wave Chart"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1226,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Real-time engagement visualization with adaptive wave patterns. Wave amplitude reflects current engagement levels, while animation speed corresponds to posting volume. Glowing effects indicate new performance records."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1227,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 1224,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "description-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "description-icon",
                                                    children: "📊"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: "Platform Chart Lines"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1232,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Interactive status indicators for Instagram (pink) and YouTube (red) autopilot systems. Bar height represents daily post volume configuration, with smooth animations reflecting platform activity and engagement."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1233,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 1230,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 1223,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "description-legend",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "legend-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "legend-color pink"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Instagram Autopilot"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1240,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 1238,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "legend-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "legend-color red"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1243,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "YouTube Autopilot"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1244,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 1242,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "legend-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "legend-glow"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1247,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "New Performance Record"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 1248,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 1246,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 1237,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 1220,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 1219,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 969,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 962,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "wJX1uF6kIM5beDvhUxIkR41sD2Q=");
_c = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_5d0ca532._.js.map