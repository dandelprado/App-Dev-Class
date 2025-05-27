import * as THREE from "three";

let renderer, scene, container, camera;
//let geometryCylinder;
let geometryTorusKnot;


window.addEventListener("load", function() {
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
  camera.position.set(0, 15, 10);
  camera.rotation.set(THREE.MathUtils.degToRad(-50), 0, 0);


  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('assets/semento.jpg');

  const geometryPlane = new THREE.PlaneGeometry(30, 20);

  const materialPlaneAliceBlue = new THREE.MeshStandardMaterial({ color: 0xf0f8ff });
  const materialPlane = new THREE.MeshStandardMaterial({ map: texture });
  const plane = new THREE.Mesh(geometryPlane, materialPlane);
  plane.position.set(0, 0, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);

//  geometryCylinder = new THREE.CylinderGeometry(0.7, 0.7, 2.75);
  geometryTorusKnot = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);

  const materialCylinderDaffodil = new THREE.MeshStandardMaterial({color: 0xffff31, metalness: 0.1, roughness: 0 });
  const torusKnot01 = new THREE.Mesh(geometryTorusKnot, materialCylinderDaffodil);
  torusKnot01.position.set(-5, 2, 0);
  torusKnot01.castShadow = true;
  scene.add(torusKnot01);
//  const cylinder01= new THREE.Mesh(geometryCylinder, materialCylinderDaffodil);
//  cylinder01.position.set(-5, 1, 0);
//  cylinder01.castShadow = true;
//  scene.add(cylinder01);

  const materialCylinderParadisePink = new THREE.MeshStandardMaterial({color: 0xe63e62, metalness: 0.1, roughness: 0 });
  const torusKnot02 = new THREE.Mesh(geometryTorusKnot, materialCylinderParadisePink);
  torusKnot02.position.set(0, 2, 0);
  torusKnot02.castShadow = true;
  scene.add(torusKnot02);
//  const cylinder02 = new THREE.Mesh(geometryCylinder, materialCylinderParadisePink);
//  cylinder02.position.set(0, 1, 0);
//  cylinder02.castShadow = true;
//  scene.add(cylinder02);

  const materialCylinderSeaGreen3 = new THREE.MeshStandardMaterial({color: 0x43cd80, metalness: 0.1, roughness: 0 });
  const torusKnot03 = new THREE.Mesh(geometryTorusKnot, materialCylinderSeaGreen3);
  torusKnot03.position.set(5, 2, 0);
  torusKnot03.castShadow = true;
  scene.add(torusKnot03);
//  const cylinder03 = new THREE.Mesh(geometryCylinder, materialCylinderSeaGreen3);
//  cylinder03.position.set(5, 1, 0);
//  cylinder03.castShadow = true;
//  scene.add(cylinder03);

  const ambientLight = new THREE.AmbientLight(0x222222, 0.15);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xfff1e0, 0.3, 500, 50);
  pointLight.castShadow = true;
  pointLight.position.set(-6, 12, 5);
  scene.add(pointLight);

  const spotLight = new THREE.SpotLight(0x88ccff, 0.5, 500, 50);
  spotLight.castShadow = true;
  spotLight.target = torusKnot02;
//  spotLight.target = cylinder02;
  spotLight.position.set(-1, 8, 10);
  scene.add(spotLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.castShadow = true;
  directionalLight.position.set(12, 20, 10);
  scene.add(directionalLight);

  pointLight.shadow.mapSize.width = 64;
  pointLight.shadow.mapSize.height = 64;

  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;

  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;

  animate();
  function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
  }
}
