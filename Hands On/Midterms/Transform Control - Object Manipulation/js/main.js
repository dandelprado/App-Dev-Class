import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/TransformControls.js';

//Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth /window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

//Orbit Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Grid helper
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position camera
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);

// Transform Controls
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.attach(cube);
scene.add(transformControls);

// Disable OrbitControls when using TransformControls
transformControls.addEventListener('dragging-changed', function (event) {
  orbitControls.enabled = !event.value;
});

// Change transform mode with keyboard input
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 't':
      transformControls.setMode('translate');
      break;
    case 'r':
      transformControls.setMode('rotate');
      break;
    case 's':
      transformControls.setMode('scale');
      break;
    }
  });

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  });
