import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/DRACOLoader.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/PointerLockControls.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Stats from 'https://unpkg.com/three@0.153.0/examples/jsm/libs/stats.module.js';

let renderer, scene, camera, controls, world, statsFPS, statsMemory, statsFrameTime;
let listener, bulletSound;

const clock = new THREE.Clock();
const bulletArray = [], enemyArray = [];
const shootVelocity = 25, bulletLife = 5;
let enemyModel, bulletModel;

let shakeTime = 0;
const shakeDuration = 0.3; 
const shakeIntensity = 2;

const moveSpeed = 10;
const keysPressed = {};

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://unpkg.com/three@0.153.0/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

window.addEventListener('load', init);

function setupScene() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('threejsContainer').appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);

    listener = new THREE.AudioListener();
    camera.add(listener);

    scene.add(camera);

    controls = new PointerLockControls(camera, document.body);
    controls.pointerSpeed = 0.8;

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 10, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);
}

async function loadModels() {
    enemyModel = await loadGLTF('assets/models/spaceship/spaceship.glb');
    bulletModel = await loadGLTF('assets/models/bullet/bullet.glb');
}

async function loadAudio() {
    const audioLoader = new THREE.AudioLoader();
    bulletSound = new THREE.Audio(listener);

    return new Promise((resolve, reject) => {
        audioLoader.load('assets/audio/gunsound.mp3', (buffer) => {
            bulletSound.setBuffer(buffer);
            bulletSound.setVolume(0.5);
            resolve();
        }, undefined, reject);
    });
}

function loadGLTF(path) {
    return new Promise((resolve, reject) => {
        loader.load(path, gltf => {
            const model = gltf.scene;
            model.traverse(node => {
                if (node.isMesh) node.castShadow = true;
            });
            resolve(model);
        }, undefined, reject);
    });
}

function setupPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
}

function createListeners() {
    const ui = document.getElementById('ui');

    document.body.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        ui.style.display = 'none';
        console.log('Pointer Lock Activated');
    });

    controls.addEventListener('unlock', () => {
        ui.style.display = 'block';
        console.log('Pointer Lock Deactivated');
    });

    document.addEventListener('click', (event) => {
        if (controls.isLocked) {
            shootBullet();
        }
    });
}

function createFloor() {
    const floorGeo = new THREE.PlaneGeometry(1000, 1000);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.position.set(0, -0.01, 0);
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);
}

const uiContainer = document.createElement('div');
uiContainer.style.position = 'absolute';
uiContainer.style.top = '2%';
uiContainer.style.left = '38%';
uiContainer.style.zIndex = '100';
uiContainer.style.color = '#fff';
uiContainer.innerHTML = `
                <label> Click Spawn button to add:
                    <input id="enemyCount" type="number" min="1" max="100" value="100" style="width: 60px; padding: 5px; border-radius: 15px; border: 1px solid #b8860b; margin-bottom: 10px;"/></label>
                <label>enemies
                <button id="spawnEnemies" style="padding: 5px 10px; border-radius: 5px; border: none; background-color: #007acc; color: white; cursor: pointer;">Spawn</button></label>
            `;
document.body.appendChild(uiContainer);

document.getElementById('spawnEnemies').addEventListener('click', () => {
    const count = parseInt(document.getElementById('enemyCount').value);
    createEnemies(count);
});

function createEnemies(amount) {
    enemyArray.forEach(enemy => {
        scene.remove(enemy);
        world.removeBody(enemy.cannonBody);
    });
    enemyArray.length = 0;

    for (let i = 0; i < amount; i++) {
        const enemy = enemyModel.clone();
        enemy.position.set(Math.random() * 500 - 250, 0, Math.random() * 500 - 250);
        scene.add(enemy);

        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5));
        const body = new CANNON.Body({ mass: 1 });
        body.addShape(shape);
        body.position.copy(enemy.position);
        world.addBody(body);

        enemy.cannonBody = body;
        enemyArray.push(enemy);
    }
}

