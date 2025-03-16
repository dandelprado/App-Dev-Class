import * as THREE from 'three';

// Get the container element
const container = document.getElementById('threejsContainer');

// Three.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.z = 5;

//Create a sphere to move with the mouse
const geometry = new THREE.SphereGeometry(0.2, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Event listener for mouse moement
container.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;
  sphere.position.x = x * 2;
  sphere.position.y = y * 2;
  console.log(`Mouse moved to: (${x}, ${y})`);
});

// Event listener for mouse clicks
container.addEventListener('click', (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(`Mouse clicked at: (${x}, ${y})`);

  // Indicate mouse click by changing sphere color briefly
  sphere.material.color.set(0x00ff00);
  setTimeout(() => {
    sphere.material.color.set(0xff0000);
  }, 200);
});

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
