import * as THREE from "three";

let renderer, scene, container, camera;
let cube01, cube02, materialCube01, materialCube02;

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
  camera.position.set(0, 4, 12);
  camera.rotation.set(THREE.MathUtils.degToRad(-20), 0, 0);

  const textureLoader = new THREE.TextureLoader();
  const planeTexture = textureLoader.load('./assets/waves.png', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  });


  const geometryPlane = new THREE.PlaneGeometry(15, 20);
  const materialPlane = new THREE.MeshStandardMaterial({ color: 0xffffff, map: planeTexture });
  const plane = new THREE.Mesh(geometryPlane, materialPlane);
  plane.position.set(0.5, -2, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  const spotLight01 = new THREE.SpotLight(0xffffff, 0.25, 500, 50);
  spotLight01.castShadow = true;
  spotLight01.position.set(-2, 5, 5);
  scene.add(spotLight01);

  const spotLight02 = new THREE.SpotLight(0xffffff, 0.25, 500, 50);
  spotLight02.castShadow = true;
  spotLight02.position.set(2, 5, 5);
  scene.add(spotLight02);

  const geometryCube = new THREE.BoxGeometry(2, 2, 2);

  const map01 = new THREE.TextureLoader().load('./assets/fish1.jpg',
  function ( texture ) {
    materialCube01 = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0.1, roughness: 0, map: texture });
    materialCube01.map.wrapS = THREE.MirroredRepeatWrapping;
    materialCube01.map.wrapT = THREE.MirroredRepeatWrapping;
    cube01 = new THREE.Mesh(geometryCube, materialCube01);
    cube01.position.set(-1.5, 0, 3);
    cube01.rotation.set(0, Math.PI/4, 0);
//    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / totalFrames, 1);



    cube01.castShadow = true;
    spotLight02.target = cube01;
    scene.add(cube01);
    }
  );

  const map02 = new THREE.TextureLoader().load('./assets/fish2.jpg',
  function (texture ) {
    materialCube02 = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0.1, roughness: 0, map: texture });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    materialCube02.map.wrapS = THREE.MirroredRepeatWrapping;
    materialCube02.map.wrapT = THREE.MirroredRepeatWrapping;
    cube02 = new THREE.Mesh(geometryCube, materialCube02);
    cube02.position.set(2, 0, 3);
    cube02.rotation.set(0, Math.PI/4, 0);

    cube02.castShadow = true;
    spotLight01.target = cube02;
    scene.add(cube02);
    }
  );

  const totalFrames = 8;
  const frameDelay = 4;
  let materialCube01Counter = 0;

  function animate() {
    if (materialCube01) {
//      materialCube01.map.offset.x += 0.1;
      if (materialCube01Counter % frameDelay == 0) {
        materialCube01.map.offset.x = (materialCube01Counter / frameDelay) % totalFrames / totalFrames;
      }
      materialCube01Counter++;
    }

    if(materialCube02) materialCube02.map.offset.y -= 0.005;
    if(materialPlane) materialPlane.map.offset.y += -0.0015;


  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  }

  animate();

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);
}
