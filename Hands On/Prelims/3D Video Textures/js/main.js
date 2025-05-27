import * as THREE from "three";
import { RGBELoader } from "https://unpkg.com/three@0.153.0/examples/jsm/loaders/RGBELoader.js";

let renderer, scene, container, camera;
let geometryPlane, videoPlane

const videoElement = document.querySelector("#videoElement");

window.addEventListener("load", function () {
  start();
});

async function start() {

  videoElement.volume = volumeSlider.value / 100;

  document.querySelector("#videoPlayBtn").addEventListener("click", function () {
    videoElement.currentTime = 0
    videoElement.play();
  
  });

  document.querySelector("#videoPauseBtn").addEventListener("click", function () {
    videoElement.pause();
  });

  document.querySelector("#videoResumeBtn").addEventListener("click", function () {
    videoElement.play();
  });

  volumeSlider.addEventListener("input", function () {
    videoElement.volume = volumeSlider.value / 100;
  })

  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container = document.querySelector("#threejsContainer");
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 5);

  const textureLoader = new THREE.TextureLoader();
  const backgroundTexture = textureLoader.load("./assets/sinehan.jpg");
  scene.background = backgroundTexture;

  const materialVideo = new THREE.MeshStandardMaterial();
  const videoTexture = new THREE.VideoTexture(videoElement);
  materialVideo.map = videoTexture;

  // To be used on sinehan.jpg background so it fits the screen size
  //
  geometryPlane = new THREE.PlaneGeometry(8.58, 3.09);
  videoPlane = new THREE.Mesh(geometryPlane, materialVideo);
  videoPlane.position.set(0, 1.89, 0);
  scene.add(videoPlane);

/*  geometryPlane = new THREE.PlaneGeometry(5.5, 2);
  videoPlane = new THREE.Mesh(geometryPlane, materialVideo);
  videoPlane.position.set(0, 1.5, 0);
  scene.add(videoPlane);

*/


  const light01 = new THREE.PointLight(0xffffff, 1, 500, 50);
  light01.position.set(4, 5, 5);
  scene.add(light01);

  const light02 = new THREE.PointLight(0xffffff, 1, 500, 50);
  light02.position.set(-4, 3, 5);
  scene.add(light02);

  animate();
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}
