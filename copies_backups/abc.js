import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var mouse = { x: 0, y: 0 };
var flashlight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 8000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-80); // Reverse the camera position along the Z-axis
camera.position.setX(0); // Set the camera position along the X-axis

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

let newRoom = 0;
let imgI = 0;
const images = ["images/1.jpg", "images/2.jpg", "images/3.png", "images/4.png", "images/5.jpg", "images/6.jpg", "images/3.png"];
for (let index = 0; index < 20; index++) {
  for (let i = 0; i < 5; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    let pitch = 0;
    let yaw = 0;
    switch (i) {
      case 1:
        x = -700;
        y = 0;
        z = newRoom;
        pitch = 0;
        yaw = 1;
        imgI = Math.floor(Math.random() * images.length);
        scene.add(getGround(x, y, z, pitch, yaw, imgI));
        break;
      case 2:
        x = 700;
        y = 0;
        z = newRoom;
        pitch = 0;
        yaw = -1;
        imgI = Math.floor(Math.random() * images.length);
        scene.add(getGround(x, y, z, pitch, yaw, imgI));
        break;
      case 3:
        x = 0;
        y = 700;
        z = newRoom;
        pitch = 1;
        yaw = 0;
        imgI = Math.floor(Math.random() * images.length);
        scene.add(getGround(x, y, z, pitch, yaw, imgI));
        break;
      case 4:
        x = 0;
        y = -700;
        z = newRoom;
        pitch = -1;
        yaw = 0;
        imgI = 6;
        scene.add(getGround(x, y, z, pitch, yaw, imgI));
        break;
    }
  }
  newRoom -= 1500;
}

function getGround(x, y, z, pitch, yaw, i) {
  let texture = new THREE.TextureLoader().load(images[i]);
  const groundGeometry = new THREE.PlaneGeometry(1500, 1500, 1500);
  const groundMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.set(-x, y, -z); // Negate the X and Z positions
  ground.rotation.set(pitch * (Math.PI / 2), -yaw * (Math.PI / 2), 0); // Negate the yaw rotation
  return ground;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

let TurnOFF = Math.random() * 100000;
let id = setInterval(flicker, 100);

function flicker() {
  spotlight.intensity = Math.floor((Math.random() * 5) + 5) / 10;
}

let stop = setInterval(() => {
  spotlight.intensity = 0;
  clearInterval(id);
  setTimeout(() => {
    id = setInterval(flicker, 100);
  }, 750);
}, TurnOFF);

const loader = new GLTFLoader();

loader.load('models/scene.gltf', function (gltf) {
  flashlight = gltf.scene;
  scene.add(flashlight);
  flashlight.add(spotlight);
  flashlight.rotation.y = Math.PI; // Reverse the flashlight rotation
  flashlight.position.z = -30; // Reverse the flashlight position along the Z-axis
  flashlight.position.x = -1; // Reverse the flashlight position along the X-axis
  flashlight.position.y = -40;
  document.addEventListener('mousemove', onMouseMove, false);
}, undefined, function (error) {
  console.error(error);
});

const spotlight = new THREE.SpotLight(0xffffff);
spotlight.angle = 0.50;
spotlight.penumbra = 1;
spotlight.decay = 20;

animate();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var target = new THREE.Vector3().addVectors(camera.position, dir.multiplyScalar(100));

  var vector2 = new THREE.Vector3(-mouse.x, -mouse.y, 0.5);
  vector2.unproject(camera);

  var dir = vector2.sub(camera.position);
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));

  spotlight.position.copy(pos);

  flashlight.lookAt(target);
}

document.onkeydown = checkKey;
let moveRate = 20;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode === 38) {
    // Move forward
    camera.position.z += moveRate; // Reverse the camera movement
    flashlight.position.z += moveRate; // Reverse the flashlight movement
  } else if (e.keyCode === 40) {
    // Move backward
    camera.position.z -= moveRate; // Reverse the camera movement
    flashlight.position.z -= moveRate; // Reverse the flashlight movement
  }
}

/* const amb = new THREE.AmbientLight(0xffffffff)
scene.add(amb) */