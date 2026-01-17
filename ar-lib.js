// Simple AR helper library for p5.js
// Provides WebXR hit-test when available, fallback simulated AR experience (reticle + anchors)
// Usage: AR.createARCanvas(WEBGL); AR.onSelect(cb); AR.getReticlePosition(); AR.drawAnchors();
(function(global){
  const AR = {};
  let anchors = [];
  AR.reticleDistance = 2.0;
  let isWebXR = false;
  let xrHitResults = [];

  AR.createARCanvas = function(mode){
    // Check if p5.xr is loaded (it overrides createCanvas and adds createARCanvas)
    if (typeof createARCanvas === 'function') {
      createARCanvas(mode);
      isWebXR = true;
    } else {
      if (typeof createCanvas === 'function') {
        if (mode === WEBGL) createCanvas(windowWidth, windowHeight, WEBGL);
        else createCanvas(windowWidth, windowHeight);
      }
      isWebXR = false;
    }
    window.addEventListener('resize', ()=>{ if (typeof resizeCanvas === 'function') resizeCanvas(windowWidth, windowHeight); });
  };

  // Returns {x,y,z,vec} where z is negative-forward in p5 WEBGL
  AR.getReticlePosition = function(){
    if (isWebXR && typeof xrHitTest === 'function') {
      // Use WebXR hit-test for real AR
      xrHitResults = xrHitTest();
      if (xrHitResults.length > 0) {
        const hit = xrHitResults[0]; // first hit
        const pos = hit.pose.transform.position;
        const vec = (typeof createVector === 'function') ? createVector(pos.x, pos.y, pos.z) : {x:pos.x, y:pos.y, z:pos.z};
        return {x: pos.x, y: pos.y, z: pos.z, vec};
      }
    }
    // Fallback: Map mouse position to a point in front of the camera at reticleDistance
    // This is a simple, robust fallback for demos and works without WebXR.
    let nx = (typeof mouseX === 'number') ? (mouseX - (width/2)) / (width/2) : 0;
    let ny = (typeof mouseY === 'number') ? (mouseY - (height/2)) / (height/2) : 0;
    // scale factors to make motion feel natural
    const scale = AR.reticleDistance * 0.6;
    const x = nx * scale;
    const y = -ny * scale;
    const z = -AR.reticleDistance;
    const vec = (typeof createVector === 'function') ? createVector(x,y,z) : {x,y,z};
    return {x,y,z,vec};
  };

  AR.setReticleDistance = function(meters){ AR.reticleDistance = meters; };

  AR.placeAnchor = function(pos){
    const p = {x: pos.x, y: pos.y, z: pos.z};
    const a = { id: (Date.now() + Math.random()).toString(36), pos: p, rot:{x:0,y:0,z:0} };
    anchors.push(a);
    return a;
  };

  AR.getAnchors = function(){ return anchors; };

  AR.clearAnchors = function(){ anchors = []; };

  AR.drawAnchors = function(){
    if (!anchors.length) return;
    push();
    for (let a of anchors){
      push();
      translate(a.pos.x, a.pos.y, a.pos.z);
      noStroke();
      emissiveMaterial(0,160,255);
      sphere(0.03);
      pop();
    }
    pop();
  };

  AR.onSelect = function(cb){
    // Bind pointer/tap to place anchor at current reticle
    const handler = function(e){
      // prevent accidental focus issues
      if (typeof e !== 'undefined' && e.type === 'pointerdown') e.preventDefault && e.preventDefault();
      const p = AR.getReticlePosition();
      const a = AR.placeAnchor(p);
      if (typeof cb === 'function') cb(a);
    };
    // Use p5 canvas if available
    try {
      if (typeof canvas !== 'undefined' && canvas instanceof HTMLCanvasElement) {
        canvas.addEventListener('pointerdown', handler);
        return;
      }
    } catch(e){}
    window.addEventListener('pointerdown', handler);
  };

  AR.transformToAnchor = function(anchor, drawFunc){
    push();
    translate(anchor.pos.x, anchor.pos.y, anchor.pos.z);
    if (typeof drawFunc === 'function') drawFunc();
    pop();
  };

  AR.createDebugOverlay = function(){
    const div = document.createElement('div');
    div.className = 'ar-debug';
    div.innerHTML = isWebXR ? 'WebXR Mode' : 'Fallback Mode';
    document.body.appendChild(div);
    // Update periodically
    setInterval(() => {
      div.innerHTML = isWebXR ? 'WebXR Mode' : 'Fallback Mode';
    }, 1000);
  };

  // Expose to global scope
  global.AR = AR;

})(window);
