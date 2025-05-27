import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/OrbitControls.js';

let arrowPressed = { left: false, right: false, up: false, down: false };
let sphereVisible = true; // flag to check if mouse movement indicator sphere is visible
let cubeColorChanged = false; // flag to check if cube color has been changed
let velocityX = 0, velocityZ = 0; // Velocity for movement
let acceleration = 0.02; // Acceleration factor
let friction = 0.9; // Friction factor (slows down movement)
let velocityY = 0; // Vertical velocity for jumping
let gravity = 0.001; // Gravity effect
let isJumping = false;

let initialMouseX = 0;
let initialMouseY = 0;
let initialObjectX = 0;
let initialObjectY = 0;

const container = document.getElementById('threejsContainer');

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejsContainer').appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const circleGeometry = new THREE.CircleGeometry();
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.y = 0;
scene.add(circle);

const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

container.addEventListener('mousemove', (event) => {

  if(!sphereVisible) {
    sphere.material.color.set(0xff0000);
    sphere.visible = true;
    sphereVisible = false;
  }
  
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;
  sphere.position.x = x * 2;
  sphere.position.y = y * 2;
});

camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;

function getRandomColor() {
  return Math.floor(Math.random() * 16777215);
}

document.addEventListener(
    "keydown",
    (event) => {
      const keyName = event.key.toLowerCase(); // tolowercase() seems to mess with "Arrow" keys
      switch (keyName) {
        case "w":
          arrowPressed.up = true;
          break;
        case "s":
          arrowPressed.down = true;
          break;
        case "d":
          arrowPressed.right = true;
          break;
        case "a":
          arrowPressed.left = true;
          break;
      case " ":
        if (!isJumping) {
          velocityY = 0.075;
          isJumping = true;
        }
        break;
      }
    },
    false,
);

  document.addEventListener(
    "keyup",
    (event) => {
      const keyName = event.key.toLowerCase();
      switch (keyName) {
        case "w":
          arrowPressed.up = false;
          break;
        case "s":
          arrowPressed.down = false;
          break;
        case "d":
          arrowPressed.right = false;
          break;
        case "a":
          arrowPressed.left = false;
          break;
        case " ":
          arrowPressed.space = false;
          break;
      }
    },
    false,
  );

window.addEventListener("mousedown", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    selectedObject = intersects[0].object;
    if (selectedObject === cube && !cubeColorChanged) {
      selectedObject.material.color.set(getRandomColor());
      cubeColorChanged = true;
    }
  
    initialMouseX = mouse.x;
    initialMouseY = mouse.y;
    initialObjectX = selectedObject.position.x;
    initialObjectY = selectedObject.position.y;
  }

  sphere.material.color.set(0x0000ff);
  setTimeout(() => {
    sphere.visible = false;
    sphereVisible = false;
    }, 300);
});

  window.addEventListener("mousemove", (event) => {
    if (selectedObject) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      selectedObject.position.x = initialObjectX + (x - initialMouseX) * 2;
      selectedObject.position.y = initialObjectY + (y - initialMouseY) * 2;
    }
  });

  window.addEventListener("mouseup", () => {
    selectedObject = null;
    cubeColorChanged = false;
  });

  function animate() {
    if (arrowPressed.left) velocityX -= acceleration; 
    if (arrowPressed.right) velocityX += acceleration;
    if (arrowPressed.up) velocityZ -= acceleration;
    if (arrowPressed.down) velocityZ += acceleration;

    velocityX *= friction;
    velocityZ *= friction;

    cube.position.x += velocityX;
    cube.position.z += velocityZ;

    if (isJumping) {
      circle.position.y += velocityY;
      velocityY -= gravity;

    if (circle.position.y <= 0 && velocityY < 0) {
      circle.position.y = 0;
      velocityY = 0;
      isJumping = false;
    }
  }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
