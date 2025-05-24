import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';

let scene, camera, renderer, world, diceMesh, diceBody;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game-container').appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x303030 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

  const floorBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: new CANNON.Material(),
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floorBody);

  const diceGeo = new THREE.BoxGeometry(1, 1, 1);
  const diceMaterials = [1, 2, 3, 4, 5, 6].map(num =>
    new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(`https://i.imgur.com/0rKf5IA.png`),
    })
  );
  diceMesh = new THREE.Mesh(diceGeo, diceMaterials);
  scene.add(diceMesh);

  diceBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    position: new CANNON.Vec3(0, 5, 0),
  });
  world.addBody(diceBody);
}

function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  diceMesh.position.copy(diceBody.position);
  diceMesh.quaternion.copy(diceBody.quaternion);

  renderer.render(scene, camera);
}

window.rollDice = function () {
  diceBody.velocity.set(Math.random() * 5, 10, Math.random() * 5);
  diceBody.angularVelocity.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
  document.getElementById('result').textContent = 'Rolling...';

  setTimeout(() => {
    const number = Math.floor(Math.random() * 6) + 1;
    let message = `You rolled a ${number}!`;

    if (number === 6) {
      message += ' 🎉 You Win!';
    } else if (number === 1) {
      message += ' 😢 You Lose!';
    } else {
      message += ' Try Again!';
    }

    document.getElementById('result').textContent = message;
  }, 2000);
};
