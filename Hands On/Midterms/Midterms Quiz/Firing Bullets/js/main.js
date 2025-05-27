import * as THREE from 'three';
//import { PointerLockControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/PointerLockControls.js';
import { PointerLockControls } from './PointerLockControls.js';

// Scene, Camera, and Renderer Setup
const scene = new THREE.Scene();

// Load background texture
/*const backgroundTexture = new THREE.TextureLoader().load('assets/alien.jpg');
scene.background = backgroundTexture;
*/
scene.background = new THREE.Color(0x100c08);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);
document.getElementById('ui').addEventListener('click', () => {
  controls.lock();

});

controls.addEventListener('lock', () => {
  document.getElementById('ui').classList.add('disabled');
});

controls.addEventListener('unlock', () => {
  document.getElementById('ui').classList.remove('disabled');
});

scene.add(controls.getObject());

// Add a light source to ensure bullets are visible
const bulletLight = new THREE.PointLight(0xffffff, 1, 10);
scene.add(bulletLight);

// Shooting Bullets
const bullets = [];
const bulletSpeed = 2; // Increased speed for better visibility
const bulletGeometry = new THREE.SphereGeometry(1, 32, 32);
const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 1, roughness: 0.25, emissive: 0xe52b50, emissiveIntensity: 1 });

function shootBullet() {
  if (!controls.isLocked) return; // ensure pointer lock is active

  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Set bullet start position slightly in front of the camera
  bullet.position.copy(camera.position).add(direction.multiplyScalar(2));
  bullet.velocity = new THREE.Vector3().copy(direction).multiplyScalar(bulletSpeed);

  bullets.push(bullet);
  scene.add(bullet);

  // Move the light with the bullet for better visibility
  bulletLight.position.copy(bullet.position);

  console.log("Bullet fired", bullet.position, bullet); // Debugging info
}

document.addEventListener('click' ,shootBullet); // ensure left click triggers bullet shooting

function updateBullets() {
  for (let i = bullets.length -1; i>=0; i--) {
    bullets[i].position.add(bullets[i].velocity);

    // Move the light with the bullet
    bulletLight.position.copy(bullets[i].position);

    // Remove bullets that go too far
    if (bullets[i].position.length() > 100) {
      scene.remove(bullets[i]);
      bullets.splice(i, 1);
    }
  }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    updateBullets();
    renderer.render(scene, camera);
}

animate();
