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

    const geometryTorusKnot = new THREE.TorusKnotGeometry(0.25, 0.075, 64, 16);
    const materialTorusKnot = new THREE.MeshStandardMaterial({ color: 0xff00cc });
    const torusKnot = new THREE.Mesh(geometryTorusKnot, materialTorusKnot);
    torusKnot.position.set(-4, 1.5, 0);
    scene.add(torusKnot);

    const geometryPlane = new THREE.PlaneGeometry(0.5, 0.5);
    const materialPlane = new THREE.MeshStandardMaterial({ color: 0x00cc99 });
    const plane = new THREE.Mesh(geometryPlane, materialPlane);
    plane.position.set(-3.2, 1.5, 0);
    scene.add(plane);

    const geometrySphere = new THREE.SphereGeometry(0.35, 16, 16);
    const materialSphere = new THREE.MeshStandardMaterial({ color: 0x00ccff });
    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.position.set(-2.5, 1.5, 0);
    scene.add(sphere);

    const geometryCapsule = new THREE.CapsuleGeometry(0.25, 0.5, 4, 8);
    const materialCapsule = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const capsule = new THREE.Mesh(geometryCapsule, materialCapsule);
    capsule.position.set(-1.8, 1.5, 0);
    scene.add(capsule);

    const geometryCube = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const materialCube = new THREE.MeshStandardMaterial({ color: 0xcc00ff });
    const cube = new THREE.Mesh(geometryCube, materialCube);
    cube.position.set(-1.1, 1.5, 0);
    scene.add(cube);

    const geometryRing = new THREE.RingGeometry(0.2, 0.5, 32);
    const materialRing = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const ring = new THREE.Mesh(geometryRing, materialRing);
    ring.position.set(-0.2, 1.5, 0);
    scene.add(ring);

    const geometryCircle = new THREE.CircleGeometry(0.5, 64);
    const materialCircle = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const circle = new THREE.Mesh(geometryCircle, materialCircle);
    circle.position.set(0.9, 1.5, 0);
    scene.add(circle);

    const geometryCylinder = new THREE.CylinderGeometry(0.35, 0.35, 0.75);
    const materialCylinder = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
    cylinder.position.set(1.8, 1.5, 0);
    scene.add(cylinder);

    const geometryCone = new THREE.ConeGeometry(0.5, 1, 32);
    const materialCone = new THREE.MeshStandardMaterial({ color: 0x6600ff });
    const cone = new THREE.Mesh(geometryCone, materialCone);
    cone.position.set(2.8, 1.5, 0);
    scene.add(cone);

    const geometryTorus = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const materialTorus = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const torus = new THREE.Mesh(geometryTorus, materialTorus);
    torus.position.set(3.8, 1.5, 0);
    scene.add(torus);

/*    const geometrySphere1 = new THREE.SphereGeometry(0.35, 16, 16);
    const materialSphere1 = new THREE.MeshStandardMaterial({ color: 0x00ccff });
    const sphere1 = new THREE.Mesh(geometrySphere1, materialSphere1);
    sphere.position.set(-2.5, 1.5, 0);
    scene.add(sphere1);
*/

    const light01 = new THREE.PointLight(0xffffff, 1, 500, 50);
    light01.position.set(3, 4, 5);
    scene.add(light01);

    const light02 = new THREE.PointLight(0xffffff, 1, 500, 50);
    light02.position.set(-3, 3, 5);
    scene.add(light02);

    renderer.render(scene, camera);

}



