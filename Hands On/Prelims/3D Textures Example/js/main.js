import * as THREE from "three";

let renderer, scene, container, camera;
let geometryCube, materialCube, cube;

window.addEventListener("load", function () {
  start();
});

async function start() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container = document.querySelector("#threejsContainer");
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(2, 1, 3);

  geometryCube = new THREE.BoxGeometry(1.5, 1.5, 1.5);

  const map = new THREE.TextureLoader().load('/assets/texture_rubber.jpg',
  function ( texture ) {
    materialCube = new THREE.MeshStandardMaterial({ color: 0xff99cc, map: texture });
    cube = new THREE.Mesh(geometryCube, materialCube);
    cube.position.set(2, 1, 0);
    cube.rotation.set(Math.PI/8, Math.PI/4, 0);
    scene.add(cube);
    render();
    }
  );

  const light01 = new THREE.PointLight(0xffffff, 1, 500, 50);
  light01.position.set(4, 5, 5);
  scene.add(light01);

  const light02 = new THREE.PointLight(0xffffff, 1, 500, 50);
  light02.position.set(-4, 3, 5);
  scene.add(light02);

  function render() {
    renderer.render(scene, camera);
  }

}
