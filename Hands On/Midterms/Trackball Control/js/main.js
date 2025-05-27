import * as THREE from 'three';
import { TrackballControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/TrackballControls.js';

// Get container
const container = document.getElementById('threejsContainer');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Add a simple object (a spinning cube)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Trackball Contorls
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 100;
controls.zoomSpeed = 50;
controls.panSpeed = 0.8;

// Handle windowR resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // required for smooth controls
  renderer.render(scene, camera);
}
animate();
