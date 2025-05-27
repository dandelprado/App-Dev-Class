import * as THREE from 'three';
import { PointerLockControls } from './PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5c4033);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);

document.getElementById('ui').addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  const uiElement = document.getElementById('ui');
  if (uiElement) uiElement.classList.add('disabled');
});
controls.addEventListener('unlock', () => {
  const uiElement = document.getElementById('ui');
  if (uiElement) uiElement.classList.remove('disabled');
});

scene.add(controls.getObject());

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

const bulletLight = new THREE.PointLight(0xffffff, 1, 10);
scene.add(bulletLight);

const textureLoader = new THREE.TextureLoader();
const enemyTexture = textureLoader.load('assets/alien.jpg');

const enemies = [];
const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
const enemyMaterial = new THREE.MeshStandardMaterial({
  color: 0x43cd80,
  map: enemyTexture,
});

const gunshotSound = new Audio('assets/audio/gunshot.mp3');

for (let i = 0; i < 20; i++) {
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  enemy.position.set(Math.random() * 50 - 25, 1, Math.random() * 50 - 25);
  scene.add(enemy);
  enemies.push(enemy);
}

const bullets = [];
const bulletSpeed = 2;
const bulletGeometry = new THREE.SphereGeometry(0.2, 18, 18);
const bulletMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  metalness: 1,
  roughness: 0.25,
  emissive: 0xe52b50,
  emissiveIntensity: 1,
});

function shootBullet() {
  if (!controls.isLocked) return; 

  gunshotSound.currentTime = 0;
  gunshotSound.play();

  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Position the bullet a bit ahead of the camera.
  bullet.position.copy(camera.position).add(direction.multiplyScalar(2));
  bullet.velocity = new THREE.Vector3().copy(direction).multiplyScalar(bulletSpeed);

  bullets.push(bullet);
  scene.add(bullet);

  bulletLight.position.copy(bullet.position);

  console.log("Bullet fired", bullet.position);
}

document.addEventListener('click', shootBullet);

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].position.add(bullets[i].velocity);
    bulletLight.position.copy(bullets[i].position);

    // Remove bullets that have traveled too far
    if (bullets[i].position.length() > 100) {
      scene.remove(bullets[i]);
      bullets.splice(i, 1);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateBullets();
  renderer.render(scene, camera);
}

animate();
