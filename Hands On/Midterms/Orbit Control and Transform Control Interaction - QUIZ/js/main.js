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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
// Grid helper
/*const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
*/

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 1.5);
scene.add(cube);

const material2 = new THREE.MeshBasicMaterial({ color: 0xffa500 });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.set(2, 0, 0);
scene.add(cube2);

const material3 = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
const cube3 = new THREE.Mesh(geometry, material3);
cube3.position.set(-2, 0, 0);
scene.add(cube3);

const material4 = new THREE.MeshBasicMaterial({ color: 0x008000, wireframe: true });
const cube4 = new THREE.Mesh(geometry, material4);
cube4.position.set(0, 0, -4);
scene.add(cube4);


// Position camera
camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

// Transform Controls
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.attach(cube);
scene.add(transformControls);

const transformControls2 = new TransformControls(camera, renderer.domElement);
transformControls2.attach(cube2);
scene.add(transformControls2);

const transformControls3 = new TransformControls(camera, renderer.domElement);
transformControls3.attach(cube3);
scene.add(transformControls3);

const transformControls4 = new TransformControls(camera, renderer.domElement);
transformControls4.attach(cube4);
scene.add(transformControls4);

// Disable OrbitControls when using TransformControls
transformControls.addEventListener('dragging-changed', function (event) {
  orbitControls.enabled = !event.value;
});


const legend = document.createElement('div');
legend.style.position = 'absolute';
legend.style.top = '10px';
legend.style.left = '10px';
legend.style.padding = '5px';
legend.style.color = '#fff';
legend.style.fontFamily = 'sans-serif';
legend.innerHTML = `
  PRESS Keyboard Key <br />
  T - Transform Object<br />
  R - Remove/Hide Transform Control<br />
  A - Activate/Show TransformControl<br />
  D - Disable TransformControl<br />
  E - Enable TransformControl<br />
  S - Scale Object
`;
document.body.appendChild(legend);

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 't':
      transformControls.setMode('translate');
      break;
    case 's':
      transformControls.setMode('scale');
      break;
    case 'r':
      scene.remove(transformControls);
      break;
    case 'a':
      scene.add(transformControls);
      break;
    case 'd':
      transformControls.enabled = false;
      break;
    case 'e':
      transformControls.enabled = true;
      break;
  }
});



window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 't':
      transformControls.setMode('translate');
      transformControls2.setMode('translate');
      transformControls3.setMode('translate');
      transformControls4.setMode('translate');
      break;
    case 's':
      transformControls.setMode('scale');
      transformControls2.setMode('scale');
      transformControls3.setMode('scale');
      transformControls4.setMode('scale');
      break;
    case 'r':
      scene.remove(transformControls);
      scene.remove(transformControls2);
      scene.remove(transformControls3);
      scene.remove(transformControls4);
      break;
    case 'a':
      scene.add(transformControls);
      scene.add(transformControls2);
      scene.add(transformControls3);
      scene.add(transformControls4);
      break;
    case 'd':
      transformControls.enabled = false;
      transformControls2.enabled = false;
      transformControls3.enabled = false;
      transformControls4.enabled = false;
      break;
    case 'e':
      transformControls.enabled = true;
      transformControls2.enabled = true;
      transformControls3.enabled = true;
      transformControls4.enabled = true
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
