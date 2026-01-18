let reticlePos = null;
let humSound;
let woodenBoxes;
let placementSound;
let woodenTexture;

function preload() {
  // optional assets; replace with your own files or comment out if unused
  try { humSound = loadSound('fire_crackling.mp3'); } catch(e){}
  try { woodenBoxes = loadModel('Boxes.obj', true); } catch(e){}
  try { placementSound = loadSound('placement.mp3'); } catch(e){}
  try { woodenTexture = loadImage('wooden_texture.jpg'); } catch(e){}
}

function setup() {
  // use AR helper to create canvas (handles resize)
  AR.createARCanvas(WEBGL);
  AR.setReticleDistance(2.0);

  // place anchor on tap/click
  AR.onSelect((anchor)=>{
    console.log('Placed anchor', anchor.id, anchor.pos);
    if (placementSound && typeof placementSound.play === 'function') placementSound.play();
  });

  // show debug overlay
  AR.createDebugOverlay();

  // resume audio context for sounds
  if (typeof getAudioContext === 'function') {
    getAudioContext().resume().then(() => {
      console.log('Audio context resumed');
      // loop background sound if available
      if (humSound && typeof humSound.loop === 'function') humSound.loop();
    }).catch(err => console.log('Audio resume failed', err));
  } else {
    // fallback
    if (humSound && typeof humSound.loop === 'function') humSound.loop();
  }
}

function draw() {
  // In WebXR, don't set background to avoid blacking out camera feed
  if (!window.isWebXR) {
    background(0);
  }

  console.log('Draw loop, isWebXR:', window.isWebXR);

  // lighting
  ambientLight(120);
  directionalLight(255,255,255, 0,0,-1);

  // reticle follows pointer (only in fallback mode)
  if (!window.isWebXR) {
    let pos = AR.getReticlePosition();
    if (pos) {
      push();
      translate(pos.x, pos.y, pos.z);
      noStroke();
      emissiveMaterial(255,180,0);
      torus(0.03, 0.006);
      pop();
    }
  }

  // draw anchors
  AR.drawAnchors();

  // Example: for each anchor, draw the wooden boxes model
  const anchors = AR.getAnchors();
  for (let a of anchors) {
    AR.transformToAnchor(a, ()=>{
      push();
      rotateY(frameCount * 0.02);
      scale(0.4);
      noStroke();
      if (woodenTexture) texture(woodenTexture);
      if (woodenBoxes) {
        model(woodenBoxes);
      } else {
        box(0.3, 0.3, 0.3);
      }
      pop();
    });
  }
}

function mouseClicked() {
  // toggle sound if present
  if (humSound && typeof humSound.isPlaying === 'function') {
    if (humSound.isPlaying()) humSound.pause(); else humSound.play();
  }
}