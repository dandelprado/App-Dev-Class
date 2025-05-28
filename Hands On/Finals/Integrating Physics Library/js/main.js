import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/DRACOLoader.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/PointerLockControls.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Stats from 'https://unpkg.com/three@0.153.0/examples/jsm/libs/stats.module.js';

let renderer, scene, camera, controls, world, statsFPS, statsMemory, statsFrameTime;
let listener, bulletSound;
let floorTexture;
let dustParticles;
const dustParticleCount = 8000;
const dustArea = 500;

let floorMesh;

const clock = new THREE.Clock();
const bulletArray = [];
const enemyArray = [];
const shootVelocity = 25;
const bulletLife = 2;
const bulletRadius = 0.9;
const collisionThreshold = bulletRadius + 1.225;

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
    renderer.setClearColor(0x87ceeb, 1);
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
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.solver.tolerance = 0.001;

    world.addEventListener('postStep', () => {
    });
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
        if (controls.isLocked) shootBullet();
    });
}

function createFloor() {
    const floorGeo = new THREE.PlaneGeometry(1000, 1000);
    const textureLoader = new THREE.TextureLoader();
    floorTexture = textureLoader.load('assets/textures/floor_texture.png');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(50, 50);

    const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture, color: 0x999999, roughness: 0.8 });
    floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: world.defaultContactMaterial });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);
}

function createDustParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dustParticleCount * 3);
    const colors = new Float32Array(dustParticleCount * 3);
    const sizes = new Float32Array(dustParticleCount);
    const opacities = new Float32Array(dustParticleCount);

    for (let i = 0; i < dustParticleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = Math.random() * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

        const color = new THREE.Color(0xd2b48c).lerp(new THREE.Color(0xf5f5dc), Math.random() * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 0.3 + 0.1;
        opacities[i] = Math.random() * 0.5 + 0.3;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 12);
    gradient.addColorStop(0, 'rgba(245, 225, 220, 0.9)');
    gradient.addColorStop(1, 'rgba(245, 225, 220, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const particleMaterial = new THREE.PointsMaterial({ size: 0.5, sizeAttenuation: true, map: texture, transparent: true, vertexColors: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
    dustParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(dustParticles);
    console.log('Dust particles created and added:', dustParticles);
}

const uiContainer = document.createElement('div');
uiContainer.style.position = 'absolute'; uiContainer.style.top = '2%'; uiContainer.style.left = '38%'; uiContainer.style.zIndex = '100'; uiContainer.style.color = '#fff';
uiContainer.innerHTML = `
    <label> Click Spawn button to add:
        <input id="enemyCount" type="number" min="1" max="100" value="100" style="width: 60px; padding: 5px; border-radius: 15px; border: 1px solid #b8860b; margin-bottom: 10px;"/></label>
    <label>enemies
    <button id="spawnEnemies" style="padding: 5px 10px; border-radius: 5px; border: none; background-color: #007acc; color: white; cursor: pointer;">Spawn</button></label>
`;
document.body.appendChild(uiContainer);
document.getElementById('spawnEnemies').addEventListener('click', () => createEnemies(parseInt(document.getElementById('enemyCount').value)));

function createEnemies(amount) {
    enemyArray.forEach(enemy => { scene.remove(enemy); world.removeBody(enemy.cannonBody); });
    enemyArray.length = 0;
    for (let i = 0; i < amount; i++) {
        const enemy = enemyModel.clone();
        enemy.position.set(Math.random() * 500 - 250, 0.5, Math.random() * 500 - 250);
        scene.add(enemy);
        console.log(`Spawning enemy at ${enemy.position.x}, ${enemy.position.y}, ${enemy.position.z}`);
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5));
        const body = new CANNON.Body({ mass: 1 });
        body.addShape(shape);
        body.position.copy(enemy.position);
        body.velocity.set(0, 0.1, 0);
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
    const body = new CANNON.Body({ mass: 5 });
    body.addShape(shape);
    body.position.copy(camera.position).vadd(new THREE.Vector3(0, 0.5, 0));
    const forward = new THREE.Vector3(); camera.getWorldDirection(forward).multiplyScalar(shootVelocity);
    body.velocity.copy(forward);
    world.addBody(body);
    bullet.cannonBody = body;
    const flashLight = new THREE.PointLight(0xffaa00, 5, 5);
    flashLight.position.copy(bullet.position);
    scene.add(flashLight);
    bullet.flashLight = flashLight;
    bullet.creationTime = clock.getElapsedTime();
    bullet.flashDuration = 0.5;
    bulletArray.push(bullet);
    if (bulletSound.isPlaying) bulletSound.stop();
    bulletSound.play();
    shakeTime = shakeDuration;
    setTimeout(() => { scene.remove(bullet); world.removeBody(body); scene.remove(flashLight); bulletArray.splice(bulletArray.indexOf(bullet), 1); }, bulletLife * 1000);
}

function handleMovement(delta) {
    const direction = new THREE.Vector3();
    if (keysPressed['w']) direction.z -= 1;
    if (keysPressed['s']) direction.z += 1;
    if (keysPressed['a']) direction.x -= 1;
    if (keysPressed['d']) direction.x += 1;
    direction.normalize().applyQuaternion(camera.quaternion);
    direction.y = 0;
    camera.position.addScaledVector(direction, moveSpeed * delta);
}

