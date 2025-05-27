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

const textureLoader1 = new THREE.TextureLoader();
const floorTexture = textureLoader1.load('assets/floor.jpg', () => {
  renderer.render(scene, camera);
});
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(400, 400);
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

const bulletLight = new THREE.PointLight(0xffffff, 1, 10);
scene.add(bulletLight);

const textureLoader2 = new THREE.TextureLoader();
const enemyTexture = textureLoader2.load('assets/alien.jpg');

const enemies = [];
const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
const enemyMaterial = new THREE.MeshStandardMaterial({
  color: 0x43cd80,
  map: enemyTexture,
});

const gunshotSound = new Audio('assets/audio/gunshot.mp3');

for (let i = 0; i < 5; i++) {
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  enemy.position.set(Math.random() * 50 - 25, 1, Math.random() * 50 - 25);
  scene.add(enemy);
  enemies.push(enemy);
}

const enemySpotlight = new THREE.SpotLight(0x66ff00);
enemySpotlight.angle = 0.02;
enemySpotlight.penumbra = 0.1;
enemySpotlight.distance = 100;
enemySpotlight.intensity = 50;
scene.add(enemySpotlight);

const crosshairTarget = new THREE.Object3D();
scene.add(crosshairTarget);
enemySpotlight.target = crosshairTarget;

const bullets = [];
const bulletSpeed = 7;
const bulletGeometry = new THREE.SphereGeometry(0.2, 18, 18);
const bulletMaterial = new THREE.MeshStandardMaterial({
  color: 0xe52b50,
  metalness: 1,
  roughness: 0.25,
  emissive: 0xe52b50,
  emissiveIntensity: 1,
});

function isEnemyInSpotlight(enemy) {
  const angle = camera
    .getWorldDirection(new THREE.Vector3())
    .angleTo(enemy.position.clone().sub(camera.position).normalize());
  return angle < 0.07; 
}


function shootBullet() {
  if (!controls.isLocked) return; 

  gunshotSound.currentTime = 0;
  gunshotSound.play();

  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Position the bullet a bit ahead of the camera.
  bullet.position.copy(camera.position).add(direction.multiplyScalar(0.15));
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

    for (let j = enemies.length - 1; j >= 0; j--) {
      const distance = bullets[i].position.distanceTo(enemies[j].position);
      if (distance < 2 && isEnemyInSpotlight(enemies[j])) {
        scene.remove(enemies[j]);
        enemies.splice(j, 1);
        scene.remove(bullets[i]);
        bullets.splice(i, 1);
        break;
      }
    }

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

  enemySpotlight.position.copy(camera.position);
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  crosshairTarget.position.copy(camera.position).add(direction.multiplyScalar(50));
  renderer.render(scene, camera);
}

animate();


