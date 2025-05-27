import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

// Raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to get random color
function getRandomColor() {
  return Math.floor(Math.random() * 16777215);
}

// Create objects in a line
const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1, 4, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
capsule.position.set(-3, 0, -5);
scene.add(capsule);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
plane.position.set(-1, 0, -5);
scene.add(plane);

const circle = new THREE.Mesh(new THREE.CircleGeometry(), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
circle.position.set(1, 0, -5);
scene.add(circle);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
torus.position.set(3, 0, -5);
scene.add(torus);

// Position the camera
camera.position.z = 5;

// Mouse click event listener
function onMouseClick(event) {
  // convert mouse coordinates to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update raycaster
  raycaster.setFromCamera(mouse, camera);

  // check for intersections
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    intersects[0].object.material.color.set(getRandomColor()); //change to random color on click
  }
}

// Add event listener
window.addEventListener('click', onMouseClick);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