function detectCollisions() {
    bulletArray.forEach(bullet => {
        enemyArray.forEach(enemy => {
            const dist = bullet.cannonBody.position.distanceTo(enemy.cannonBody.position);
            if (dist < collisionThreshold) {
                const pushDir = new CANNON.Vec3(
                    enemy.cannonBody.position.x - bullet.cannonBody.position.x,
                    0,
                    enemy.cannonBody.position.z - bullet.cannonBody.position.z
                ).unit();

                enemy.cannonBody.applyImpulse(pushDir.scale(5), enemy.cannonBody.position);
                const bounceStrength = shootVelocity * 0.5;
                bullet.cannonBody.applyImpulse(pushDir.scale(-bounceStrength), bullet.cannonBody.position);
            
}
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    world.step(1 / 60, delta, 3);
    handleMovement(delta);
    detectCollisions();
    let shakeOffsetX = 0, shakeOffsetZ = 0;
    if (shakeTime > 0) {
        shakeOffsetX = (Math.random() - 0.5) * shakeIntensity;
        shakeOffsetZ = (Math.random() - 0.5) * shakeIntensity;
        shakeTime -= delta; if (shakeTime <= 0) shakeTime = 0;
    }
    if (floorMesh) { floorMesh.position.x = shakeOffsetX; floorMesh.position.z = shakeOffsetZ; }
    enemyArray.forEach(enemy => { enemy.position.copy(enemy.cannonBody.position); enemy.position.x += shakeOffsetX; enemy.position.z += shakeOffsetZ; });
    if (floorTexture) { floorTexture.offset.x += camera.position.x * 0.0015; floorTexture.offset.y += camera.position.z * 0.0001; }
    bulletArray.forEach(bullet => {
        bullet.position.copy(bullet.cannonBody.position);
        if (bullet.flashLight) {
            const elapsed = clock.getElapsedTime() - bullet.creationTime;
            const t = Math.min(elapsed / bullet.flashDuration, 1);
            bullet.flashLight.intensity = 5 * (1 - t);
            bullet.flashLight.position.copy(bullet.position);
            if (t >= 1) { scene.remove(bullet.flashLight); bullet.flashLight = null; }
        }
    });
    const cameraMinY = 1.0; camera.position.y = Math.max(camera.position.y, cameraMinY);
    enemyArray.forEach(enemy => { const body = enemy.cannonBody; const minY = 1.1; if (body.position.y < minY) { body.position.y = minY; body.velocity.y = 0; }});
    bulletArray.forEach(bullet => { const body = bullet.cannonBody; const minY = bulletRadius + 0.1; if (body.position.y < minY) { body.position.y = minY; body.velocity.y = 0; } bullet.position.copy(body.position); });
    const pitchObject = controls.getObject().children.find(child => child.isCamera);
    if (pitchObject) { pitchObject.rotation.x = THREE.MathUtils.clamp(pitchObject.rotation.x, -Math.PI/2.5, Math.PI/2.5); }
    if (dustParticles && dustParticles.geometry && dustParticles.material && dustParticles.material.uniforms) {
        const positions = dustParticles.geometry.attributes.position.array;
        const time = clock.getElapsedTime();
        dustParticles.material.uniforms.time.value = time;
        dustParticles.material.uniforms.cameraPos.value.copy(camera.position);
        for (let i = 0; i < dustParticleCount; i++) {
            positions[i * 3] += Math.sin(time + i * 0.1) * 0.005 * delta;
            positions[i * 3 + 1] += Math.cos(time + i * 0.2) * 0.003 * delta;
            positions[i * 3 + 2] += Math.sin(time + i * 0.3) * 0.005 * delta;
            const camX = camera.position.x, camZ = camera.position.z;
            if (positions[i*3] - camX > dustArea/2) positions[i*3] -= dustArea;
            if (positions[i*3] - camX < -dustArea/2) positions[i*3] += dustArea;
            if (positions[i*3+2] - camZ > dustArea/2) positions[i*3+2] -= dustArea;
            if (positions[i*3+2] - camZ < -dustArea/2) positions[i*3+2] += dustArea;
        }
        dustParticles.geometry.attributes.position.needsUpdate = true;
    }
    statsFPS.update(); statsMemory.update(); statsFrameTime.update();
    renderer.render(scene, camera);
}

window.addEventListener('keydown', e => (keysPressed[e.key.toLowerCase()] = true));
window.addEventListener('keyup', e => (keysPressed[e.key.toLowerCase()] = false));

async function init() {
    setupScene();
    await loadModels();
    await loadAudio();
    setupPhysics();
    createFloor();
    console.log('Creating dust particles...');
    createDustParticles();
    console.log('Dust particles created:', dustParticles);
    createEnemies(0);
    createListeners();
    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    document.body.appendChild(statsContainer);
    statsFPS = new Stats(); statsFPS.showPanel(0); statsFPS.dom.id = 'stats-fps'; statsContainer.appendChild(statsFPS.dom);
    statsMemory = new Stats(); statsMemory.showPanel(2); statsMemory.dom.id = 'stats-memory'; statsContainer.appendChild(statsMemory.dom);
    statsFrameTime = new Stats(); statsFrameTime.showPanel(1); statsFrameTime.dom.id = 'stats-frametime'; statsContainer.appendChild(statsFrameTime.dom);
    animate();
}

