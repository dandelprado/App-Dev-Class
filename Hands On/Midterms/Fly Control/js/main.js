import * as THREE from 'three';
import { FlyControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/FlyControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

// video element
const video = document.createElement('video');
video.src = 'assets/videos/planet.mp4';
video.loop = true;
video.muted = true;
video.play();

// video texture
const videoTexture = new THREE.VideoTexture(video);

// Add a simple grid and light
const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, -5, -1);
scene.add(light);


const ambientLight = new THREE.AmbientLight(0xff0000, 0.5);
scene.add(ambientLight);

const runwayTexture = new THREE.TextureLoader().load('assets/runway.jpg');scene.background = runwayTexture;

// Create and add a sphere at the scene
const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: videoTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 5, -10);
scene.add(sphere);

// FlyContorls setup
const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 12;
controls.autoForward = false;
controls.dragToLook = true;

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}
animate()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
