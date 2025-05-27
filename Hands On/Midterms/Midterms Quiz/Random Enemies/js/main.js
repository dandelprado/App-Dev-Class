import * as THREE from 'three';
//import { PointerLockControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/PointerLockControls.js';
import { PointerLockControls } from './PointerLockControls.js';

// Scene and Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Set initial position for better visibility

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

controls.addEventListener('lock', () => {
  console.log("Pointerlocked");
  const uiElement = document.getElementById('ui');
  if (uiElement) uiElement.remove();
});

scene.add(controls.getObject());

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Load Enemy Texture
const textureLoader = new THREE.TextureLoader();
const enemyTexture = textureLoader.load('assets/alien.jpg'
);

// Enemies
const enemies = [];
const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x43cd80, map: enemyTexture });

for (let i = 0; i < 20; i++) {
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  enemy.position.set(Math.random() * 50 - 25, 1, Math.random() * 50 - 25);
  scene.add(enemy);
  enemies.push(enemy);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
