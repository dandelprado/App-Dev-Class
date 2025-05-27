import * as THREE from 'three';
let renderer, scene, container, camera;

window.addEventListener("load", function() {
    start();
});

async function start() {
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container = document.querySelector("#threejsContainer"); 
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.set(0, 1, 5);

    const upperTorus = new THREE.TorusGeometry(0.8, 0.13, 4, 100);
    const materialUpperTorus = new THREE.MeshStandardMaterial({ color: 0xf15bb5 });
    const torus = new THREE.Mesh(upperTorus, materialUpperTorus);
    torus.position.set(0, 2.5, 0);
    scene.add(torus);

    const lowerTorus = new THREE.TorusGeometry(0.4, 0.13, 16, 100);
    const materialLowerTorus = new THREE.MeshStandardMaterial({ color: 0xff99c8 });
    const torus2 = new THREE.Mesh(lowerTorus, materialLowerTorus);
    torus2.position.set(0, 2.5, 0);
    scene.add(torus2);

    const capsuleLight = new THREE.CapsuleGeometry(0.2, 0.2, 0.65,7);
    const materialCapsuleLight = new THREE.MeshStandardMaterial({ color: 0xfbca0f });
    const capsule = new THREE.Mesh(capsuleLight, materialCapsuleLight);
    capsule.position.set(0, 2.2, 0.1);
    scene.add(capsule);

    const coneLight = new THREE.ConeGeometry(0.5, 0.8, 100);
    const materialConeLight = new THREE.MeshStandardMaterial({ color: 0x97e65f });
    const cone = new THREE.Mesh(coneLight, materialConeLight);
    cone.position.set(0, 2, 0.0005);
    scene.add(cone);

    const cylinderLight = new THREE.CylinderGeometry(0.5, 0.5, 1.5);
    const materialCylinderLight = new THREE.MeshStandardMaterial({ color: 0x00bbf9 });
    const cylinder = new THREE.Mesh(cylinderLight, materialCylinderLight);
    cylinder.position.set(0, 0.85, 0);
    scene.add(cylinder);

    const boxBase = new THREE.BoxGeometry(1, 1, 1);
    const materialBoxBase = new THREE.MeshStandardMaterial({ color: 0x9b5de5 });
    const base = new THREE.Mesh(boxBase, materialBoxBase);
    base.position.set(0, -0.4, 0);
    base.rotation.set(0, Math.PI / 4, 0);
    scene.add(base);

    const light01 = new THREE.PointLight(0xffffff, 1, 500, 50);
    light01.position.set(3, 4, 5);
    scene.add(light01);

    const light02 = new THREE.PointLight(0xffffff, 1, 500, 50);
    light02.position.set(-3, 3, 5);
    scene.add(light02);

    renderer.render(scene, camera);

}