function shootBullet() {
    if (!bulletModel) return;

    const bullet = bulletModel.clone();
    bullet.position.copy(camera.position);
    scene.add(bullet);

    const shape = new CANNON.Sphere(0.2);
    const body = new CANNON.Body({ mass: 10.1 });
    body.addShape(shape);
    body.position.copy(camera.position);
    body.position.y += 0.5;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.multiplyScalar(shootVelocity);
    body.velocity.set(forward.x, forward.y, forward.z);

    world.addBody(body);
    bullet.cannonBody = body;
    bulletArray.push(bullet);

    if (bulletSound.isPlaying) {
        bulletSound.stop();
    }
    bulletSound.play();

    shakeTime = shakeDuration;
    console.log('Screen shake triggered');

    setTimeout(() => {
        scene.remove(bullet);
        world.removeBody(body);
        bulletArray.splice(bulletArray.indexOf(bullet), 1);
    }, bulletLife * 1000);
}

function handleMovement(delta) {
    const direction = new THREE.Vector3();
    if (keysPressed['w']) direction.z -= 1;
    if (keysPressed['s']) direction.z += 1;
    if (keysPressed['a']) direction.x -= 1;
    if (keysPressed['d']) direction.x += 1;

    direction.normalize();
    direction.applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(direction, moveSpeed * delta);
}

function detectCollisions() {
    bulletArray.forEach(bullet => {
        enemyArray.forEach(enemy => {
            const distance = bullet.cannonBody.position.distanceTo(enemy.cannonBody.position);
            if (distance < 1) {
                const pushDirection = new CANNON.Vec3(
                    enemy.cannonBody.position.x - bullet.cannonBody.position.x,
                    0,
                    enemy.cannonBody.position.z - bullet.cannonBody.position.z
                );
                pushDirection.normalize();
                enemy.cannonBody.applyImpulse(pushDirection.scale(5), enemy.cannonBody.position);
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    world.step(1 / 60, delta);

    handleMovement(delta);
    detectCollisions();

    const originalPosition = camera.position.clone();

    if (shakeTime > 0) {
        console.log('Shaking: ${shakeTime} seconds remaining');
        camera.position.x += (Math.random() - 0.5) * shakeIntensity;
        camera.position.y += (Math.random() - 0.5) * shakeIntensity;
        camera.position.z += (Math.random() - 0.5) * shakeIntensity;
        shakeTime -= delta;
        if (shakeTime <= 0) {
            shakeTime = 0;

            camera.position.copy(originalPosition);
            console.log('Screen shake ended');
        }
    }

    enemyArray.forEach(enemy => enemy.position.copy(enemy.cannonBody.position));
    bulletArray.forEach(bullet => bullet.position.copy(bullet.cannonBody.position));

    const floorLevel = 1;
    if (camera.position.y < floorLevel) {
        camera.position.y = floorLevel;
    }

    const maxPitch = Math.PI / 2.5;
    const minPitch = -Math.PI / 2.5;

    const pitchObject = controls.getObject().children.find(child => child.isCamera);

    if (pitchObject) {
        pitchObject.rotation.x = THREE.MathUtils.clamp(pitchObject.rotation.x, minPitch, maxPitch);
    }

    statsFPS.update();
    statsMemory.update();
    statsFrameTime.update();
    renderer.render(scene, camera);
}

window.addEventListener('keydown', (e) => (keysPressed[e.key.toLowerCase()] = true));
window.addEventListener('keyup', (e) => (keysPressed[e.key.toLowerCase()] = false));

async function init() {
    setupScene();
    await loadModels()
    await loadAudio();
    setupPhysics();
    createFloor();
    createEnemies(0);
    createListeners();

    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    document.body.appendChild(statsContainer);

    statsFPS = new Stats();
    statsFPS.showPanel(0);
    statsFPS.dom.id = 'stats-fps';
    statsContainer.appendChild(statsFPS.dom);

    statsMemory = new Stats();
    statsMemory.showPanel(2);
    statsMemory.dom.id ='stats-memory';
    statsContainer.appendChild(statsMemory.dom);

    statsFrameTime = new Stats();
    statsFrameTime.showPanel(1);
    statsFrameTime.dom.id ='stats-frametime';
    statsContainer.appendChild(statsFrameTime.dom);

    animate();
}

