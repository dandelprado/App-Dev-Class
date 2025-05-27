
function animate() {
  requestAnimationFrame(animate);
  updateBullets();

  enemySpotlight.position.copy(camera.position);
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  crosshairTarget.position.copy(camera.position).add(direction.multiplyScalar(50));

  if (moveForward) controls.moveForward(moveSpeed);
  if (moveBackward) controls.moveForward(-moveSpeed);
  if (moveLeft) controls.moveRight(-moveSpeed);
  if (moveRight) controls.moveRight(moveSpeed);

  const clampRange = 500;
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -clampRange, clampRange);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -clampRange, clampRange);

  renderer.render(scene, camera);
}

animate();
