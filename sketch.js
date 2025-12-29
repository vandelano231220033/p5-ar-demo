let reticlePos = null;
let humSound;
let theCorridor;
let theGate;
let myObjPos = {x:0, y:0, z:-2}; // Posisi objek (misal: 2m di depan)

function preload() {
  humSound = loadSound('fire_crackling.mp3', () => console.log("Sound ready"));
  theCorridor = loadModel('corridor.obj', true);
  theGate = loadModel('gate.obj', true);
}

function getReticlePosition() {
  // hasil raycast dari AR framework
  // biasanya berupa vector {x, y, z}
}

function setup() {
  createARCanvas(WEBGL);
  // Loop suara agar terus berbunyi
  humSound.loop();
}

function draw() {
  // 1. Pencahayaan (Wajib agar model terlihat)
  ambientLight(150);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // 2. Dapatkan Reticle
  let pos = getReticlePosition();
  
    if (pos) {
    push();
    translate(pos.x, pos.y, pos.z);
    texture(tex);
    torus(0.03, 0.005);
    pop();
  }
    
    // 3. Animasi Melayang (Floating)
    // Naik turun setinggi 0.2 meter
    let hover = Math.sin(frameCount * 0.05) * 0.2;
    translate(0, hover, 0);
    
    // 4. Animasi Rotasi
    rotateY(frameCount * 0.5); 

    // 5. Tampilkan Model
    scale(0.5); // Kecilkan 50%
    specularMaterial(50);
    noStroke();
    model(theCorridor);
    model(theGate);
    
}

function mouseClicked() {
   // Klik untuk play/pause BGM
   if (humSound.isPlaying()) {
     humSound.pause();
   } else {
     humSound.play();
   }
}