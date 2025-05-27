import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

// Pointer lock controls
const controls = {
  enabled: false,
  speed: 0.1,
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3(),
};

const onMouseMove = (event) => {
  if (!controls.enabled) return;

  camera.rotation.y -= event.movementX * 0.002;
  camera.rotation.x -= event.movementY * 0.002;
  camera.rotation.x = Math.max(-Math.PI /2, Math.min(Math.PI / 2, camera.rotation.x));

  cube.position.x += event.movementX * 0.01;
  cube.position.y -= event.movementY * 0.01;
};

document.addEventListener('mousemove', onMouseMove, false);

document.addEventListener('click', () => {
  document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  controls.enabled = document.pointerLockElement === document.body;
});

const keys = {};
document.addEventListener('keydown', (event) => keys[event.code] = true);
document.addEventListener('keyup', (event) => keys[event.code] = false);

const updateMovement = () => {
  if (!controls.enabled) return;

  controls.direction.set(0, 0, 0);
  if (keys['KeyW']) cube.position.y += controls.speed;
  if (keys['KeyS']) cube.position.y -= controls.speed;
  if (keys['KeyA']) cube.position.x -= controls.speed;
  if (keys['KeyD']) cube.position.x += controls.speed;
};

// Basic scnee objects
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.set(0, 1.6, -5);

camera.position.set(0, 1.6, 5);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  updateMovement();
  renderer.render(scene, camera);
};

animate();
