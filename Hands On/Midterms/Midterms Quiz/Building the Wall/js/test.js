function animate() {
  requestAnimationFrame(animate);
  
  orbitControls.enabled = !controls.isLocked;  // Disable orbit controls when locked

  if (!gameOver) {
    updateBullets();
  }

  orbitControls.update();
  renderer.render(scene, camera);
}
